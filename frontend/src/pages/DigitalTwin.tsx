import React, { useState, useEffect } from 'react';
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
  LinearProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from '@mui/material';
import { DeviceHub, Warning, TrendingUp, Schedule, Refresh } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const DigitalTwin: React.FC = () => {
  const [materialId, setMaterialId] = useState('');
  const [twin, setTwin] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sensorData, setSensorData] = useState({
    temperature: '25',
    stress: '0',
    strain: '0',
    corrosionRate: '0'
  });

  const loadTwin = async () => {
    if (!materialId) return;
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/advanced/digital-twin/${materialId}`);
      setTwin(response.data);
    } catch (err) {
      console.error('Error loading twin:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSensorData = async () => {
    if (!materialId) return;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/advanced/digital-twin/${materialId}/update`,
        {
          sensorData: {
            temperature: parseFloat(sensorData.temperature),
            stress: parseFloat(sensorData.stress),
            strain: parseFloat(sensorData.strain),
            corrosionRate: parseFloat(sensorData.corrosionRate)
          }
        }
      );
      setTwin(response.data);
    } catch (err) {
      console.error('Error updating sensor data:', err);
    }
  };

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <DeviceHub sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <div>
            <Typography variant="h4" gutterBottom>
              Digital Material Twin
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Real-time monitoring and predictive analytics for deployed materials
            </Typography>
          </div>
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              label="Material ID"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              placeholder="Enter material ID to load digital twin"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              onClick={loadTwin}
              disabled={loading || !materialId}
              startIcon={<Refresh />}
            >
              Load Twin
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {twin && (
        <>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Health Score
                  </Typography>
                  <Typography variant="h3" color={`${getHealthColor(twin.healthScore)}.main`}>
                    {twin.healthScore}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={twin.healthScore}
                    color={getHealthColor(twin.healthScore)}
                    sx={{ mt: 2 }}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Predicted Lifetime
                  </Typography>
                  <Typography variant="h3">
                    {twin.predictedLifetime.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    years remaining
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Data Points
                  </Typography>
                  <Typography variant="h3">
                    {twin.realTimeData.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    sensor readings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Anomalies
                  </Typography>
                  <Typography variant="h3" color={twin.anomalies.length > 0 ? 'error.main' : 'success.main'}>
                    {twin.anomalies.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    detected issues
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {twin.realTimeData.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <TrendingUp sx={{ mr: 1, verticalAlign: 'middle' }} />
                Real-Time Performance Data
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={twin.realTimeData.slice(-50)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperature" stroke="#ff7300" name="Temperature (°C)" />
                  <Line type="monotone" dataKey="stress" stroke="#387908" name="Stress (MPa)" />
                  <Line type="monotone" dataKey="corrosionRate" stroke="#8884d8" name="Corrosion Rate" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          )}

          {twin.anomalies.length > 0 && (
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                <Warning sx={{ mr: 1, verticalAlign: 'middle', color: 'error.main' }} />
                Detected Anomalies
              </Typography>
              {twin.anomalies.map((anomaly: any, index: number) => (
                <Alert key={index} severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</Typography>
                  <Typography variant="body2">{anomaly.description}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Recommendation:</strong> {anomaly.recommendation}
                  </Typography>
                </Alert>
              ))}
            </Paper>
          )}

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
              Maintenance Schedule
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Scheduled Date</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {twin.maintenanceSchedule.map((event: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{event.type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{new Date(event.scheduledDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={event.priority}
                        color={
                          event.priority === 'critical' ? 'error' :
                          event.priority === 'high' ? 'warning' :
                          event.priority === 'medium' ? 'info' : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{event.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Update Sensor Data
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Temperature (°C)"
                  type="number"
                  value={sensorData.temperature}
                  onChange={(e) => setSensorData({ ...sensorData, temperature: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Stress (MPa)"
                  type="number"
                  value={sensorData.stress}
                  onChange={(e) => setSensorData({ ...sensorData, stress: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Strain"
                  type="number"
                  value={sensorData.strain}
                  onChange={(e) => setSensorData({ ...sensorData, strain: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  label="Corrosion Rate"
                  type="number"
                  value={sensorData.corrosionRate}
                  onChange={(e) => setSensorData({ ...sensorData, corrosionRate: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" onClick={updateSensorData} fullWidth>
                  Update Sensor Data
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default DigitalTwin;
