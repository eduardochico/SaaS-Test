import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  CssBaseline, AppBar, Toolbar, Typography, Box, IconButton, useTheme, useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import InventoryIcon from '@mui/icons-material/Inventory'; // Products
import CategoryIcon from '@mui/icons-material/Category'; // Categories
import StoreIcon from '@mui/icons-material/Store'; // Brands
import HomeIcon from '@mui/icons-material/Home'; // Optional: for a dashboard or home link

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', path: '/', icon: <HomeIcon /> },
  { text: 'Products', path: '/products', icon: <InventoryIcon /> },
  { text: 'Brands', path: '/brands', icon: <StoreIcon /> },
  { text: 'Categories', path: '/categories', icon: <CategoryIcon /> },
];

const LateralMenu = (props) => {
  const { window } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Use md breakpoint for more flexibility
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box>
      <Toolbar> {/* For spacing, aligns with AppBar height */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
          SaaS Menu
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.action.selected,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  }
                },
                margin: '4px 8px', // Add some margin
                borderRadius: theme.shape.borderRadius, // Rounded corners
              }}
              onClick={isMobile ? handleDrawerToggle : undefined} // Close drawer on mobile after click
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper, // MD3 style appbar
          color: theme.palette.text.primary,
          boxShadow: 'none', // MD3 often has minimal or no shadow for appbar
          borderBottom: `1px solid ${theme.palette.divider}` // Subtle border
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // Only show on mobile/tablet
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {/* You can set the page title dynamically here based on route */}
            {menuItems.find(item => item.path === location.pathname)?.text || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Temporary Drawer for Mobile */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            // MD3 style drawer background
            backgroundColor: theme.palette.surfaceVariant?.main || theme.palette.background.default,
           },
          }}
        >
          {drawerContent}
        </Drawer>
        {/* Permanent Drawer for Desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,
            // MD3 style drawer background
            backgroundColor: theme.palette.surfaceVariant?.main || theme.palette.background.default,
            borderRight: 'none', // MD3 often has no border for permanent drawer
           },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      {/* The main content area will be rendered by App.js's <Outlet /> or similar */}
    </Box>
  );
};

export default LateralMenu;
