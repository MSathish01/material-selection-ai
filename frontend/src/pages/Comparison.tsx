import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  Autocomplete,
  Rating,
  Divider,
} from '@mui/material';
import {
  Compare,
  Add,
  Delete,
  Download,
  Share,
} from '@mui/icons-material';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';

const Comparison: React.FC = () => {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { data: materials } = useQuery(
    'materials-for-comparison',
    async () => {
      const response = await axios.get('/api/materials?limit=100');
      return response.data.materials;
    }
  );

  const { data: comparisonData } = useQuery(
    ['material-comparison', selectedMaterials],
    async () => {
      if (selectedMaterials.length < 2) return null;
      const response = await axios.post('/api/materials/compare', {
        materialIds: selectedMaterials
      });
      return response.data;
    },
    { enabled: selectedMaterials.length >= 2 }
  );

  const handleAddMaterial = (materialId: string) => {
    if (!selectedMaterials.includes(materialId) && selectedMaterials.length < 5) {
      setSelectedMaterials([...selectedMaterials, materialId]);
    }
  };

  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials(selectedMaterials.filter(id => id !== materialId));
  };

  const getRadarData = () => {
    if (!comparisonData) return [];
    
    return comparisonData.materials.map((material: any) => ({
      material: material.name,
      strength: (material.properties.mechanical.tensileStrength || 0) / 10,
      sustainability: material.sustainability.recyclable ? 100 : 50,
      cost: (10 - material.availability.costIndex) * 10,
      availability: material.availability.leadTime <= 14 ? 100 : 50,
      corrosion: material.properties.chemical.corrosionResistance === 'excellent' ? 100 : 
                 material.properties.chemical.corrosionResistance === 'good' ? 75 : 50,
    }));
  };

  const getPropertyComparison = () => {
    if (!comparisonData) return [];
    
    const properties = ['tensileStrength', 'yieldStrength', 'hardness', 'density'];
    return properties.map(prop => {
      const data: any = { property: prop.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()) };
      comparisonData.materials.forEach((material: any, index: number) => {
        const value = material.properties.mechanical[prop] || material.properties.physical[prop] || 0;
        data[`material${index}`] = value;
      });
      return data;
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Material Comparison
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Compare materials side-by-side to make informed decisions
      </Typography>

      {/* Material Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <Add sx={{ mr: 1 }} />
            Add Materials to Compare
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <Autocomplete
              sx={{ flexGrow: 1 }}
              options={materials || []}
              getOptionLabel={(option: any) => `${option.name} (${option.category})`}
              renderInput={(params) => (
                <TextField {...params} label="Search materials" placeholder="Type to search..." />
              )}
              onChange={(_, value) => {
                if (value) {
                  handleAddMaterial(value._id);
                }
              }}
              value={null}
            />
            <Typography variant="body2" color="text.secondary">
              {selectedMaterials.length}/5 materials selected
            </Typography>
          </Box>

          {selectedMaterials.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedMaterials.map((materialId) => {
                const material = materials?.find((m: any) => m._id === materialId);
                return (
                  <Chip
                    key={materialId}
                    label={material?.name || 'Unknown'}
                    onDelete={() => handleRemoveMaterial(materialId)}
                    deleteIcon={<Delete />}
                    color="primary"
                  />
                );
              })}
            </Box>
          )}
        </CardContent>
      </Card>

      {selectedMaterials.length >= 2 && comparisonData ? (
        <Grid container spacing={3}>
          {/* Radar Chart Comparison */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performance Overview
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="material" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    {comparisonData.materials.map((material: any, index: number) => (
                      <Radar
                        key={index}
                        name={material.name}
                        dataKey={`material${index}`}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        fill={`hsl(${index * 60}, 70%, 50%)`}
                        fillOpacity={0.1}
                      />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Property Comparison Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Property Comparison
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={getPropertyComparison()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="property" />
                    <YAxis />
                    <Tooltip />
                    {comparisonData.materials.map((material: any, index: number) => (
                      <Bar
                        key={index}
                        dataKey={`material${index}`}
                        fill={`hsl(${index * 60}, 70%, 50%)`}
                        name={material.name}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Comparison Table */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <Compare sx={{ mr: 1 }} />
                    Detailed Comparison
                  </Typography>
                  <Box>
                    <Button startIcon={<Download />} sx={{ mr: 1 }}>
                      Export
                    </Button>
                    <Button startIcon={<Share />}>
                      Share
                    </Button>
                  </Box>
                </Box>

                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Property</strong></TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            <strong>{material.name}</strong>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Basic Information */}
                      <TableRow>
                        <TableCell><strong>Category</strong></TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            <Chip label={material.category} size="small" />
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell><strong>Subcategory</strong></TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.subcategory}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Mechanical Properties */}
                      <TableRow>
                        <TableCell colSpan={comparisonData.materials.length + 1}>
                          <Typography variant="subtitle2" color="primary">
                            Mechanical Properties
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Tensile Strength (MPa)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.properties.mechanical.tensileStrength || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell>Yield Strength (MPa)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.properties.mechanical.yieldStrength || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell>Hardness</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.properties.mechanical.hardness || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Physical Properties */}
                      <TableRow>
                        <TableCell colSpan={comparisonData.materials.length + 1}>
                          <Typography variant="subtitle2" color="primary">
                            Physical Properties
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Density (kg/m³)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.properties.physical.density || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell>Melting Point (°C)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.properties.physical.meltingPoint || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Sustainability */}
                      <TableRow>
                        <TableCell colSpan={comparisonData.materials.length + 1}>
                          <Typography variant="subtitle2" color="primary">
                            Sustainability
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Recyclable</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            <Chip
                              label={material.sustainability.recyclable ? 'Yes' : 'No'}
                              color={material.sustainability.recyclable ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell>Carbon Footprint (kg CO₂/kg)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.sustainability.carbonFootprint || 'N/A'}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Availability */}
                      <TableRow>
                        <TableCell colSpan={comparisonData.materials.length + 1}>
                          <Typography variant="subtitle2" color="primary">
                            Availability & Cost
                          </Typography>
                        </TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Cost Index (1-10)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            <Rating value={material.availability.costIndex} max={10} size="small" readOnly />
                          </TableCell>
                        ))}
                      </TableRow>

                      <TableRow>
                        <TableCell>Lead Time (days)</TableCell>
                        {comparisonData.materials.map((material: any) => (
                          <TableCell key={material.name} align="center">
                            {material.availability.leadTime}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Analysis Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analysis Summary
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'primary.light' }}>
                      <Typography variant="subtitle2" color="primary.contrastText">
                        Strongest Material
                      </Typography>
                      <Typography variant="h6" color="primary.contrastText">
                        {comparisonData.analysis.strongest}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'success.light' }}>
                      <Typography variant="subtitle2" color="success.contrastText">
                        Most Sustainable
                      </Typography>
                      <Typography variant="h6" color="success.contrastText">
                        {comparisonData.analysis.mostSustainable}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'warning.light' }}>
                      <Typography variant="subtitle2" color="warning.contrastText">
                        Most Cost Effective
                      </Typography>
                      <Typography variant="h6" color="warning.contrastText">
                        {comparisonData.analysis.mostCostEffective}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: 'info.light' }}>
                      <Typography variant="subtitle2" color="info.contrastText">
                        Fastest Delivery
                      </Typography>
                      <Typography variant="h6" color="info.contrastText">
                        {comparisonData.analysis.fastestDelivery}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Compare sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Select Materials to Compare
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose at least 2 materials from the search above to start comparing their properties, sustainability metrics, and availability.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Comparison;