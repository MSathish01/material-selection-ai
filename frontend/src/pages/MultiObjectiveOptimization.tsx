import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Slider,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { TrendingUp, CompareArrows, EmojiEvents } from '@mui/icons-material';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const MultiObjectiveOptimization: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [objectives, setObjectives] = useState({
    performance: { enabled: true, weight: 8 },
    cost: { enabled: true, weight: 7 },
    sustainability: { enabled: true, weight: 6 },
    availability: { enabled: false, weight: 5 },
    manufacturability: { enabled: false, weight: 5 },
    reliability: { enabled: false, weight: 7 }
  });
  const [results, setResults] = useState<any>(null);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const enabledObjectives = Object.entries(objectives)
        .filter(([_, obj]) => obj.enabled)
        .map(([name, obj]) => ({
          name,
          weight: obj.weight / 10,
          minimize: name === 'cost'
        }));

      const response = await axios.post('http://localhost:5000/api/advanced/optimize/pareto-analysis', {
        query: {},
        objectives: enabledObjectives
      });
      setResults(response.data);
    } catch (err) {
      console.error('Error optimizing:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleObjective = (name: string) => {
    setObjectives({
      ...objectives,
      [name]: { ...objectives[name as keyof typeof objectives], enabled: !objectives[name as keyof typeof objectives].enabled }
    });
  };

  const updateWeight = (name: string, value: number) => {
    setObjectives({
      ...objectives,
      [name]: { ...objectives[name as keyof typeof objectives], weight: value }
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <CompareArrows sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <div>
            <Typography variant="h4" gutterBottom>
              Multi-Objective Optimization
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pareto-optimal material selection balancing multiple competing objectives
            </Typography>
          </div>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Select Optimization Objectives
        </Typography>

        <Grid container spacing={3}>
          {Object.entries(objectives).map(([name, obj]) => (
            <Grid item xs={12} md={6} key={name}>
              <Card variant="outlined">
                <CardContent>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={obj.enabled}
                        onChange={() => toggleObjective(name)}
                      />
                    }
                    label={
                      <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
                        {name}
                      </Typography>
                    }
                  />
                  {obj.enabled && (
                    <Box sx={{ mt: 2, px: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Weight: {obj.weight}
                      </Typography>
                      <Slider
                        value={obj.weight}
                        onChange={(_, value) => updateWeight(name, value as number)}
                        min={1}
                        max={10}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleOptimize}
          disabled={loading || !Object.values(objectives).some(obj => obj.enabled)}
          startIcon={loading ? <CircularProgress size={20} /> : <TrendingUp />}
        >
          {loading ? 'Optimizing...' : 'Run Optimization'}
        </Button>
      </Paper>

      {results && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Total Solutions
                  </Typography>
                  <Typography variant="h3">{results.totalSolutions}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pareto-Optimal
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {results.paretoOptimalCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Optimization Quality
                  </Typography>
                  <Typography variant="h3" color="success.main">
                    {((results.paretoOptimalCount / results.totalSolutions) * 100).toFixed(0)}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle', color: 'gold' }} />
              Pareto-Optimal Solutions
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  {Object.keys(results.paretoFront[0]?.objectives || {}).map(obj => (
                    <TableCell key={obj} align="right" sx={{ textTransform: 'capitalize' }}>
                      {obj}
                    </TableCell>
                  ))}
                  <TableCell align="right">Diversity</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.paretoFront.slice(0, 10).map((solution: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {index < 3 && (
                          <Chip
                            label={index + 1}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {solution.materialName}
                      </Box>
                    </TableCell>
                    {Object.entries(solution.objectives).map(([key, value]: [string, any]) => (
                      <TableCell key={key} align="right">
                        {value.toFixed(2)}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      {solution.crowdingDistance === Infinity ? '∞' : solution.crowdingDistance.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          {results.tradeoffAnalysis && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Trade-off Analysis
              </Typography>
              <Grid container spacing={2}>
                {Object.entries(results.tradeoffAnalysis).map(([key, value]: [string, any]) => (
                  <Grid item xs={12} md={6} key={key}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                          {key.replace(/_/g, ' ').toUpperCase()}
                        </Typography>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography variant="body2">Correlation:</Typography>
                          <Chip
                            label={value.correlation}
                            color={
                              value.relationship === 'positive' ? 'success' :
                              value.relationship === 'negative' ? 'error' : 'default'
                            }
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {value.relationship === 'positive' && 'These objectives align well'}
                          {value.relationship === 'negative' && 'Trade-off required between these objectives'}
                          {value.relationship === 'weak' && 'Objectives are largely independent'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {results.recommendations.map((rec: string, index: number) => (
              <Box key={index} display="flex" alignItems="flex-start" mb={2}>
                <Chip label={index + 1} size="small" color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Typography variant="body2">{rec}</Typography>
              </Box>
            ))}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default MultiObjectiveOptimization;
