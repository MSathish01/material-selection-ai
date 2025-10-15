import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Rating,
  Divider,
} from '@mui/material';
import {
  Search,
  ExpandMore,
  FilterList,
  Compare,
  Visibility,
  Nature,
  Speed,
  AttachMoney,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

interface Material {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  properties: {
    mechanical: {
      tensileStrength?: number;
      yieldStrength?: number;
      hardness?: number;
    };
    thermal: {
      operatingTemperature?: {
        min: number;
        max: number;
      };
    };
  };
  sustainability: {
    recyclable: boolean;
    carbonFootprint?: number;
  };
  availability: {
    costIndex: number;
    leadTime: number;
  };
  applications: Array<{
    domain: string;
    specificUse: string;
  }>;
}

const MaterialSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    domain: '',
    category: '',
    recyclable: '',
    costRange: [1, 10],
    strengthRange: [0, 2000],
  });
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const { data: materials, isLoading, refetch } = useQuery(
    ['materials', filters],
    async () => {
      const params = new URLSearchParams();
      if (filters.domain) params.append('domain', filters.domain);
      if (filters.category) params.append('category', filters.category);
      if (filters.recyclable) params.append('recyclable', filters.recyclable);
      if (searchQuery) params.append('search', searchQuery);
      
      const response = await axios.get(`/api/materials?${params.toString()}`);
      return response.data.materials;
    },
    { enabled: true }
  );

  const handleSearch = () => {
    refetch();
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleMaterialSelection = (materialId: string) => {
    setSelectedMaterials(prev => 
      prev.includes(materialId) 
        ? prev.filter(id => id !== materialId)
        : [...prev, materialId]
    );
  };

  const getSustainabilityScore = (material: Material) => {
    let score = 0;
    if (material.sustainability.recyclable) score += 2;
    if (material.sustainability.carbonFootprint && material.sustainability.carbonFootprint < 10) score += 2;
    return Math.min(5, score);
  };

  const getPerformanceScore = (material: Material) => {
    const strength = material.properties.mechanical.tensileStrength || 0;
    return Math.min(5, Math.floor(strength / 400) + 1);
  };

  const getCostScore = (material: Material) => {
    return Math.max(1, 6 - material.availability.costIndex);
  };

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem' } }}>
        Material Search
      </Typography>
      
      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, alignItems: 'stretch' }}>
            <TextField
              fullWidth
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              size={window.innerWidth < 600 ? 'small' : 'medium'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleSearch}
              sx={{ 
                minWidth: { xs: '100%', sm: 120 },
                py: { xs: 1.5, sm: 1 }
              }}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Filters */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                <FilterList sx={{ mr: 1 }} />
                Filters
              </Typography>
              
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Application Domain</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth size="small">
                    <InputLabel>Domain</InputLabel>
                    <Select
                      value={filters.domain}
                      label="Domain"
                      onChange={(e) => handleFilterChange('domain', e.target.value)}
                    >
                      <MenuItem value="">All Domains</MenuItem>
                      <MenuItem value="oil_gas">Oil & Gas</MenuItem>
                      <MenuItem value="mining">Mining</MenuItem>
                      <MenuItem value="power">Power</MenuItem>
                      <MenuItem value="subsea">Subsea</MenuItem>
                      <MenuItem value="cryogenics">Cryogenics</MenuItem>
                      <MenuItem value="hygienic">Hygienic</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Material Category</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth size="small">
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={filters.category}
                      label="Category"
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <MenuItem value="">All Categories</MenuItem>
                      <MenuItem value="Steel">Steel</MenuItem>
                      <MenuItem value="Aluminum">Aluminum</MenuItem>
                      <MenuItem value="Titanium">Titanium</MenuItem>
                      <MenuItem value="Polymer">Polymer</MenuItem>
                      <MenuItem value="Composite">Composite</MenuItem>
                      <MenuItem value="Ceramic">Ceramic</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Cost Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography gutterBottom>Cost Index: {filters.costRange[0]} - {filters.costRange[1]}</Typography>
                  <Slider
                    value={filters.costRange}
                    onChange={(_, value) => handleFilterChange('costRange', value)}
                    valueLabelDisplay="auto"
                    min={1}
                    max={10}
                    marks
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Sustainability</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormControl fullWidth size="small">
                    <InputLabel>Recyclable</InputLabel>
                    <Select
                      value={filters.recyclable}
                      label="Recyclable"
                      onChange={(e) => handleFilterChange('recyclable', e.target.value)}
                    >
                      <MenuItem value="">All Materials</MenuItem>
                      <MenuItem value="true">Recyclable Only</MenuItem>
                      <MenuItem value="false">Non-recyclable</MenuItem>
                    </Select>
                  </FormControl>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={9}>
          {selectedMaterials.length > 0 && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6">
                    {selectedMaterials.length} materials selected
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Compare />}
                    href="/comparison"
                    disabled={selectedMaterials.length < 2}
                  >
                    Compare Selected
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Results ({materials?.length || 0} materials found)
              </Typography>
              
              {isLoading ? (
                <Typography>Loading materials...</Typography>
              ) : (
                <List>
                  {materials?.map((material: Material) => (
                    <React.Fragment key={material._id}>
                      <ListItem
                        sx={{
                          border: selectedMaterials.includes(material._id) ? '2px solid #1976d2' : '1px solid #e0e0e0',
                          borderRadius: 2,
                          mb: 2,
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleMaterialSelection(material._id)}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6">{material.name}</Typography>
                              <Chip label={material.category} size="small" />
                              {material.sustainability.recyclable && (
                                <Chip icon={<Nature />} label="Recyclable" size="small" color="success" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {material.subcategory} • Applications: {material.applications.map(app => app.domain).join(', ')}
                              </Typography>
                              
                              <Grid container spacing={2}>
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Speed fontSize="small" />
                                    <Box>
                                      <Typography variant="caption" display="block">Performance</Typography>
                                      <Rating value={getPerformanceScore(material)} size="small" readOnly />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Nature fontSize="small" />
                                    <Box>
                                      <Typography variant="caption" display="block">Sustainability</Typography>
                                      <Rating value={getSustainabilityScore(material)} size="small" readOnly />
                                    </Box>
                                  </Box>
                                </Grid>
                                
                                <Grid item xs={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoney fontSize="small" />
                                    <Box>
                                      <Typography variant="caption" display="block">Cost Effectiveness</Typography>
                                      <Rating value={getCostScore(material)} size="small" readOnly />
                                    </Box>
                                  </Box>
                                </Grid>
                              </Grid>

                              {material.properties.mechanical.tensileStrength && (
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                  Tensile Strength: {material.properties.mechanical.tensileStrength} MPa
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton href={`/material/${material._id}`}>
                            <Visibility />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MaterialSearch;