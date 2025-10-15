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
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Rating,
  CircularProgress
} from '@mui/material';
import { LocalShipping, TrendingUp, Warning, CheckCircle, Store } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const SupplyChain: React.FC = () => {
  const [materialName, setMaterialName] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!materialName) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/advanced/supply-chain/${encodeURIComponent(materialName)}/analysis`
      );
      setAnalysis(response.data);
    } catch (err) {
      console.error('Error analyzing supply chain:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <LocalShipping sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <div>
            <Typography variant="h4" gutterBottom>
              Supply Chain Intelligence
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time supplier data, pricing analysis, and supply chain risk assessment
            </Typography>
          </div>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Material Name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              placeholder="e.g., AISI 316L, Aluminum 6061"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAnalyze}
              disabled={loading || !materialName}
              startIcon={loading ? <CircularProgress size={20} /> : <Store />}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {analysis && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Availability Score
                  </Typography>
                  <Typography variant="h3" color="primary.main">
                    {analysis.availabilityScore}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    out of 100
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Active Suppliers
                  </Typography>
                  <Typography variant="h3">
                    {analysis.suppliers.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {analysis.suppliers.filter((s: any) => s.inStock).length} in stock
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Avg Price
                  </Typography>
                  <Typography variant="h3">
                    ${analysis.priceAnalysis.average}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per kg
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Price Trend
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp
                      sx={{
                        color: analysis.priceAnalysis.trend === 'increasing' ? 'error.main' :
                               analysis.priceAnalysis.trend === 'decreasing' ? 'success.main' : 'text.secondary',
                        mr: 1
                      }}
                    />
                    <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                      {analysis.priceAnalysis.trend}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Risk Assessment
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(analysis.riskAssessment).map(([key, value]: [string, any]) => (
                <Grid item xs={12} md={3} key={key}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </Typography>
                      <Chip
                        label={value.toUpperCase()}
                        color={getRiskColor(value)}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Price Analysis
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Price Range</Typography>
                  <Typography variant="h5">
                    ${analysis.priceAnalysis.min} - ${analysis.priceAnalysis.max}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Potential Savings</Typography>
                  <Typography variant="h5" color="success.main">
                    {analysis.priceAnalysis.savingsOpportunity}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <ResponsiveContainer width="100%" height={200} style={{ marginTop: 20 }}>
              <BarChart data={analysis.suppliers.map((s: any) => ({ name: s.name, price: s.price }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="price" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Supplier Directory
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Lead Time</TableCell>
                  <TableCell align="center">Stock</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell>Certifications</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analysis.suppliers.map((supplier: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.location}</TableCell>
                    <TableCell align="right">
                      ${supplier.price.toFixed(2)}/{supplier.currency}
                    </TableCell>
                    <TableCell align="right">{supplier.leadTime} days</TableCell>
                    <TableCell align="center">
                      {supplier.inStock ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Rating value={supplier.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {supplier.certifications.map((cert: string, i: number) => (
                          <Chip key={i} label={cert} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recommendations
            </Typography>
            {analysis.recommendations.map((rec: string, index: number) => (
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

export default SupplyChain;
