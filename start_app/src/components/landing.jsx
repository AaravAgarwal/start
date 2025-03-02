import OAuth from "./sign-in.jsx";
import React, { useState, useEffect, useRef } from 'react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    CssBaseline,
    Divider,
    Fade,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Paper,
    Slide,
    TextField,
    Toolbar,
    Typography,
    useScrollTrigger,
    Zoom,
    ThemeProvider,
    createTheme,
    Avatar,
    alpha
} from '@mui/material';
import {
    TrendingUp,
    BarChart,
    ShowChart,
    AccountBalance,
    AssignmentTurnedIn,
    Psychology,
    Search,
    AttachMoney,
    Speed,
    Menu as MenuIcon
} from '@mui/icons-material';
import Navbar from "./navbar";



// Create a custom theme for START
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#29524a',
            light: '#94A187',
            dark: '#06070e',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#c5afa0',
            light: '#39bcb7',
            dark: '#06070e',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.5px',
        },
        h3: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 600,
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 50,
                    padding: '10px 24px',
                    fontSize: '1rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
                    },
                },
            },
        },
    },
});


// Animation component using IntersectionObserver
// Animation component using IntersectionObserver
const AnimatedSection = ({ children, direction = 'up', threshold = 0.1 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef(null);

    useEffect(() => {
        const currentRef = domRef.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold });

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [threshold]);

    return (
        <div ref={domRef} style={{ width: '100%' }}>
            <Slide direction={direction} in={isVisible} timeout={800} mountOnEnter>
                <Box>
                    <Fade in={isVisible} timeout={1200}>
                        <Box>{children}</Box>
                    </Fade>
                </Box>
            </Slide>
        </div>
    );
};

// Service card component
const ServiceCard = ({ icon, title, description }) => {
    return (
        <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Avatar
                    sx={{
                        bgcolor: 'primary.main',
                        width: 70,
                        height: 70,
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 16px rgba(58, 54, 224, 0.25)'
                    }}
                >
                    {icon}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {description}
                </Typography>
            </CardContent>
        </Card>
    );
};

