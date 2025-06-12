import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'; // For 404 page
import LateralMenu from './components/LateralMenu/LateralMenu';
import ProductList from './components/ProductList/ProductList';
import BrandList from './components/BrandList/BrandList';
import CategoryList from './components/CategoryList/CategoryList';

// Define a basic Material Design 3 inspired theme
let theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#6750A4', // Example: MD3 primary color
    },
    secondary: {
      main: '#625B71', // Example: MD3 secondary color
    },
    background: {
      default: '#FFFBFE', // Example: MD3 background
      paper: '#FFFBFE', // Example: MD3 surface
    },
    surfaceVariant: { // Custom addition for MD3 like surface variants
        main: '#E7E0EC',
    },
    text: {
      primary: '#1D1B20',
      secondary: '#49454F',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // MD3 often uses slightly different font weight or letter spacing, adjust as needed
  },
  shape: {
    borderRadius: 8, // MD3 often uses slightly more rounded corners
  },
  components: {
    MuiButton: {
        styleOverrides: {
            root: {
                textTransform: 'none', // MD3 buttons often don't use all caps
            }
        }
    }
    // Further component customizations can go here
  }
});

theme = responsiveFontSizes(theme); // Make typography responsive


// Placeholder for the Dashboard page
const Dashboard = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>Dashboard</Typography>
    <Typography paragraph>
      Welcome to the SaaS application dashboard. Navigate using the menu on the left.
    </Typography>
  </Box>
);


function App() {
  const drawerWidth = 240; // This should match the drawerWidth in LateralMenu

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures consistent baseline styling */}
      <Router>
        <Box sx={{ display: 'flex' }}>
          <LateralMenu />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              mt: { xs: '56px', sm: '64px' } // AppBar height compensation
            }}
          >
            {/* Toolbar spacer is implicitly handled by mt above, matching AppBar height */}
            <Routes>
              <Route path="/" element={<Dashboard />} /> {/* Default route to Dashboard */}
              <Route path="/products" element={<ProductList />} />
              <Route path="/brands" element={<BrandList />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="*" element={
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h4" gutterBottom>404: Page Not Found</Typography>
                  <Typography>The page you are looking for does not exist.</Typography>
                </Box>
              } />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
