import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardActionArea,
  Chip,
  Box,
  CircularProgress,
  Fade,
  Grow,
  Avatar,
  Divider
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import HomeIcon from "@mui/icons-material/Home";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BusinessIcon from "@mui/icons-material/Business";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VCList from "./VCList";
import Navbar from "./navbar";

import { Link } from "react-router-dom";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#29524a',
    },
    secondary: {
      main: '#29524a',
    },
    background: {
      default: "#f5f7fa",
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  },
});

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating loading animation
    setTimeout(() => setLoading(false), 1200);
    
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      setLoading(true);
      fetch(`http://127.0.0.1:5000/get_sentiments/${user.uid}`)
        .then((response) => response.json())
        .then((result) => {
          setNews(result);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, [user]);

  // Function to determine sentiment icon and color
  const getSentimentData = (sentiment) => {
    const sentimentText = sentiment ? sentiment.toLowerCase() : "";
    
    if (sentimentText.includes("positive")) {
      return { 
        icon: <TrendingUpIcon />, 
        color: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.1)"
      };
    } else if (sentimentText.includes("negative")) {
      return { 
        icon: <TrendingDownIcon />, 
        color: "#f44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)"
      };
    } else {
      return { 
        icon: <TrendingFlatIcon />, 
        color: "#ff9800",
        backgroundColor: "rgba(255, 152, 0, 0.1)"
      };
    }
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" color="primary">
            Loading your dashboard...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Typography variant="h4" color="error">
            User not found. Please log in again.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        
        <Navbar/>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Fade in={true} timeout={800}>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 64,
                    height: 64,
                    mr: 2,
                    fontSize: "2rem",
                  }}
                >
                  {user.companyName ? user.companyName.charAt(0).toUpperCase() : "S"}
                </Avatar>
                <Typography variant="h1" component="h1" gutterBottom sx={{ mb: 0 }}>
                  Welcome, {user.companyName}
                </Typography>
              </Box>

              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardHeader
                      title={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <NewspaperIcon sx={{ mr: 1 }} color="primary" />
                          <Typography variant="h5">Industry News & Sentiment</Typography>
                        </Box>
                      }
                    />
                    <Divider />
                    <CardContent>
                      {news.news && news.news.articles && news.news.articles.length > 0 ? (
                        <Grid container spacing={2}>
                          {news.news.articles.map((article, index) => {
                            const sentimentData = getSentimentData(article.sentiment);
                            return (
                              <Grid item xs={12} key={index}>
                                <Grow in={true} timeout={(index + 1) * 300}>
                                  <Card
                                    sx={{
                                      mb: 2,
                                      borderLeft: `4px solid ${sentimentData.color}`,
                                    }}
                                  >
                                    <CardActionArea
                                      component="a"
                                      href={article.link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <CardContent>
                                        <Box
                                          sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                          }}
                                        >
                                          <Typography
                                            variant="h6"
                                            component="div"
                                            sx={{ mb: 1, flex: 1 }}
                                          >
                                            {article.title}
                                          </Typography>
                                          <Chip
                                            icon={sentimentData.icon}
                                            label={article.sentiment || "Neutral"}
                                            sx={{
                                              color: sentimentData.color,
                                              backgroundColor: sentimentData.backgroundColor,
                                              fontWeight: "bold",
                                              ml: 2,
                                            }}
                                          />
                                        </Box>
                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                          sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                          }}
                                        >
                                          {article.description || "Click to read more about this article."}
                                        </Typography>
                                      </CardContent>
                                    </CardActionArea>
                                  </Card>
                                </Grow>
                              </Grid>
                            );
                          })}
                        </Grid>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,
                            flexDirection: "column",
                          }}
                        >
                          <NewspaperIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
                          <Typography variant="body1" color="text.secondary">
                            No news articles available at this time
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Fade in={true} timeout={1000}>
                    <Card sx={{ height: "100%" }}>
                      <CardHeader
                        title={
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BusinessIcon sx={{ mr: 1 }} color="primary" />
                            <Typography variant="h5">VC Matches</Typography>
                          </Box>
                        }
                      />
                      <Divider />
                      <CardContent>
                        <VCList />
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;