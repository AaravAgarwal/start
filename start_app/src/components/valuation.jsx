import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  InputAdornment,
  Divider,
  Card,
  CardContent,
  Fade,
  Grow,
  Slide,
  useTheme,
  ThemeProvider,
  createTheme,
  alpha,
  Tooltip,
  Zoom,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import { 
  AttachMoney, 
  TrendingUp, 
  BusinessCenter, 
  Assessment, 
  Timeline, 
  CalendarToday,
  Save,
  Refresh,
  HelpOutline,
  BarChart
} from '@mui/icons-material';
import Navbar from "./navbar";


// Custom theme with a financial color palette
const theme = createTheme({
  palette: {
    primary: {
      main: '#29524a', // Money green
      light: '#4CAF50',
      dark: '#94a187',
    },
    secondary: {
      main: '#29524a', // Professional blue
      light: '#42A5F5',
      dark: '#0D47A1',
    },
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
  },
  typography: {
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
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        margin: 'normal',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

// Custom styled counter for value display using only React hooks
const CountUp = ({ value, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startValue = displayValue;
    const endValue = value;
    const duration = 1000; // 1 second animation
    const frameDuration = 1000/60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentValue = startValue + (endValue - startValue) * progress;
      
      setDisplayValue(currentValue);
      
      if (frame === totalFrames) {
        clearInterval(counter);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);
  
  return (
    <Typography variant="h4" component="span">
      {prefix}{displayValue.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}{suffix}
    </Typography>
  );
};

const Valuation = () => {
  // Basic Inputs
  const [revenue, setRevenue] = useState(0);
  const [marketSize, setMarketSize] = useState(0);
  const [som, setSom] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [outflow, setOutflow] = useState(0);
  const [numYears, setNumYears] = useState(1);

  // WACC Inputs
  const [equityValue, setEquityValue] = useState(0);
  const [debtValue, setDebtValue] = useState(0);
  const [tax, setTax] = useState(0);
  const [equityCost, setEquityCost] = useState(0);
  const [debtCost, setDebtCost] = useState(0);

  // Results
  const [value, setValue] = useState(0);
  const [wacc, setWacc] = useState(0);
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const getUserUID = () => {
    try {
      return JSON.parse(localStorage.getItem('currentUser')).uid;
    } catch (error) {
      console.error("Error getting user UID:", error);
      return null;
    }
  };

  const userUID = getUserUID();

  // Fetch user unit economics data from the server
  useEffect(() => {
    if (userUID) {
      setLoading(true);
      fetch(`http://localhost:5000/api/valuation/${userUID}`)
        .then(response => response.json())
        .then(fetchedData => {
          // Populate the state with the fetched data
          setRevenue(fetchedData.revenue || 0);
          setMarketSize(fetchedData.marketSize || 0);
          setSom(fetchedData.som || 0);
          setGrowth(fetchedData.growth || 0);
          setOutflow(fetchedData.outflow || 0);
          setNumYears(fetchedData.numYears || 1);
          setEquityValue(fetchedData.equityValue || 0);
          setDebtValue(fetchedData.debtValue || 0);
          setTax(fetchedData.tax || 0);
          setEquityCost(fetchedData.equityCost || 0);
          setDebtCost(fetchedData.debtCost || 0);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching unit economics data:", error);
          setLoading(false);
        });
    }
  }, [userUID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userUID) {
      console.error("No user UID found");
      return;
    }

    setLoading(true);
    setSaveSuccess(false);

    const payload = {
      revenue,
      marketSize,
      som,
      growth,
      outflow,
      numYears,
      equityValue,
      debtValue,
      tax,
      equityCost,
      debtCost,
    };

    fetch(`http://localhost:5000/api/valuation/${userUID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(responseData => {
        console.log("Data saved successfully", responseData);
        setLoading(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      })
      .catch(error => {
        console.error("Error saving data:", error);
        setLoading(false);
      });
  };

  // Calculate valuation and WACC whenever inputs change
  useEffect(() => {
    let calculatedValue = 0;
    const totalValue = equityValue + debtValue;
    let calculatedWacc = 0;
    
    if (totalValue !== 0) {
      calculatedWacc = (equityValue / totalValue * (0.04 + 1.5 * (equityCost / 100 - 0.04))) + 
                        (debtValue / totalValue * debtCost / 100 * (1 - tax / 100));
    }
    
    setWacc(calculatedWacc);
    
    for (let i = 0; i < numYears; i++) {
      calculatedValue += (revenue * Math.pow((1 + growth / 100), i) - 
                          outflow * Math.pow((1 + growth / 100), i)) / 
                          Math.pow((1 + calculatedWacc), i);
    }
    
    setValue(calculatedValue);
  }, [revenue, marketSize, som, growth, outflow, numYears, equityValue, debtValue, tax, equityCost, debtCost]);

  const handleReset = () => {
    setRevenue(0);
    setMarketSize(0);
    setSom(0);
    setGrowth(0);
    setOutflow(0);
    setNumYears(1);
    setEquityValue(0);
    setDebtValue(0);
    setTax(0);
    setEquityCost(0);
    setDebtCost(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in={true} timeout={1000}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.05)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              align="center" 
              gutterBottom
              color="primary"
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                textShadow: `1px 1px 2px ${alpha('#000', 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <BusinessCenter /> Company Valuation Calculator
            </Typography>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Grid container spacing={4}>
                {/* Left Column - Inputs */}
                <Grid item xs={12} md={7}>
                  <Grow in={true} timeout={1000}>
                    <Card elevation={2} sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
                      <Box 
                        sx={{ 
                          position: 'absolute', 
                          top: -15, 
                          left: 20, 
                          bgcolor: 'primary.main',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          boxShadow: 1
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold">
                          Input Parameters
                        </Typography>
                      </Box>
                      <CardContent sx={{ pt: 4 }}>
                        <Grid container spacing={3}>
                          {/* Basic Inputs Section */}
                          <Grid item xs={12}>
                            <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Assessment /> Business Fundamentals
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Current annual revenue of your business" 
                              placement="top" 
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Annual Revenue"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AttachMoney />
                                    </InputAdornment>
                                  ),
                                }}
                                value={revenue || ''}
                                onChange={(e) => setRevenue(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Total size of your addressable market" 
                              placement="top"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Total Addressable Market (TAM)"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AttachMoney />
                                    </InputAdornment>
                                  ),
                                }}
                                value={marketSize || ''}
                                onChange={(e) => setMarketSize(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Percentage of market you can realistically capture" 
                              placement="top"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Serviceable Obtainable Market (SOM)"
                                type="number"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                }}
                                value={som || ''}
                                onChange={(e) => setSom(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Annual cash outflow" 
                              placement="top"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Annual Cash Outflow"
                                type="number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <AttachMoney />
                                    </InputAdornment>
                                  ),
                                }}
                                value={outflow || ''}
                                onChange={(e) => setOutflow(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Expected annual market growth rate" 
                              placement="top"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Annual Growth Rate"
                                type="number"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      %
                                    </InputAdornment>
                                  ),
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <TrendingUp />
                                    </InputAdornment>
                                  ),
                                }}
                                value={growth || ''}
                                onChange={(e) => setGrowth(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <Tooltip 
                              title="Number of years to project for valuation" 
                              placement="top"
                              arrow
                              TransitionComponent={Zoom}
                            >
                              <TextField
                                label="Projection Years"
                                type="number"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      year(s)
                                    </InputAdornment>
                                  ),
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <CalendarToday />
                                    </InputAdornment>
                                  ),
                                }}
                                value={numYears || ''}
                                onChange={(e) => setNumYears(e.target.value === "" ? 0 : Number(e.target.value))}
                              />
                            </Tooltip>
                          </Grid>
                          
                          {/* WACC (Discount Rate) Inputs */}
                          <Grid item xs={12}>
                            <Typography variant="h6" color="secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Timeline /> Capital Structure & WACC
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Market Value of Equity"
                              type="number"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AttachMoney />
                                  </InputAdornment>
                                ),
                              }}
                              value={equityValue || ''}
                              onChange={(e) => setEquityValue(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={6}>
                            <TextField
                              label="Market Value of Debt"
                              type="number"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <AttachMoney />
                                  </InputAdornment>
                                ),
                              }}
                              value={debtValue || ''}
                              onChange={(e) => setDebtValue(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Expected Market Return"
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              value={equityCost || ''}
                              onChange={(e) => setEquityCost(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Annual Interest Rate"
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              value={debtCost || ''}
                              onChange={(e) => setDebtCost(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </Grid>
                          
                          <Grid item xs={12} sm={4}>
                            <TextField
                              label="Tax Rate"
                              type="number"
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                              value={tax || ''}
                              onChange={(e) => setTax(e.target.value === "" ? 0 : Number(e.target.value))}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grow>
                </Grid>

                {/* Right Column - Results and Actions */}
                <Grid item xs={12} md={5}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                    {/* Valuation Result */}
                    <Slide direction="left" in={true} timeout={800}>
                      <Card 
                        elevation={3} 
                        sx={{ 
                          p: 3,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                          color: 'white',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <Box sx={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.1 }}>
                          <BarChart sx={{ fontSize: 120 }} />
                        </Box>

                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Estimated Company Value
                        </Typography>
                        
                        <Box 
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 2,
                            my: 2,
                            bgcolor: alpha('#fff', 0.1),
                            borderRadius: 2,
                            boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                          }}
                        >
                          <Typography 
                            variant="h3" 
                            component="div" 
                            sx={{ 
                              fontWeight: 'bold',
                              display: 'flex',
                              alignItems: 'center',
                              textShadow: '1px 1px 2px rgba(0,0,0,0.2)'
                            }}
                          >
                            <AttachMoney fontSize="inherit" />
                            <CountUp value={value} />
                          </Typography>
                        </Box>
                        
                        <Box 
                          sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            bgcolor: alpha('#fff', 0.1),
                            p: 1,
                            borderRadius: 1,
                            mt: 2
                          }}
                        >
                          <Typography variant="body2">WACC (Discount Rate):</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {(wacc * 100).toFixed(2)}%
                          </Typography>
                        </Box>
                      </Card>
                    </Slide>

                    {/* Actions Card */}
                    <Slide direction="left" in={true} timeout={1000}>
                      <Card elevation={2} sx={{ flexGrow: 1 }}>
                        <CardContent>
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            Actions
                          </Typography>
                          <Divider sx={{ mb: 3 }} />
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                startIcon={<Save />}
                                type="submit"
                                onClick={handleSubmit}
                                disabled={loading}
                                sx={{ 
                                  py: 1.5,
                                  boxShadow: theme.shadows[3],
                                  transition: 'all 0.3s',
                                  '&:hover': {
                                    boxShadow: theme.shadows[6],
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                {loading ? (
                                  <>
                                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                                    Saving...
                                  </>
                                ) : "Save Valuation Data"}
                              </Button>
                            </Grid>
                            
                            <Grid item xs={12}>
                              <Button
                                variant="outlined"
                                color="secondary"
                                fullWidth
                                startIcon={<Refresh />}
                                onClick={handleReset}
                                sx={{ 
                                  py: 1.5,
                                  transition: 'all 0.2s',
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.secondary.main, 0.05)
                                  }
                                }}
                              >
                                Reset All Values
                              </Button>
                            </Grid>
                          </Grid>
                          
                          {saveSuccess && (
                            <Fade in={saveSuccess}>
                              <Alert 
                                severity="success" 
                                sx={{ mt: 2 }}
                              >
                                Data saved successfully!
                              </Alert>
                            </Fade>
                          )}
                        </CardContent>
                      </Card>
                    </Slide>

                    {/* Info Card */}
                    <Slide direction="left" in={true} timeout={1200}>
                      <Card 
                        elevation={1} 
                        sx={{ 
                          bgcolor: alpha(theme.palette.info.light, 0.1),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                        }}
                      >
                        <CardContent>
                          <Typography 
                            variant="subtitle2" 
                            color="info.main"
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 0.5
                            }}
                          >
                            <HelpOutline fontSize="small" />
                            About this calculator
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            This tool estimates company value using Discounted Cash Flow (DCF) 
                            methodology. All calculations are based on the provided inputs and
                            weighted average cost of capital (WACC).
                          </Typography>
                        </CardContent>
                      </Card>
                    </Slide>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </ThemeProvider>
  );
};

export default Valuation;