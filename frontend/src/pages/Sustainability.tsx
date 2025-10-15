import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  Nature,
  Recycling,
  Co2,
  BoltOutlined,
  CheckCircle,
  TrendingUp,
  Public,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';

const Sustainability: React.FC = () => {
  const { data: sustainabilityReport, isLoading } = useQuery(
    'sustainability-report',
    async () => {
      const response = await axios.get('/api/materials/sustainability/report');
      return response.data;
    }
  );

  const recyclabilityData = [
    { name: 'Recyclable', value: 73, color: '#4caf50' },
    { name: 'Non-recyclable', value: 27, color: '#f44336' },
  ];

  const carbonFootprintData = [
    { category: 'Steel', footprint: 8.2, materials: 487 },
    { category: 'Aluminum', footprint: 3.1, materials: 234 },
    { category: 'Titanium', footprint: 12.8, materials: 156 },
    { category: 'Polymer', footprint: 2.4, materials: 298 },
    { category: 'Composite', footprint: 6.7, materials: 189 },
    { category: 'Ceramic', footprint: 4.2, materials: 123 },
  ];

  const sustainabilityTrends = [
    { year: 2020, recyclable: 65, lowCarbon: 45, certified: 32 },
    { year: 2021, recyclable: 68, lowCarbon: 52, certified: 38 },
    { year: 2022, recyclable: 71, lowCarbon: 56, certified: 41 },
    { year: 2023, recyclable: 73, lowCarbon: 58, certified: 44 },
    { year: 2024, recyclable: 75, lowCarbon: 62, certified: 47 },
  ];

  const certifications = [
    { name: 'ISO 14001', count: 1247, description: 'Environmental Management Systems' },
    { name: 'REACH Compliant', count: 2156, description: 'EU Chemical Regulation' },
    { name: 'RoHS Compliant', count: 1834, description: 'Restriction of Hazardous Substances' },
    { name: 'Cradle to Cradle', count: 234, description: 'Circular Economy Certification' },
    { name: 'GREENGUARD', count: 156, description: 'Low Chemical Emissions' },
    { name: 'FSC Certified', count: 89, description: 'Forest Stewardship Council' },
  ];

  const recommendations = [
    'Prioritize materials with high recycled content (>50%)',
    'Consider end-of-life treatment options during selection',
    'Evaluate carbon footprint in material selection criteria',
    'Choose suppliers with sustainability certifications',
    'Implement circular economy principles in design',
    'Monitor and report on material sustainability metrics',
  ];

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Sustainability Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
        Environmental impact analysis and sustainable material recommendations
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Recycling sx={{ fontSize: { xs: 32, sm: 40 }, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                73%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Recyclable Materials
              </Typography>
              <LinearProgress
                variant="determinate"
                value={73}
                color="success"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <Co2 sx={{ fontSize: { xs: 32, sm: 40 }, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                6.8
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Avg. Carbon Footprint (kg CO₂/kg)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={32}
                color="warning"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <CheckCircle sx={{ fontSize: { xs: 32, sm: 40 }, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                44%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Certified Sustainable
              </Typography>
              <LinearProgress
                variant="determinate"
                value={44}
                color="info"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center', p: { xs: 2, sm: 3 } }}>
              <BoltOutlined sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary.main" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                58%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Low Energy Production
              </Typography>
              <LinearProgress
                variant="determinate"
                value={58}
                color="primary"
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Recyclability Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                <Recycling sx={{ mr: 1 }} />
                Material Recyclability
              </Typography>
              <Box sx={{ height: { xs: 250, sm: 300 }, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={recyclabilityData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {recyclabilityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                {recyclabilityData.map((item, index) => (
                  <Chip
                    key={index}
                    label={`${item.name}: ${item.value}%`}
                    sx={{ backgroundColor: item.color, color: 'white' }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Carbon Footprint by Category */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Co2 sx={{ mr: 1 }} />
                Carbon Footprint by Material Category
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={carbonFootprintData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis label={{ value: 'kg CO₂/kg', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => [`${value} kg CO₂/kg`, 'Carbon Footprint']} />
                  <Bar dataKey="footprint" fill="#ff9800" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sustainability Trends */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ mr: 1 }} />
                Sustainability Trends (2020-2024)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={sustainabilityTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="recyclable" stroke="#4caf50" strokeWidth={2} name="Recyclable Materials" />
                  <Line type="monotone" dataKey="lowCarbon" stroke="#2196f3" strokeWidth={2} name="Low Carbon Footprint" />
                  <Line type="monotone" dataKey="certified" stroke="#ff9800" strokeWidth={2} name="Certified Sustainable" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Certifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 1 }} />
                Sustainability Certifications
              </Typography>
              <List>
                {certifications.map((cert, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{cert.name}</Typography>
                          <Chip label={cert.count} size="small" color="primary" />
                        </Box>
                      }
                      secondary={cert.description}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recommendations */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Nature sx={{ mr: 1 }} />
                Sustainability Recommendations
              </Typography>
              <List>
                {recommendations.map((recommendation, index) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={recommendation}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Environmental Impact Summary */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Public sx={{ mr: 1 }} />
                Environmental Impact Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'success.light', color: 'success.contrastText' }}>
                    <Typography variant="h4">2,087</Typography>
                    <Typography variant="body2">Materials with recycled content</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'info.light', color: 'info.contrastText' }}>
                    <Typography variant="h4">1,654</Typography>
                    <Typography variant="body2">Low carbon footprint materials</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'warning.light', color: 'warning.contrastText' }}>
                    <Typography variant="h4">1,253</Typography>
                    <Typography variant="body2">Certified sustainable materials</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Our material database prioritizes environmental sustainability through comprehensive tracking of:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  <Chip label="Recyclability" color="success" />
                  <Chip label="Carbon Footprint" color="warning" />
                  <Chip label="Energy Efficiency" color="info" />
                  <Chip label="End-of-Life Treatment" color="primary" />
                  <Chip label="Supply Chain Impact" color="secondary" />
                  <Chip label="Certification Status" color="success" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sustainability;