import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Rating,
  LinearProgress,
} from '@mui/material';
import {
  Science,
  Nature,
  Speed,
  AttachMoney,
  Build,
  Gavel,
  Public,
  TrendingUp,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

const MaterialDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: material, isLoading } = useQuery(
    ['material', id],
    async () => {
      const response = await axios.get(`/api/materials/${id}`);
      return response.data;
    },
    { enabled: !!id }
  );

  if (isLoading) {
    return <Typography>Loading material details...</Typography>;
  }

  if (!material) {
    return <Typography>Material not found</Typography>;
  }

  const getSustainabilityScore = () => {
    let score = 0;
    if (material.sustainability.recyclable) score += 2;
    if (material.sustainability.recycledContent > 50) score += 2;
    if (material.sustainability.carbonFootprint < 10) score += 1;
    return Math.min(5, score);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          {material.name}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={material.category} color="primary" />
          <Chip label={material.subcategory} variant="outlined" />
          {material.sustainability.recyclable && (
            <Chip icon={<Nature />} label="Recyclable" color="success" />
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Overview Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Speed sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">Performance</Typography>
                  <Rating value={4} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    High strength and durability
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Nature sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="h6">Sustainability</Typography>
                  <Rating value={getSustainabilityScore()} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {material.sustainability.recyclable ? 'Fully recyclable' : 'Limited recyclability'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <AttachMoney sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h6">Cost</Typography>
                  <Rating value={Math.max(1, 6 - material.availability.costIndex)} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    Cost Index: {material.availability.costIndex}/10
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                  <Typography variant="h6">Availability</Typography>
                  <Typography variant="h4" color="primary">
                    {material.availability.leadTime}d
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Lead time
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Properties */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Science sx={{ mr: 1 }} />
                Material Properties
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Mechanical Properties
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {material.properties.mechanical.tensileStrength && (
                      <TableRow>
                        <TableCell>Tensile Strength</TableCell>
                        <TableCell>{material.properties.mechanical.tensileStrength} MPa</TableCell>
                      </TableRow>
                    )}
                    {material.properties.mechanical.yieldStrength && (
                      <TableRow>
                        <TableCell>Yield Strength</TableCell>
                        <TableCell>{material.properties.mechanical.yieldStrength} MPa</TableCell>
                      </TableRow>
                    )}
                    {material.properties.mechanical.hardness && (
                      <TableRow>
                        <TableCell>Hardness</TableCell>
                        <TableCell>{material.properties.mechanical.hardness} HB</TableCell>
                      </TableRow>
                    )}
                    {material.properties.mechanical.elongation && (
                      <TableRow>
                        <TableCell>Elongation</TableCell>
                        <TableCell>{material.properties.mechanical.elongation}%</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Physical Properties
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {material.properties.physical.density && (
                      <TableRow>
                        <TableCell>Density</TableCell>
                        <TableCell>{material.properties.physical.density} kg/m³</TableCell>
                      </TableRow>
                    )}
                    {material.properties.physical.meltingPoint && (
                      <TableRow>
                        <TableCell>Melting Point</TableCell>
                        <TableCell>{material.properties.physical.meltingPoint}°C</TableCell>
                      </TableRow>
                    )}
                    {material.properties.physical.thermalConductivity && (
                      <TableRow>
                        <TableCell>Thermal Conductivity</TableCell>
                        <TableCell>{material.properties.physical.thermalConductivity} W/m·K</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
                Thermal Properties
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableBody>
                    {material.properties.thermal.operatingTemperature && (
                      <TableRow>
                        <TableCell>Operating Temperature Range</TableCell>
                        <TableCell>
                          {material.properties.thermal.operatingTemperature.min}°C to{' '}
                          {material.properties.thermal.operatingTemperature.max}°C
                        </TableCell>
                      </TableRow>
                    )}
                    {material.properties.thermal.thermalExpansion && (
                      <TableRow>
                        <TableCell>Thermal Expansion</TableCell>
                        <TableCell>{material.properties.thermal.thermalExpansion} µm/m·K</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar Info */}
        <Grid item xs={12} md={4}>
          {/* Composition */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chemical Composition
              </Typography>
              {material.composition.elements.map((element: any, index: number) => (
                <Box key={index} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">{element.element}</Typography>
                    <Typography variant="body2">{element.percentage}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={element.percentage}
                    sx={{ height: 4, borderRadius: 2 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Standards */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Gavel sx={{ mr: 1 }} />
                Standards
              </Typography>
              <List dense>
                {material.standards.map((standard: any, index: number) => (
                  <ListItem key={index} sx={{ px: 0 }}>
                    <ListItemText
                      primary={`${standard.organization} ${standard.designation}`}
                      secondary={standard.title}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          {/* Sustainability */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Nature sx={{ mr: 1 }} />
                Sustainability
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Recyclable: {material.sustainability.recyclable ? 'Yes' : 'No'}
                </Typography>
                {material.sustainability.recycledContent && (
                  <Typography variant="body2" gutterBottom>
                    Recycled Content: {material.sustainability.recycledContent}%
                  </Typography>
                )}
                {material.sustainability.carbonFootprint && (
                  <Typography variant="body2" gutterBottom>
                    Carbon Footprint: {material.sustainability.carbonFootprint} kg CO₂/kg
                  </Typography>
                )}
                <Typography variant="body2">
                  End-of-Life: {material.sustainability.eolTreatment.replace('_', ' ')}
                </Typography>
              </Box>
              {material.sustainability.certifications && (
                <Box>
                  <Typography variant="body2" gutterBottom>
                    Certifications:
                  </Typography>
                  {material.sustainability.certifications.map((cert: string, index: number) => (
                    <Chip key={index} label={cert} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Public sx={{ mr: 1 }} />
                Availability
              </Typography>
              <Typography variant="body2" gutterBottom>
                Lead Time: {material.availability.leadTime} days
              </Typography>
              <Typography variant="body2" gutterBottom>
                Cost Index: {material.availability.costIndex}/10
              </Typography>
              <Typography variant="body2" gutterBottom>
                Regions: {material.availability.regions.join(', ')}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Suppliers: {material.availability.suppliers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Applications */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Build sx={{ mr: 1 }} />
                Applications
              </Typography>
              <Grid container spacing={2}>
                {material.applications.map((app: any, index: number) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {app.domain.replace('_', ' & ').toUpperCase()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {app.specificUse}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Conditions:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                          {app.conditions.map((condition: string, condIndex: number) => (
                            <Chip
                              key={condIndex}
                              label={condition.replace('_', ' ')}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Performance: {app.performance}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button variant="contained" size="large">
              Add to Comparison
            </Button>
            <Button variant="outlined" size="large">
              Download Datasheet
            </Button>
            <Button variant="outlined" size="large">
              Contact Supplier
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialDetails;