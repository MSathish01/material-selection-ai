import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  Search,
  Gavel,
  Public,
  Description,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import axios from 'axios';

const Standards: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganization, setSelectedOrganization] = useState('');

  const { data: standards, isLoading } = useQuery(
    'standards',
    async () => {
      const response = await axios.get('/api/standards');
      return response.data;
    }
  );

  const { data: searchResults } = useQuery(
    ['standards-search', searchQuery],
    async () => {
      if (!searchQuery) return null;
      const response = await axios.get(`/api/standards/search/${searchQuery}`);
      return response.data;
    },
    { enabled: !!searchQuery }
  );

  const organizations = [
    { code: 'ASTM', name: 'American Society for Testing and Materials', description: 'International standards organization' },
    { code: 'ISO', name: 'International Organization for Standardization', description: 'Global standards body' },
    { code: 'EN', name: 'European Norm', description: 'European standards' },
    { code: 'DIN', name: 'Deutsches Institut für Normung', description: 'German standards institute' },
    { code: 'JIS', name: 'Japanese Industrial Standards', description: 'Japanese standards' },
    { code: 'BS', name: 'British Standards', description: 'UK standards' },
    { code: 'ANSI', name: 'American National Standards Institute', description: 'US standards coordinator' },
    { code: 'UNS', name: 'Unified Numbering System', description: 'Alloy designation system' },
  ];

  const groupedStandards = standards?.reduce((acc: any, standard: any) => {
    if (!acc[standard.organization]) {
      acc[standard.organization] = [];
    }
    acc[standard.organization].push(standard);
    return acc;
  }, {});

  const handleSearch = () => {
    // Search is handled by the query
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Material Standards Database
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive database of global material standards and specifications
      </Typography>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search standards by designation, title, or material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <Button onClick={handleSearch} disabled={!searchQuery}>
                  Search
                </Button>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Organizations Overview */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Public sx={{ mr: 1 }} />
                Standards Organizations
              </Typography>
              <List>
                {organizations.map((org) => (
                  <ListItem
                    key={org.code}
                    button
                    selected={selectedOrganization === org.code}
                    onClick={() => setSelectedOrganization(org.code)}
                    sx={{ borderRadius: 1, mb: 1 }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {org.code}
                          </Typography>
                          <Chip
                            label={groupedStandards?.[org.code]?.length || 0}
                            size="small"
                            color="primary"
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2">{org.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {org.description}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Standards List */}
        <Grid item xs={12} md={8}>
          {searchResults ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Search Results for "{searchQuery}"
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Found {searchResults.results?.length || 0} standards
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Organization</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Materials</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchResults.results?.map((standard: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Chip label={standard.organization} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {standard.designation}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{standard.title}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={standard.materialCount} size="small" color="primary" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Gavel sx={{ mr: 1 }} />
                  Standards by Organization
                </Typography>
                
                {isLoading ? (
                  <Typography>Loading standards...</Typography>
                ) : (
                  <Box>
                    {Object.entries(groupedStandards || {}).map(([org, orgStandards]: [string, any]) => (
                      <Accordion key={org} defaultExpanded={org === 'ASTM'}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6">{org}</Typography>
                            <Chip label={`${orgStandards.length} standards`} size="small" />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell>Designation</TableCell>
                                  <TableCell>Title</TableCell>
                                  <TableCell>Year</TableCell>
                                  <TableCell>Materials</TableCell>
                                  <TableCell>Actions</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {orgStandards.slice(0, 10).map((standard: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      <Typography variant="body2" fontWeight="bold">
                                        {standard.designation}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                                        {standard.title}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2">
                                        {standard.year || 'N/A'}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Chip 
                                        label={standard.materialCount} 
                                        size="small" 
                                        color="primary" 
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <Button
                                        size="small"
                                        startIcon={<Description />}
                                        href={`/standards/${org}/${standard.designation}`}
                                      >
                                        View
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {orgStandards.length > 10 && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                              <Button variant="outlined">
                                View All {orgStandards.length} Standards
                              </Button>
                            </Box>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {standards?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Standards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {Object.keys(groupedStandards || {}).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Organizations
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                2,847
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Covered Materials
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                98%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Coverage Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Standards;