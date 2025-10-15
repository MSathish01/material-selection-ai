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
          p: { xs: 2, sm: 2.5, md: 3 },
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
        </Routes>
      </Box>
      
      {isMobile && <MobileFAB />}
    </Box>
  );
}

export default App;