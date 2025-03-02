import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  styled
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BusinessIcon from "@mui/icons-material/Business";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from "react-router-dom";

// Navbar's own theme
const navbarTheme = createTheme({
  palette: {
    primary: {
      main: '#29524a',
    },
    text: {
      primary: "#ffffff"
    }
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  }
});

// Styled component for the nav links
const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: "white",
  "& .MuiBox-root": {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "8px 12px",
    borderRadius: "4px",
    transition: "background-color 0.2s",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    }
  }
}));

const Navbar = ({ title = "START" }) => {
  const navLinks = [
    { path: "/dashboard", icon: <HomeIcon />, label: "Home" },
    { path: "/unitecon", icon: <MonetizationOnIcon />, label: "Unit Econ" },
    { path: "/valuation", icon: <TrendingUpIcon />, label: "Valuation" },
    { path: "/business", icon: <BusinessIcon />, label: "Business Plan" }
  ];

  return (
    <ThemeProvider theme={navbarTheme}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                <Box>
                  {link.icon}
                  <Typography variant="body2">{link.label}</Typography>
                </Box>
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;