import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import MobileFAB from './components/MobileFAB';
import Dashboard from './pages/Dashboard';
import MaterialSearch from './pages/MaterialSearch';
import MaterialDetails from './pages/MaterialDetails';
import ChatInterface from './pages/ChatInterface';
import Standards from './pages/Standards';
import Sustainability from './pages/Sustainability';
import Comparison from './pages/Comparison';
import GenerativeMaterials from './pages/GenerativeMaterials';
import DigitalTwin from './pages/DigitalTwin';
import MultiObjectiveOptimization from './pages/MultiObjectiveOptimization';
import SupplyChain from './pages/SupplyChain';

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar onMenuClick={handleSidebarToggle} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 1.5, md: 2 },
          mt: { xs: 7, sm: 8 },
          ml: { xs: 0, md: sidebarOpen ? '240px' : 0 },
          transition: 'margin-left 0.3s ease',
          width: { xs: '100%', md: 'auto' },
          maxWidth: '100%',
          overflow: 'hidden',
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/search" element={<MaterialSearch />} />
          <Route path="/material/:id" element={<MaterialDetails />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/standards" element={<Standards />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/comparison" element={<Comparison />} />
          <Route path="/generative" element={<GenerativeMaterials />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/optimization" element={<MultiObjectiveOptimization />} />
          <Route path="/supply-chain" element={<SupplyChain />} />
        </Routes>
      </Box>
      
      {isMobile && <MobileFAB />}
    </Box>
  );
}

export default App;