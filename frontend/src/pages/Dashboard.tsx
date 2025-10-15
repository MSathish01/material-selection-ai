import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  Nature,
  Speed,
  Search,
  Chat,
  Science,
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  const stats = [
    { title: 'Total Materials', value: '2,847', icon: <Science />, color: '#1976d2' },
    { title: 'Sustainable Options', value: '1,523', icon: <Nature />, color: '#2e7d32' },
    { title: 'Avg. Selection Time', value: '12 min', icon: <Speed />, color: '#ed6c02' },
    { title: 'Success Rate', value: '94%', icon: <TrendingUp />, color: '#9c27b0' },
  ];

  const domainData = [
    { name: 'Oil & Gas', materials: 487, color: '#1976d2' },
    { name: 'Mining', materials: 423, color: '#2e7d32' },
    { name: 'Power', materials: 356, color: '#ed6c02' },
    { name: 'Subsea', materials: 298, color: '#9c27b0' },
    { name: 'Cryogenics', materials: 234, color: '#d32f2f' },
    { name: 'Hygienic', materials: 189, color: '#7b1fa2' },
  ];

  const recentSearches = [
    { query: 'High-strength steel for offshore platform', domain: 'Oil & Gas', time: '2 hours ago' },
    { query: 'Corrosion-resistant alloy for mining equipment', domain: 'Mining', time: '4 hours ago' },
    { query: 'Cryogenic-grade aluminum for LNG storage', domain: 'Cryogenics', time: '6 hours ago' },
    { query: 'Food-grade stainless steel for processing', domain: 'Hygienic', time: '1 day ago' },
  ];

  return (
    <Box sx={{ maxWidth: '100%', overflow: 'hidden' }}>
      <Box sx={{ mb: { xs: 1, sm: 1.5 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.375rem', md: '1.5rem' },
            fontWeight: 700,
            mb: 0.25,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          AI-Driven Material Selection Platform
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            fontSize: { xs: '0.688rem', sm: '0.75rem' },
            opacity: 0.75,
            fontWeight: 500
          }}
        >
          Intelligent material optimization with sustainability metrics & global standards
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={{ xs: 1, sm: 1.25 }} sx={{ mb: { xs: 1.25, sm: 1.5 } }}>
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                }
              }}
            >
              <CardContent sx={{ p: { xs: 1, sm: 1.25 }, '&:last-child': { pb: { xs: 1, sm: 1.25 } } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 } }}>
                  <Box
                    sx={{
                      p: { xs: 0.625, sm: 0.75 },
                      borderRadius: 1.5,
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 18, sm: 24 } } })}
                  </Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography 
                      variant="h5" 
                      component="div" 
                      sx={{ 
                        fontSize: { xs: '1.125rem', sm: '1.375rem' },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        mb: 0.125
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: { xs: '0.625rem', sm: '0.688rem' },
                        lineHeight: 1.3,
                        fontWeight: 500
                      }}
                    >
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 1.25, sm: 1.5 }}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  fontWeight: 600,
                  mb: { xs: 1.25, sm: 1.5 }
                }}
              >
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.875, sm: 1 } }}>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  fullWidth
                  href="/search"
                  sx={{ 
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.813rem' },
                    fontWeight: 600
                  }}
                >
                  Find Materials
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Chat />}
                  fullWidth
                  href="/chat"
                  sx={{ 
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.813rem' },
                    fontWeight: 600
                  }}
                >
                  Ask AI Assistant
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Nature />}
                  fullWidth
                  href="/sustainability"
                  sx={{ 
                    py: { xs: 0.75, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.813rem' },
                    fontWeight: 600
                  }}
                >
                  Sustainability Report
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Materials by Domain */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  fontWeight: 600,
                  mb: { xs: 1.25, sm: 1.5 }
                }}
              >
                Materials by Application Domain
              </Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <ResponsiveContainer width="100%" height={240} minWidth={300}>
                  <BarChart data={domainData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="materials" fill="#667eea" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Searches */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  fontWeight: 600,
                  mb: { xs: 1.25, sm: 1.5 }
                }}
              >
                Recent Searches
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1, sm: 1.25 } }}>
                {recentSearches.map((search, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: { xs: 1.25, sm: 1.5 }, 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1.5,
                      transition: 'all 0.2s',
                      '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 0.75,
                        fontSize: { xs: '0.75rem', sm: '0.813rem' },
                        fontWeight: 500
                      }}
                    >
                      {search.query}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Chip 
                        label={search.domain} 
                        size="small" 
                        color="primary"
                        sx={{ 
                          height: 20,
                          fontSize: '0.625rem',
                          fontWeight: 600
                        }}
                      />
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.625rem', sm: '0.688rem' } }}
                      >
                        {search.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sustainability Overview */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  fontSize: { xs: '0.875rem', sm: '0.938rem' },
                  fontWeight: 600,
                  mb: { xs: 1.25, sm: 1.5 }
                }}
              >
                Sustainability Overview
              </Typography>
              <Box sx={{ mb: { xs: 1.25, sm: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 500 }}
                  >
                    Recyclable Materials
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="primary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 700 }}
                  >
                    73%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={73}
                  sx={{ height: 5, borderRadius: 3 }}
                />
              </Box>
              <Box sx={{ mb: { xs: 1.25, sm: 1.5 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 500 }}
                  >
                    Low Carbon Footprint
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="success.main"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 700 }}
                  >
                    58%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={58}
                  color="success"
                  sx={{ height: 5, borderRadius: 3 }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 500 }}
                  >
                    Certified Sustainable
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="warning.main"
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.813rem' }, fontWeight: 700 }}
                  >
                    41%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={41}
                  color="warning"
                  sx={{ height: 5, borderRadius: 3 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;