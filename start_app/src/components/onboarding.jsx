import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Paper, 
  Grid, 
  Alert, 
  Divider,
  Card, 
  CardContent,
  IconButton,
  Stack,
  Fade,
  Zoom,
  Grow,
  CircularProgress
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import BusinessIcon from '@mui/icons-material/Business';
import EventIcon from '@mui/icons-material/Event';
import CategoryIcon from '@mui/icons-material/Category';
import GroupsIcon from '@mui/icons-material/Groups';
import { styled } from '@mui/material/styles';

// Create a custom theme with nice colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5', // Indigo
      light: '#757de8',
      dark: '#002984',
    },
    secondary: {
      main: '#f50057', // Pink
      light: '#ff5983',
      dark: '#bb002f',
    },
    background: {
      default: '#f5f7ff',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 40px -12px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Styled components for animation
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  backgroundImage: 'linear-gradient(135deg, rgba(63, 81, 181, 0.05) 0%, rgba(245, 0, 87, 0.05) 100%)',
  boxShadow: '0 10px 40px -12px rgba(0,0,0,0.2)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '4px',
    background: 'linear-gradient(90deg, #3f51b5, #f50057)',
  },
}));

const CardItem = styled(Card)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(1),
  backgroundImage: 'linear-gradient(135deg, rgba(245, 247, 255, 0.5) 0%, rgba(255, 255, 255, 0.5) 100%)',
  border: '1px solid rgba(63, 81, 181, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    borderColor: theme.palette.primary.main,
  },
}));

const Onboarding = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // Define sectors for dropdown
  const sectors = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Energy",
    "Transportation",
    "Agriculture",
    "Entertainment",
    "Real Estate",
    "Consulting"
  ];
  
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    chiefs: [{ name: '', email: '' }],
    startDate: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleChiefChange = (index, field, value) => {
    const updatedChiefs = [...formData.chiefs];
    updatedChiefs[index][field] = value;
    setFormData({
      ...formData,
      chiefs: updatedChiefs
    });
  };
  
  const addChief = () => {
    setFormData({
      ...formData,
      chiefs: [...formData.chiefs, { name: '', email: '' }]
    });
  };
  
  const removeChief = (index) => {
    const updatedChiefs = formData.chiefs.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      chiefs: updatedChiefs
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser'));
      
      // Prepare data for submission
      const userData = {
        uid: pendingUser.uid,
        email: pendingUser.email,
        photoURL: pendingUser.photoURL,
        companyName: formData.companyName,
        sector: formData.sector,
        chiefs: formData.chiefs,
        startDate: formData.startDate,
      };
      
      console.log(userData);
      
      // Submit to backend
      const response = await fetch('http://localhost:5000/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create profile');
      }
      
      // Redirect to home page
      const data = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error('Profile creation error:', error);
      setError('Failed to create profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #e8eaf6 0%, #f8bbd0 100%)',
          py: 4,
        }}
      >
        <Container maxWidth="md">
          <Zoom in={true} timeout={600}>
            <StyledPaper elevation={12}>
              <Box textAlign="center" mb={4}>
                <Fade in={true} timeout={800}>
                  <Box>
                    <BusinessIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                    <Typography variant="h4" color="primary" gutterBottom>
                      Complete Your Company Profile
                    </Typography>
                  </Box>
                </Fade>
                <Divider
                  sx={{
                    width: 100,
                    height: 4,
                    mx: 'auto',
                    my: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #3f51b5, #f50057)',
                  }}
                />
                <Typography variant="body1" color="textSecondary">
                  Please provide your company information to get started
                </Typography>
              </Box>

              {error && (
                <Fade in={true} timeout={500}>
                  <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
                </Fade>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={4}>
                  <Fade in={true} timeout={600} style={{ transitionDelay: '100ms' }}>
                    <TextField
                      fullWidth
                      label="Company Name"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      InputProps={{
                        startAdornment: <BusinessIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Fade>

                  <Fade in={true} timeout={600} style={{ transitionDelay: '200ms' }}>
                    <FormControl fullWidth required>
                      <InputLabel id="sector-label">Sector</InputLabel>
                      <Select
                        labelId="sector-label"
                        name="sector"
                        value={formData.sector}
                        onChange={handleChange}
                        label="Sector"
                        startAdornment={<CategoryIcon color="action" sx={{ mr: 1, ml: -0.5 }} />}
                      >
                        {sectors.map(sector => (
                          <MenuItem key={sector} value={sector}>{sector}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Fade>

                  <Fade in={true} timeout={600} style={{ transitionDelay: '300ms' }}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: <EventIcon color="action" sx={{ mr: 1 }} />,
                      }}
                    />
                  </Fade>

                  <Fade in={true} timeout={600} style={{ transitionDelay: '400ms' }}>
                    <Box sx={{ mt: 3 }}>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                        <Box display="flex" alignItems="center">
                          <GroupsIcon color="primary" sx={{ mr: 1 }} />
                          <Typography variant="h6">Executive Team</Typography>
                        </Box>
                        <Button
                          startIcon={<AddCircleOutlineIcon />}
                          onClick={addChief}
                          variant="contained"
                          color="secondary"
                          size="small"
                        >
                          Add Executive
                        </Button>
                      </Box>

                      <Stack spacing={3}>
                        {formData.chiefs.map((chief, index) => (
                          <Grow
                            key={index}
                            in={true}
                            timeout={500}
                            style={{ transformOrigin: '0 0 0' }}
                          >
                            <CardItem variant="outlined">
                              <CardContent>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                  <Typography variant="subtitle1" color="primary">
                                    Executive {index + 1}
                                  </Typography>
                                  {index > 0 && (
                                    <IconButton
                                      size="small"
                                      onClick={() => removeChief(index)}
                                      color="secondary"
                                      aria-label="Remove executive"
                                    >
                                      <DeleteOutlineIcon />
                                    </IconButton>
                                  )}
                                </Box>
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Name"
                                      value={chief.name}
                                      onChange={(e) => handleChiefChange(index, 'name', e.target.value)}
                                      required
                                      variant="outlined"
                                      size="small"
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <TextField
                                      fullWidth
                                      label="Email"
                                      type="email"
                                      value={chief.email}
                                      onChange={(e) => handleChiefChange(index, 'email', e.target.value)}
                                      required
                                      variant="outlined"
                                      size="small"
                                    />
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </CardItem>
                          </Grow>
                        ))}
                      </Stack>
                    </Box>
                  </Fade>

                  <Fade in={true} timeout={600} style={{ transitionDelay: '500ms' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                          background: 'linear-gradient(45deg, #3f51b5 30%, #7986cb 90%)',
                          boxShadow: '0 3px 5px 2px rgba(63, 81, 181, .3)',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                            Processing...
                          </>
                        ) : 'Complete Profile'}
                      </Button>
                    </Box>
                  </Fade>
                </Stack>
              </Box>
            </StyledPaper>
          </Zoom>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Onboarding;