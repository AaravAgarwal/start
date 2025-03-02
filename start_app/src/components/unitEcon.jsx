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
    ThemeProvider,
    createTheme,
    alpha,
    Tooltip,
    Zoom,
    CircularProgress,
    Alert,
    IconButton,
    FormControl,
    InputLabel,
    OutlinedInput,
    Switch,
    FormControlLabel,
    Collapse,
    Stack,
    Menu,
    MenuItem
  } from '@mui/material';
  import { 
    AttachMoney as AttachMoneyIcon, 
    TrendingUp as ShowChartIcon, 
    Timeline as TimelineIcon, 
    MonetizationOn as MonetizationOnIcon,
    Save,
    Refresh,
    HelpOutline,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    BusinessCenter,
    Assessment
  } from '@mui/icons-material';
  import Navbar from "./navbar";

  
  // Custom theme with a financial color palette - similar to valuation page
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
  

const UnitEcon = () => {
    // Fetch Firebase Data
    const [data, setData] = useState(null);

    // Local
    const options = ["Software Subscription", "eCommerce", "Other"];
    
    const [anchorEl, setAnchorEl] = useState(null);

    // Input
    const [aov, setAov] = useState(0);
    const [cac, setCac] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [category, setCategory] = useState("Other");
    const [enableChurn, setEnableChurn] = useState(true);
    const [churn, setChurn] = useState(0);
    const [cogs, setCogs] = useState({"Manufacture" : 0, "Package" : 0});
    const [order, setOrder] = useState(0);

    // Output
    const [ltv, setLtv] = useState(0);
    const [margin, setMargin] = useState(0);
    const [marginRate, setMarginRate] = useState(0);
    const [ratio, setRatio] = useState(0);

    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const userUID = JSON.parse(localStorage.getItem('currentUser')).uid; // Assuming 'currentUserUID' is saved in localStorage after login
    // Fetch user unit economics data from the server
    useEffect(() => {
        if (userUID) {
            setLoading(true);

            // Make an API request to your backend to fetch unit economics metrics
            fetch(`http://localhost:5000/api/unitEconomics/${userUID}`)
                .then(response => response.json())
                .then(fetchedData => {
                    // Populate the state with the fetched data
                    setData(fetchedData);
                    setAov(fetchedData.aov || 0);
                    setCac(fetchedData.cac || 0);
                    setOrder(fetchedData.order || 0);
                    setChurn(fetchedData.churn || 0);
                    setCogs(fetchedData.cogs || {"Manufacture": 0, "Package": 0});
                    setCategory(fetchedData.category || "Other");
                    setEnableChurn(fetchedData.enableChurn !== undefined ? fetchedData.enableChurn : true);
                    setLoading(false);
                })
                .catch(error => console.error("Error fetching unit economics data:", error));
                setLoading(false);
        }
    }, [userUID]);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent the default form submission

        const payload = {
            aov,
            cac,
            order,
            churn,
            cogs,
            category,
            enableChurn
        };

        fetch(`http://localhost:5000/api/unitEconomics/${userUID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then(response => response.json())
            .then(responseData => {
                console.log("Data saved successfully", responseData);
            })
            .catch(error => {
                console.error("Error saving data:", error);
            });
    };

    const handleKeyUpdate = (key, old, value) => {
        setCogs(prevCogs => {
            const newCogs = { ...prevCogs, [key]: value };
            delete newCogs[old];
            return newCogs;
          });
    }

    const handleValueUpdate = (key, value) => {
        setCogs(prevCogs => ({
            ...prevCogs,
            [key]: value
          }));
    }

    const onDelete = (key) => {
        setCogs(prevCogs => {
            const newCogs = { ...prevCogs };
            delete newCogs[key];
            return newCogs;
          });
    }

    const onAdd = () => {
        const name = "COGS" + (Object.keys(cogs).length + 1).toString();
        setCogs(prevCogs => ({
            ...prevCogs,
            [name]: 0
          }));
    }
    
    useEffect(() => {
        if (data) {
            
        }
    }, [data]);

    useEffect(() => {
        let margin = aov;
        //console.log(Object.values(cogs));
        Object.values(cogs).forEach(value => {margin -= value;});
        setMargin(margin);
        if (aov != 0) {
            setMarginRate((margin / aov * 100).toFixed(2));
        }
        if (aov != 0 && cac != 0) {
            if (enableChurn) {
                if (churn != 0) {
                    let ltv = (1/(churn/100) * order * aov).toFixed(2)
                    setLtv((1/(churn/100) * order * aov).toFixed(2));
                    setRatio(ltv / cac)
                } else {
                    setLtv(0);
                    setRatio(0);
                }
            } else {
                let ltv = (aov * order);
                setLtv(ltv);
                setRatio(ltv / cac);
            }
        }
    }, [aov, cac, enableChurn, churn, cogs]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        setCategory(option);
        setIsOpen(false);
    };


    const handleCategoryClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleCategoryClose = (option) => {
        if (option) {
          setCategory(option);
        }
        setAnchorEl(null);
      };
    

    

      const handleReset = () => {
        setAov(0);
        setOrder(0);
        setEnableChurn(false);
        setChurn(0);
        setCogs({ 'Product Cost': 0, 'Shipping': 0 });
        setCac(0);
        setCategory('E-Commerce');
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
                  <BusinessCenter /> Business Metrics Calculator
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
                              Business Inputs
                            </Typography>
                          </Box>
                          <CardContent sx={{ pt: 4 }}>
                            <Grid container spacing={3}>
                              {/* Business Category */}
                              <Grid item xs={12}>
                                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Assessment /> Business Category & Core Metrics
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Tooltip 
                                  title="Select your business model" 
                                  placement="top" 
                                  arrow
                                  TransitionComponent={Zoom}
                                >
                                  <Button
                                    variant="outlined"
                                    fullWidth
                                    endIcon={<KeyboardArrowDownIcon />}
                                    onClick={handleCategoryClick}
                                    sx={{ 
                                      justifyContent: 'space-between', 
                                      py: 1.5,
                                      fontWeight: 'normal',
                                      color: 'text.primary',
                                      borderColor: 'divider'
                                    }}
                                  >
                                    {category}
                                  </Button>
                                </Tooltip>
                                <Menu
                                  anchorEl={anchorEl}
                                  open={Boolean(anchorEl)}
                                  onClose={() => handleCategoryClose()}
                                >
                                  {options.map((option) => (
                                    <MenuItem
                                      key={option}
                                      onClick={() => handleCategoryClose(option)}
                                    >
                                      {option}
                                    </MenuItem>
                                  ))}
                                </Menu>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Tooltip 
                                  title="Average value of each customer order" 
                                  placement="top" 
                                  arrow
                                  TransitionComponent={Zoom}
                                >
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="aov-input">Average Order Value (AOV)</InputLabel>
                                    <OutlinedInput
                                      id="aov-input"
                                      value={aov}
                                      onChange={(e) => setAov(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                      label="Average Order Value (AOV)"
                                      type="number"
                                    />
                                  </FormControl>
                                </Tooltip>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Tooltip 
                                  title="Average number of orders per customer" 
                                  placement="top" 
                                  arrow
                                  TransitionComponent={Zoom}
                                >
                                  <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="order-input">Average Number of Orders</InputLabel>
                                    <OutlinedInput
                                      id="order-input"
                                      value={order}
                                      onChange={(e) => setOrder(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                      label="Average Number of Orders"
                                      type="number"
                                    />
                                  </FormControl>
                                </Tooltip>
                              </Grid>
                              
                              {/* Churn Rate Toggle */}
                              <Grid item xs={12}>
                                <Tooltip 
                                  title="Enable to factor customer churn into LTV calculations" 
                                  placement="top" 
                                  arrow
                                  TransitionComponent={Zoom}
                                >
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={enableChurn}
                                        onChange={() => setEnableChurn(!enableChurn)}
                                        color="primary"
                                      />
                                    }
                                    label="Enable Churn Rate"
                                  />
                                </Tooltip>
                              </Grid>
                              
                              {/* Churn Rate (conditional) */}
                              <Grid item xs={12}>
                                <Collapse in={enableChurn}>
                                  <Tooltip 
                                    title="Percentage of customers who stop using your product/service" 
                                    placement="top" 
                                    arrow
                                    TransitionComponent={Zoom}
                                  >
                                    <FormControl fullWidth variant="outlined">
                                      <InputLabel htmlFor="churn-input">Churn Rate (%)</InputLabel>
                                      <OutlinedInput
                                        id="churn-input"
                                        value={churn}
                                        onChange={(e) => setChurn(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                        label="Churn Rate (%)"
                                        type="number"
                                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                      />
                                    </FormControl>
                                  </Tooltip>
                                </Collapse>
                              </Grid>
                              
                              {/* COGS Section */}
                              <Grid item xs={12}>
                                <Typography variant="h6" color="secondary" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <TimelineIcon /> Cost Structure
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                                  Cost of Goods Sold (COGS)
                                </Typography>
                                {Object.entries(cogs).map(([key, value]) => (
                                  <Box 
                                    key={key} 
                                    sx={{ 
                                      display: 'flex', 
                                      gap: 1, 
                                      mb: 2,
                                      alignItems: 'center' 
                                    }}
                                  >
                                    <TextField
                                      label="Cost Name"
                                      value={key}
                                      onChange={(e) => handleKeyUpdate(e.target.value, key, value)}
                                      size="small"
                                      sx={{ flex: 1 }}
                                    />
                                    <FormControl sx={{ flex: 1 }}>
                                      <InputLabel htmlFor={`cogs-value-${key}`}>Amount</InputLabel>
                                      <OutlinedInput
                                        id={`cogs-value-${key}`}
                                        value={value}
                                        onChange={(e) => handleValueUpdate(key, e.target.value === '' ? 0 : parseInt(e.target.value))}
                                        startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                        label="Amount"
                                        size="small"
                                        type="number"
                                      />
                                    </FormControl>
                                    <IconButton 
                                      color="error" 
                                      onClick={() => onDelete(key)}
                                      size="small"
                                      sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' } }}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                                <Button
                                  variant="outlined"
                                  startIcon={<AddIcon />}
                                  onClick={onAdd}
                                  sx={{ alignSelf: 'flex-start' }}
                                >
                                  Add COGS
                                </Button>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Tooltip 
                                  title="Average cost to acquire each new customer" 
                                  placement="top" 
                                  arrow
                                  TransitionComponent={Zoom}
                                >
                                  <FormControl fullWidth variant="outlined" sx={{ mt: 1 }}>
                                    <InputLabel htmlFor="cac-input">Customer Acquisition Cost (CAC)</InputLabel>
                                    <OutlinedInput
                                      id="cac-input"
                                      value={cac}
                                      onChange={(e) => setCac(e.target.value === "" ? 0 : parseInt(e.target.value))}
                                      startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                      label="Customer Acquisition Cost (CAC)"
                                      type="number"
                                    />
                                  </FormControl>
                                </Tooltip>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grow>
                    </Grid>
    
                    {/* Right Column - Results and Actions */}
                    <Grid item xs={12} md={5}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
                        {/* Results Card */}
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
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                              Unit Economics Results
                            </Typography>
                            
                            <Grid container spacing={3} sx={{ mt: 1 }}>
                              <Grid item xs={12} sm={6}>
                                <Box 
                                  sx={{
                                    p: 2,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    height: '100%',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AttachMoneyIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">Margin</Typography>
                                  </Box>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    ${margin.toLocaleString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Box 
                                  sx={{
                                    p: 2,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    height: '100%',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <ShowChartIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">Margin Rate</Typography>
                                  </Box>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {marginRate}%
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Box 
                                  sx={{
                                    p: 2,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    height: '100%',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <TimelineIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">LTV</Typography>
                                  </Box>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    ${ltv.toLocaleString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Box 
                                  sx={{
                                    p: 2,
                                    bgcolor: alpha('#fff', 0.1),
                                    borderRadius: 2,
                                    height: '100%',
                                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <MonetizationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                                    <Typography variant="body2">LTV:CAC</Typography>
                                  </Box>
                                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    {ratio}
                                  </Typography>
                                  {ratio > 0 && (
                                    <Typography 
                                      variant="caption" 
                                      sx={{ 
                                        display: 'inline-block',
                                        px: 1,
                                        py: 0.5,
                                        mt: 1,
                                        bgcolor: ratio >= 3 ? 'success.main' : ratio >= 1 ? 'warning.main' : 'error.main',
                                        borderRadius: 1,
                                        color: 'white',
                                        fontWeight: 'bold'
                                      }}
                                    >
                                      {ratio >= 3 ? 'Excellent' : ratio >= 1 ? 'Good' : 'Needs Improvement'}
                                    </Typography>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
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
                                    ) : "Save Calculations"}
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
                                This tool calculates key unit economics metrics for your business including margin, 
                                margin rate, customer lifetime value (LTV), and LTV to CAC ratio. These metrics help 
                                you understand profitability at the customer level.
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
}

export default UnitEcon;