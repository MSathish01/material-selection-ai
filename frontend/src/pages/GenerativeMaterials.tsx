import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Science, AutoAwesome, TrendingUp } from '@mui/icons-material';
import axios from 'axios';

const GenerativeMaterials: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [targetProperties, setTargetProperties] = useState({
    tensileStrength: '',
    density: '',
    thermalConductivity: '',
    corrosionResistance: 'high'
  });
  const [generatedMaterial, setGeneratedMaterial] = useState<any>(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/advanced/generate-material', {
        targetProperties: {
          tensileStrength: parseFloat(targetProperties.tensileStrength) || undefined,
          density: parseFloat(targetProperties.density) || undefined,
          thermalConductivity: parseFloat(targetProperties.thermalConductivity) || undefined,
          corrosionResistance: targetProperties.corrosionResistance
        }
      });
      setGeneratedMaterial(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <AutoAwesome sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <div>
            <Typography variant="h4" gutterBottom>
              Generative Material Discovery
            </Typography>
            <Typography variant="body2" color="text.secondary">
              AI-powered inverse design to create new materials with tailored properties
            </Typography>
          </div>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Tensile Strength (MPa)"
              type="number"
              value={targetProperties.tensileStrength}
              onChange={(e) => setTargetProperties({ ...targetProperties, tensileStrength: e.target.value })}
              helperText="Desired tensile strength in megapascals"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Target Density (kg/m³)"
              type="number"
              value={targetProperties.density}
              onChange={(e) => setTargetProperties({ ...targetProperties, density: e.target.value })}
              helperText="Desired material density"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Thermal Conductivity (W/m·K)"
              type="number"
              value={targetProperties.thermalConductivity}
              onChange={(e) => setTargetProperties({ ...targetProperties, thermalConductivity: e.target.value })}
              helperText="Desired thermal conductivity"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              select
              label="Corrosion Resistance"
              value={targetProperties.corrosionResistance}
              onChange={(e) => setTargetProperties({ ...targetProperties, corrosionResistance: e.target.value })}
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="excellent">Excellent</option>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              size="large"
              startIcon={loading ? <CircularProgress size={20} /> : <Science />}
              onClick={handleGenerate}
              disabled={loading}
              fullWidth
            >
              {loading ? 'Generating Material...' : 'Generate Material'}
            </Button>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {generatedMaterial && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Composition
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(generatedMaterial.composition.elements).map(([element, percentage]: [string, any]) => (
                    <Box key={element} sx={{ mb: 1 }}>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2">{element}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {percentage.toFixed(2)}%
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', bgcolor: 'grey.200', borderRadius: 1, height: 8 }}>
                        <Box
                          sx={{
                            width: `${percentage}%`,
                            bgcolor: 'primary.main',
                            height: '100%',
                            borderRadius: 1
                          }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Predicted Properties
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tensile Strength
                      </Typography>
                      <Typography variant="h6">
                        {generatedMaterial.predictedProperties.tensileStrength?.toFixed(0)} MPa
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Density
                      </Typography>
                      <Typography variant="h6">
                        {generatedMaterial.predictedProperties.density?.toFixed(0)} kg/m³
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Yield Strength
                      </Typography>
                      <Typography variant="h6">
                        {generatedMaterial.predictedProperties.yieldStrength?.toFixed(0)} MPa
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Thermal Conductivity
                      </Typography>
                      <Typography variant="h6">
                        {generatedMaterial.predictedProperties.thermalConductivity?.toFixed(1)} W/m·K
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Feasibility & Cost Analysis
                </Typography>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        Feasibility Score
                      </Typography>
                      <Typography variant="h4" color="primary">
                        {(generatedMaterial.feasibilityScore * 100).toFixed(0)}%
                      </Typography>
                      <Chip
                        label={generatedMaterial.feasibilityScore > 0.7 ? 'High' : generatedMaterial.feasibilityScore > 0.5 ? 'Medium' : 'Low'}
                        color={generatedMaterial.feasibilityScore > 0.7 ? 'success' : generatedMaterial.feasibilityScore > 0.5 ? 'warning' : 'error'}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        Estimated Cost
                      </Typography>
                      <Typography variant="h4" color="secondary">
                        ${generatedMaterial.estimatedCost.toFixed(2)}/kg
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box textAlign="center">
                      <Typography variant="body2" color="text.secondary">
                        Confidence
                      </Typography>
                      <Typography variant="h4">
                        {(generatedMaterial.confidence * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Synthesis Route
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {generatedMaterial.synthesisRoute.map((step: string, index: number) => (
                    <Box key={index} display="flex" alignItems="flex-start" mb={2}>
                      <Chip label={index + 1} size="small" color="primary" sx={{ mr: 2, mt: 0.5 }} />
                      <Typography variant="body2">{step}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default GenerativeMaterials;
