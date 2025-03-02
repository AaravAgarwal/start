import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Card,
  CardContent,
  Fab,
  Zoom,
  Slide,
  Grow,
  LinearProgress,
  ThemeProvider,
  createTheme,
  alpha,
  Backdrop,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import MarketingIcon from "@mui/icons-material/Campaign";
import StrategyIcon from "@mui/icons-material/Psychology";
import InventoryIcon from "@mui/icons-material/Inventory";
import FlagIcon from "@mui/icons-material/Flag";
import SendIcon from "@mui/icons-material/Send";
import Navbar from "./navbar";


// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#29524a", // Green
    },
    secondary: {
      main: "#94a187", // Blue
    },
    background: {
      default: "#f5f7fa",
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
        multiline: true,
        minRows: 3,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

export default function BusinessPlanForm() {
  const [formData, setFormData] = useState({
    user_id: "",
    venture_name: "",
    location: "",
    mission: "",
    what: "",
    sales_marketing: "",
    operations: "",
    finance: "",
    result_created: "",
    how_result_created: "",
    who_served: "",
    why_doing_this: "",
    why_customers_choose: "",
    step_by_step_plan: "",
    demographics: "",
    psychographics: "",
    size_target_market: "",
    where_find_customers: "",
    visibility_strategy: "",
    lead_generation_strategy: "",
    conversion_strategy: "",
    products: [{ primary_product: "", result: "", impact: "" }],
    one_year_goal: "",
    five_year_plus_goal: "",
  });

  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false); // State for loading screen
  const navigate = useNavigate();

  // Load user data
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const uid = currentUser ? currentUser.uid : "";
    const savedData = localStorage.getItem(`businessPlanFormData_${uid}`);
    if (savedData) {
      setFormData(JSON.parse(savedData));
    } else {
      setFormData(prev => ({ ...prev, user_id: uid }));
    }
  }, []);

  // Calculate form progress
  useEffect(() => {
    let filledFields = 0;
    let totalFields = 0;
    
    // Count required fields
    const requiredFields = ["venture_name", "location", "mission", "what"];
    requiredFields.forEach(field => {
      totalFields++;
      if (formData[field]?.trim()) filledFields++;
    });
    
    // Count optional fields
    const optionalFields = [
      "sales_marketing", "operations", "finance", "result_created", 
      "how_result_created", "who_served", "why_doing_this", 
      "why_customers_choose", "step_by_step_plan", "demographics", 
      "psychographics", "size_target_market", "where_find_customers", 
      "visibility_strategy", "lead_generation_strategy", "conversion_strategy",
      "one_year_goal", "five_year_plus_goal"
    ];
    
    optionalFields.forEach(field => {
      totalFields++;
      if (formData[field]?.trim()) filledFields++;
    });
    
    // Count product fields
    formData.products.forEach(product => {
      Object.keys(product).forEach(field => {
        totalFields++;
        if (product[field]?.trim()) filledFields++;
      });
    });
    
    const calculatedProgress = Math.floor((filledFields / totalFields) * 100);
    setProgress(calculatedProgress);
  }, [formData]);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const uid = currentUser ? currentUser.uid : "";
      localStorage.setItem(`businessPlanFormData_${uid}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = formData.products.map((product, i) =>
      i === index ? { ...product, [field]: value } : product
    );
    const updatedForm = { ...formData, products: updatedProducts };
    setFormData(updatedForm);
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const uid = currentUser ? currentUser.uid : "";
    localStorage.setItem(`businessPlanFormData_${uid}`, JSON.stringify(updatedForm));
  };

  const addProduct = () => {
    setFormData(prev => {
      const updated = { 
        ...prev, 
        products: [...prev.products, { primary_product: "", result: "", impact: "" }] 
      };
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      const uid = currentUser ? currentUser.uid : "";
      localStorage.setItem(`businessPlanFormData_${uid}`, JSON.stringify(updated));
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting business form for user:", formData.user_id);
    
    // Show loading screen
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/feedback/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.user_id,
          venture_name: formData.venture_name,
          location: formData.location,
          mission: formData.mission,
          what: formData.what,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Business plan submitted:", data);
        
        // Add a small delay to show the loading animation (optional)
        setTimeout(() => {
          navigate("/chat");
        }, 1000);
      } else {
        console.error("Error:", data.error);
        setLoading(false); // Hide loading screen on error
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setLoading(false); // Hide loading screen on error
      alert("Error submitting form. Please try again.");
    }
  };

  // Prepare required field sections
  const requiredFields = [
    {
      name: "venture_name",
      label: "What is the name of your venture?",
      placeholder: "Enter your business name...",
    },
    {
      name: "location",
      label: "Where is your business located or primarily operating?",
      placeholder: "Enter your business location...",
    },
    {
      name: "mission",
      label: "What is your mission statement?",
      placeholder: "Describe your business's purpose and vision...",
    },
    {
      name: "what",
      label: "What does your business do?",
      placeholder: "Explain your core offerings and goals...",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column',
          bgcolor: 'rgba(46, 125, 50, 0.8)'  // Semi-transparent primary color
        }}
        open={loading}
      >
        <CircularProgress color="inherit" size={60} thickness={4} />
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2, 
            fontWeight: 500,
            textAlign: 'center',
            animation: 'pulse 1.5s infinite ease-in-out',
            '@keyframes pulse': {
              '0%': { opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { opacity: 0.6 },
            }
          }}
        >
          Analyzing your business plan...
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mt: 1, 
            opacity: 0.9,
            maxWidth: 400,
            textAlign: 'center'
          }}
        >
          We're preparing your personalized chat experience
        </Typography>
      </Backdrop>
      
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Slide direction="down" in={true} timeout={800}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                height: 8,
                width: `${progress}%`,
                bgcolor: progress < 25 ? "error.main" : progress < 50 ? "warning.main" : "success.main",
                transition: "width 0.8s ease-in-out",
              }}
            />
            
            <Box sx={{ display: "flex", alignItems: "center", p: 4, pb: 2 }}>
              <Grow in={true} timeout={1000}>
                <BusinessIcon sx={{ mr: 2, fontSize: 40, color: "primary.main" }} />
              </Grow>
              <Box>
                <Typography variant="h4" gutterBottom>
                  Business Plan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Define your business strategy and goals
                </Typography>
              </Box>
              <Box sx={{ ml: "auto", display: "flex", alignItems: "center" }}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {progress}% complete
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ width: 100, height: 8, borderRadius: 4 }}
                />
              </Box>
            </Box>

            <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
              {/* Required Fields */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Basic Information
                </Typography>
                <Box sx={{ display: "grid", gap: 3 }}>
                  {requiredFields.map((field, index) => (
                    <Grow
                      in={true}
                      style={{ transformOrigin: "0 0 0" }}
                      timeout={500 + index * 200}
                      key={field.name}
                    >
                      <TextField
                        name={field.name}
                        label={field.label}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            transition: "all 0.3s",
                            "&:hover": {
                              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                            },
                            "&.Mui-focused": {
                              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`,
                            }
                          }
                        }}
                      />
                    </Grow>
                  ))}
                </Box>
              </Box>

              {/* Marketing Section */}
              <Accordion 
                expanded={expanded === "marketing"} 
                onChange={handleAccordionChange("marketing")}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: expanded === "marketing" ? 
                    `0 8px 24px ${alpha(theme.palette.secondary.main, 0.2)}` : 1,
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: expanded === "marketing" ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <MarketingIcon sx={{ mr: 1.5, color: "secondary.main" }} />
                    <Typography variant="h6">Marketing Strategy</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {[
                      {
                        name: "sales_marketing",
                        label: "How will you market and sell your product?",
                        placeholder: "Describe your marketing and sales approach..."
                      },
                      {
                        name: "visibility_strategy",
                        label: "How do you plan to make your business more visible?",
                        placeholder: "Describe your visibility strategy..."
                      },
                      {
                        name: "lead_generation_strategy",
                        label: "What is your lead generation strategy?",
                        placeholder: "Describe how you'll generate leads..."
                      },
                      {
                        name: "conversion_strategy",
                        label: "How do you plan to convert leads into customers?",
                        placeholder: "Describe your conversion strategy..."
                      }
                    ].map((field) => (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Business Strategy Section */}
              <Accordion 
                expanded={expanded === "strategy"} 
                onChange={handleAccordionChange("strategy")}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: expanded === "strategy" ? 
                    `0 8px 24px ${alpha(theme.palette.secondary.main, 0.2)}` : 1,
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: expanded === "strategy" ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <StrategyIcon sx={{ mr: 1.5, color: "secondary.main" }} />
                    <Typography variant="h6">Business Strategy</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {[
                      {
                        name: "result_created",
                        label: "What is the primary result your company aims to achieve?",
                        placeholder: "Describe your primary business objective..."
                      },
                      {
                        name: "how_result_created",
                        label: "How do you create this result for customers?",
                        placeholder: "Explain your value creation process..."
                      },
                      {
                        name: "who_served",
                        label: "Who are your primary customers or clients?",
                        placeholder: "Describe your target audience..."
                      },
                      {
                        name: "why_doing_this",
                        label: "Why are you pursuing this business?",
                        placeholder: "Share your motivation and purpose..."
                      },
                      {
                        name: "why_customers_choose",
                        label: "Why should customers choose you over competitors?",
                        placeholder: "Explain your unique value proposition..."
                      },
                      {
                        name: "step_by_step_plan",
                        label: "What are the key steps in your business plan?",
                        placeholder: "Outline your implementation strategy..."
                      }
                    ].map((field) => (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Products Section */}
              <Accordion 
                expanded={expanded === "products"} 
                onChange={handleAccordionChange("products")}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: expanded === "products" ? 
                    `0 8px 24px ${alpha(theme.palette.secondary.main, 0.2)}` : 1,
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: expanded === "products" ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <InventoryIcon sx={{ mr: 1.5, color: "secondary.main" }} />
                    <Typography variant="h6">Products & Services</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ mb: 3 }}>
                    {formData.products.map((product, index) => (
                      <Zoom in={true} key={index} style={{ transitionDelay: `${index * 150}ms` }}>
                        <Card
                          variant="outlined"
                          sx={{
                            mb: 3,
                            borderRadius: 2,
                            boxShadow: `0 4px 20px ${alpha(theme.palette.secondary.main, 0.15)}`,
                            position: "relative",
                            overflow: "visible",
                            "&:before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 4,
                              backgroundColor: "secondary.main",
                              borderTopLeftRadius: 8,
                              borderBottomLeftRadius: 8,
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                mb: 3, 
                                color: 'secondary.main', 
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <span className="product-number"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 28,
                                  height: 28,
                                  backgroundColor: theme.palette.secondary.main,
                                  color: 'white',
                                  borderRadius: 14,
                                  marginRight: 8,
                                  fontSize: 14,
                                }}
                              >
                                {index + 1}
                              </span>
                              Product/Service
                            </Typography>
                            
                            <Box sx={{ display: "grid", gap: 3 }}>
                              {[
                                {
                                  field: "primary_product",
                                  label: "Describe the primary product or service you offer",
                                  placeholder: "What do you sell or provide?..."
                                },
                                {
                                  field: "result",
                                  label: "What result does your product/service provide to customers?",
                                  placeholder: "What problems do you solve?..."
                                },
                                {
                                  field: "impact",
                                  label: "What impact does your product/service have on your customers?",
                                  placeholder: "How do you improve their lives?..."
                                }
                              ].map((item) => (
                                <TextField
                                  key={item.field}
                                  label={item.label}
                                  value={product[item.field]}
                                  onChange={(e) => handleProductChange(index, item.field, e.target.value)}
                                  placeholder={item.placeholder}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    ))}
                  </Box>
                  <Fab
                    color="secondary"
                    size="medium"
                    onClick={addProduct}
                    sx={{
                      boxShadow: 3,
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease-in-out',
                      }
                    }}
                  >
                    <AddIcon />
                  </Fab>
                </AccordionDetails>
              </Accordion>

              {/* Goals Section */}
              <Accordion 
                expanded={expanded === "goals"} 
                onChange={handleAccordionChange("goals")}
                sx={{
                  mb: 4,
                  borderRadius: 2,
                  '&:before': { display: 'none' },
                  boxShadow: expanded === "goals" ? 
                    `0 8px 24px ${alpha(theme.palette.secondary.main, 0.2)}` : 1,
                  transition: 'box-shadow 0.3s ease-in-out',
                }}
              >
                <AccordionSummary 
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    borderRadius: 2,
                    bgcolor: expanded === "goals" ? alpha(theme.palette.secondary.main, 0.08) : 'transparent',
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FlagIcon sx={{ mr: 1.5, color: "secondary.main" }} />
                    <Typography variant="h6">Future Goals</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "grid", gap: 3 }}>
                    {[
                      {
                        name: "one_year_goal",
                        label: "What is your primary goal for the next year?",
                        placeholder: "Describe your short-term objectives..."
                      },
                      {
                        name: "five_year_plus_goal",
                        label: "Where do you see your business in 5+ years?",
                        placeholder: "Share your long-term vision..."
                      }
                    ].map((field) => (
                      <TextField
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                endIcon={<SendIcon />}
                sx={{ 
                  py: 1.5, 
                  px: 4,
                  fontSize: 16,
                  boxShadow: '0 8px 16px rgba(46, 125, 50, 0.2)',
                  '&:hover': {
                    boxShadow: '0 12px 20px rgba(46, 125, 50, 0.3)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Submit Business Plan
              </Button>
            </Box>
          </Paper>
        </Slide>
      </Container>
    </ThemeProvider>
  );
}