const Landing = () => {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 100,
    });
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            if (scrollY > 100) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        // Form submission logic
        console.log('Form submitted');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    bgcolor: 'background.default',
                }}
            >
                <AppBar
                    position="fixed"
                    color={scrolled ? 'primary' : 'transparent'}
                    elevation={scrolled ? 4 : 0}
                    sx={{
                        transition: 'all 0.3s ease',
                        backdropFilter: scrolled ? 'blur(10px)' : 'none',
                        backgroundColor: scrolled ? alpha(theme.palette.primary.main, 0.95) : 'transparent',
                    }}
                >
                    <Container maxWidth="lg">
                        <Toolbar sx={{ py: 1 }}>
                            <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>
                                START
                            </Typography>

                            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                                <Button color="inherit" href="/"></Button>
                                <Button color="inherit" href="/dashboard"></Button>
                                <Button color="inherit" href="/unitecon"></Button>
                                <Button color="inherit" href="/business"></Button>
                                {typeof OAuth === 'function' ? OAuth() : null}
                            </Box>

                            <IconButton
                                color="inherit"
                                sx={{ display: { md: 'none' } }}
                                aria-label="menu"
                            >
                                <MenuIcon />
                            </IconButton>
                        </Toolbar>
                    </Container>
                </AppBar>

                {/* Hero Section */}
                <Box
                    sx={{
                        position: 'relative',
                        height: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        background: 'linear-gradient(150deg, #29524a 0%, #94a187 70%, #94a187 100%)',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }
                    }}
                >
                    <Container maxWidth="lg">
                        <Grid container spacing={4} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <Fade in={true} timeout={1000}>
                                    <div>
                                        <Typography
                                            variant="h1"
                                            color="white"
                                            sx={{
                                                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                                mb: 2
                                            }}
                                        >
                                            START UP <br />WITH <span style={{ color: '#e9bcb7' }}>START</span>
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            color="rgba(255, 255, 255, 0.85)"
                                            sx={{ mb: 4, fontWeight: 400 }}
                                        >
                                            Become the next success story with our financial insights and AI-powered analytics
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                size="large"
                                                sx={{
                                                    px: 4,
                                                    py: 1.5,
                                                    boxShadow: '0 10px 20px rgba(233, 188, 183, 0.3)',
                                                }}
                                            >
                                                Get Started
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                sx={{
                                                    color: 'white',
                                                    borderColor: 'white',
                                                    px: 4,
                                                    py: 1.5,
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                        borderColor: 'white',
                                                    }
                                                }}
                                            >
                                                Learn More
                                            </Button>
                                        </Box>
                                    </div>
                                </Fade>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
                                <Zoom in={true} timeout={1500} style={{ transitionDelay: '500ms' }}>
                                    <div>
                                        <Box
                                            sx={{
                                                position: 'relative',
                                                height: { xs: 300, md: 400, lg: 450 },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '80%',
                                                    height: '80%',
                                                    background: 'rgba(255, 255, 255, 0.1)',
                                                    backdropFilter: 'blur(30px)',
                                                    borderRadius: '30px',
                                                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                                                    transform: 'rotate(-5deg)',
                                                    top: '10%',
                                                    left: '10%',
                                                    zIndex: 1,
                                                    overflow: 'hidden',
                                                    '&::before': {
                                                        content: '""',
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        right: 0,
                                                        bottom: 0,
                                                        background: 'linear-gradient(45deg, rgba(94, 252, 130, 0.4) 0%, rgba(255, 255, 255, 0.1) 100%)',
                                                        zIndex: -1,
                                                    }
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '70%',
                                                    height: '60%',
                                                    background: 'rgba(94, 252, 130, 0.2)',
                                                    backdropFilter: 'blur(20px)',
                                                    borderRadius: '20px',
                                                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
                                                    transform: 'rotate(8deg) translateY(30%)',
                                                    top: '10%',
                                                    right: '5%',
                                                    zIndex: 2,
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    width: '50%',
                                                    height: '40%',
                                                    background: 'rgba(255, 255, 255, 0.15)',
                                                    backdropFilter: 'blur(10px)',
                                                    borderRadius: '15px',
                                                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                                                    transform: 'rotate(-10deg) translateY(60%)',
                                                    bottom: '10%',
                                                    left: '15%',
                                                    zIndex: 3,
                                                }}
                                            />
                                        </Box>
                                    </div>
                                </Zoom>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Services Section */}
                <Box sx={{ py: 10 }}>
                    <Container maxWidth="lg">
                        <AnimatedSection>
                            <Box sx={{ textAlign: 'center', mb: 8 }}>
                                <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontWeight: 600, mb: 2 }}
                                >
                                    OUR SERVICES
                                </Typography>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        mb: 3,
                                        fontSize: { xs: '2rem', md: '2.5rem' }
                                    }}
                                >
                                    Financial Support for Your Startup
                                </Typography>
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    sx={{
                                        maxWidth: 700,
                                        mx: 'auto',
                                        fontSize: '1.1rem',
                                    }}
                                >
                                    We provide comprehensive financial guidance, AI-powered insights, and strategic planning to help startups secure funding and achieve sustainable growth.
                                </Typography>
                            </Box>
                        </AnimatedSection>

                        <Grid container spacing={4}>
                            <Grid item xs={12} sm={6} md={3}>
                                <AnimatedSection direction="up" threshold={0.1}>
                                    <ServiceCard
                                        icon={<TrendingUp fontSize="large" />}
                                        title="Financial Modeling"
                                        description="Custom financial models to forecast growth, manage cash flow, and optimize financial performance."
                                    />
                                </AnimatedSection>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <AnimatedSection direction="up" threshold={0.1}>
                                    <ServiceCard
                                        icon={<Psychology fontSize="large" />}
                                        title="AI Market Analysis"
                                        description="AI-powered analysis of market trends, competitor landscape, and growth opportunities."
                                    />
                                </AnimatedSection>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <AnimatedSection direction="up" threshold={0.1}>
                                    <ServiceCard
                                        icon={<AccountBalance fontSize="large" />}
                                        title="Investor Matching"
                                        description="Connect with the right investors based on your industry, stage, and financial needs."
                                    />
                                </AnimatedSection>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <AnimatedSection direction="up" threshold={0.1}>
                                    <ServiceCard
                                        icon={<Speed fontSize="large" />}
                                        title="Unit Economics"
                                        description="Analyze and optimize your business metrics to achieve sustainable profitability."
                                    />
                                </AnimatedSection>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* About Section */}
                <Box sx={{
                    py: 12,
                    background: 'linear-gradient(to right, #f8f9fa 50%, #eff6ff 100%)',
                }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={6} alignItems="center">
                            <Grid item xs={12} md={6}>
                                <AnimatedSection direction="left">
                                    <Box sx={{
                                        position: 'relative',
                                        height: 400,
                                        width: '100%',
                                    }}>
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                width: '70%',
                                                height: '70%',
                                                borderRadius: 4,
                                                backgroundColor: 'primary.main',
                                                top: '15%',
                                                left: '5%',
                                                zIndex: 1,
                                            }}
                                        />
                                        <Box
                                            component={Paper}
                                            sx={{
                                                position: 'absolute',
                                                width: '70%',
                                                height: '70%',
                                                top: '25%',
                                                right: '5%',
                                                zIndex: 2,
                                                p: 4,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h4" sx={{ mb: 2, color: 'primary.main' }}>
                                                95%
                                            </Typography>
                                            <Typography variant="body1">
                                                of our clients secure funding within 6 months
                                            </Typography>
                                        </Box>
                                    </Box>
                                </AnimatedSection>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <AnimatedSection direction="right">
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ fontWeight: 600, mb: 2 }}
                                    >
                                        ABOUT US
                                    </Typography>
                                    <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
                                        We Turn Startup Dreams Into Reality
                                    </Typography>
                                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                                        At START, we are dedicated to transforming how startups approach financial planning and fundraising. Our team combines expertise in finance, AI, and business strategy to provide holistic support to entrepreneurs.
                                    </Typography>
                                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem' }}>
                                        Founded by former VCs and startup founders, we understand the challenges startups face. Our mission is to democratize access to financial expertise and mathematical insights, empowering founders to make data-driven decisions.
                                    </Typography>
                                    <Box sx={{ mt: 4 }}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="large"
                                        >
                                            Learn More About Us
                                        </Button>
                                    </Box>
                                </AnimatedSection>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Contact Section */}
                <Box
                    sx={{
                        py: 12,
                        backgroundColor: '#f8f9fa',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%233a36e0" fill-opacity="0.03"%3E%3Cpath d="M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                            zIndex: 1,
                        }
                    }}
                >
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                        <Grid container spacing={6}>
                            <Grid item xs={12} md={6}>
                                <AnimatedSection direction="left">
                                    <Typography
                                        variant="h6"
                                        color="primary"
                                        sx={{ fontWeight: 600, mb: 2 }}
                                    >
                                        CONTACT US
                                    </Typography>
                                    <Typography variant="h3" sx={{ mb: 4 }}>
                                        Ready to Start Your Journey?
                                    </Typography>
                                    <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', mb: 4 }}>
                                        Get in touch with our team of financial experts and AI specialists. We're here to help you navigate the complex world of startup finance and secure the resources you need to grow.
                                    </Typography>

                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 4,
                                        mt: 6,
                                        maxWidth: 450
                                    }}>
                                        

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                bgcolor: alpha(theme.palette.primary.main, 0.04),
                                                borderRadius: 2,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                            }}
                                        >
                                            <Typography variant="h6" gutterBottom>
                                                Contact Information
                                            </Typography>
                                            <Typography variant="body1">
                                                not.a.real@email.com
                                            </Typography>
                                            <Typography variant="body1">
                                                +1 (123) 456-7890
                                            </Typography>
                                        </Paper>
                                    </Box>
                                </AnimatedSection>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <AnimatedSection direction="right">
                                    <Paper
                                        elevation={3}
                                        component="form"
                                        onSubmit={handleSubmit}
                                        sx={{
                                            p: 4,
                                            borderRadius: 4,
                                            boxShadow: '0 20px 40px rgba(58, 54, 224, 0.1)',
                                        }}
                                    >
                                        <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                                            Send Us a Message
                                        </Typography>

                                        <Grid container spacing={3}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="name"
                                                    name="name"
                                                    label="Your Name"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    id="email"
                                                    name="email"
                                                    label="Email Address"
                                                    type="email"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    required
                                                    fullWidth
                                                    multiline
                                                    rows={4}
                                                    id="message"
                                                    name="message"
                                                    label="Your Message"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    size="large"
                                                    sx={{
                                                        py: 1.5,
                                                        boxShadow: '0 10px 20px rgba(58, 54, 224, 0.2)',
                                                    }}
                                                >
                                                    Send Message
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </AnimatedSection>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Footer */}
                <Box sx={{
                    bgcolor: 'primary.dark',
                    color: 'white',
                    py: 6
                }}>
                    <Container maxWidth="lg">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                                    START
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                                    Financial support, mathematical and AI insights for startups looking to secure their future.
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    {/* Social icons would go here */}
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Quick Links
                                </Typography>
                                <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                                    <Box component="li" sx={{ mb: 1.5 }}>
                                        <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                            Home
                                        </Button>
                                    </Box>
                                    <Box component="li" sx={{ mb: 1.5 }}>
                                        <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                            Dashboard
                                        </Button>
                                    </Box>
                                    <Box component="li" sx={{ mb: 1.5 }}>
                                        <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                            Unit Economics
                                        </Button>
                                    </Box>
                                    <Box component="li" sx={{ mb: 1.5 }}>
                                        <Button color="inherit" sx={{ p: 0, textTransform: 'none' }}>
                                            Business Plan
                                        </Button>
                                    </Box>
                                </Box>
                            </Grid>

                            {/* <Grid item xs={12} sm={6} md={4}>
                                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                                    Newsletter
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                                    Subscribe to receive updates and financial insights for your startup.
                                </Typography>
                                <Box sx={{ display: 'flex' }}>
                                    <TextField
                                        variant="outlined"
                                        placeholder="Your email"
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.1)',
                                            borderTopRightRadius: 0,
                                            borderBottomRightRadius: 0,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'rgba(255,255,255,0.2)',
                                                borderRight: 'none',
                                            },
                                            '& .MuiInputBase-input': {
                                                color: 'white',
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        sx={{
                                            borderTopLeftRadius: 0,
                                            borderBottomLeftRadius: 0,
                                            boxShadow: 'none',
                                        }}
                                    >
                                        Subscribe
                                    </Button>
                                </Box>
                            </Grid> */}
                        </Grid>

                        <Divider sx={{ my: 4, bgcolor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="body2" sx={{ opacity: 0.7, textAlign: 'center' }}>
                            &copy; 2025 START. All Rights Reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Landing;