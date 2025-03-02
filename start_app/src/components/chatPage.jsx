import React, { useState, useEffect, useRef } from "react";
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Container,
  Avatar,
  Chip,
  Fade,
  Slide,
  Zoom,
  CircularProgress,
  ThemeProvider,
  createTheme,
  alpha,
  Divider,
  useMediaQuery
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import ReactMarkdown from 'react-markdown';
import Navbar from "./navbar";



// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#29524a', // Indigo
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#10b981", // Emerald
      light: "#34d399",
      dark: "#059669",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    messageUser: {
      main: "#ede9fe", // Light indigo
      contrastText: "#4338ca",
    },
    messageAI: {
      main: "#ecfdf5", // Light emerald
      contrastText: "#065f46",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.7,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },
  },
});

// Custom styled components
const MessageBubble = styled(Paper)(({ theme, isuser }) => ({
  padding: theme.spacing(2),
  maxWidth: "80%",
  marginBottom: theme.spacing(1.5),
  position: "relative",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[3],
  },
  ...(isuser === "true"
    ? {
        marginLeft: "auto",
        backgroundColor: theme.palette.messageUser.main,
        color: theme.palette.messageUser.contrastText,
        borderTopRightRadius: 4,
        "&:after": {
          content: '""',
          position: "absolute",
          right: -10,
          top: 0,
          width: 0,
          height: 0,
          borderLeft: "10px solid " + theme.palette.messageUser.main,
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
        },
      }
    : {
        backgroundColor: theme.palette.messageAI.main,
        color: theme.palette.messageAI.contrastText,
        borderTopLeftRadius: 4,
        "&:after": {
          content: '""',
          position: "absolute",
          left: -10,
          top: 0,
          width: 0,
          height: 0,
          borderRight: "10px solid " + theme.palette.messageAI.main,
          borderTop: "10px solid transparent",
          borderBottom: "10px solid transparent",
        },
      }),
}));

const SendButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  borderRadius: 20,
  padding: 12,
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "translateY(-2px)",
    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.4)}`,
  },
  "&:disabled": {
    backgroundColor: alpha(theme.palette.primary.main, 0.7),
    color: "#fff",
  },
}));

const ScrollDownButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  right: 20,
  bottom: 90,
  backgroundColor: alpha(theme.palette.background.paper, 0.9),
  boxShadow: theme.shadows[2],
  zIndex: 10,
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);
  const userId = JSON.parse(localStorage.getItem("currentUser"))?.uid || "";
  const [sessionId, setSessionId] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchMostRecentChat();
  }, []);

  useEffect(() => {
    scrollToBottom(true);
  }, [messages]);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
      setShowScrollButton(!isAtBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBottom = (smooth = false) => {
    if (chatContainerRef.current) {
      const scrollOptions = smooth ? { behavior: "smooth" } : undefined;
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        ...scrollOptions,
      });
    }
  };

  const fetchMostRecentChat = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/feedback/latest?user_id=${userId}`);
      const data = await response.json();

      if (response.ok && data.session_id) {
        setSessionId(data.session_id);
        fetchChatHistory(data.session_id);
      } else {
        console.error("Error fetching most recent chat:", data.error);
      }
    } catch (error) {
      console.error("Error fetching most recent chat:", error);
    }
  };

  const fetchChatHistory = async (sessionId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://127.0.0.1:5000/api/feedback/history?user_id=${userId}&session_id=${sessionId}`
      );
      const data = await response.json();
      if (response.ok) {
        setMessages(data.history);
      } else {
        console.error("Error fetching chat history:", data.error);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const userMessage = { role: "user", message: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/feedback/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, session_id: sessionId, message: input }),
      });

      const data = await response.json();
      if (response.ok) {
        // Small delay for better UX
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: "llm", message: data.response }]);
        }, 500);
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar/>
      <Slide direction="up" in={true} timeout={800}>
        <Container
          maxWidth="md"
          sx={{
            height: "100vh",
            py: isMobile ? 2 : 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Paper
            elevation={4}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              overflow: "hidden",
              boxShadow: "0px 8px 40px rgba(0, 0, 0, 0.12)",
              borderRadius: 3,
              bgcolor: "background.paper",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                pb: 1.5,
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid",
                borderColor: "divider",
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 40,
                  height: 40,
                  mr: 2,
                  boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              >
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ lineHeight: 1.2 }}>
                  Business Plan Assistant
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDate()} • Session #{sessionId?.substring(0, 8) || "..."}
                </Typography>
              </Box>
              <Chip
                size="small"
                color="secondary"
                variant="outlined"
                icon={<AutoAwesomeIcon fontSize="small" />}
                label="AI Powered"
                sx={{ ml: "auto", height: 24 }}
              />
            </Box>

            {/* Messages container */}
            <Box
              ref={chatContainerRef}
              sx={{
                flexGrow: 1,
                overflow: "auto",
                p: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.03),
                backgroundImage: `radial-gradient(${alpha(theme.palette.primary.main, 0.1)} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
                scrollBehavior: "smooth",
                position: "relative",
              }}
            >
              {/* Welcome message */}
              {messages.length === 0 && !loading && (
                <Fade in={true} timeout={1000}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      textAlign: "center",
                      opacity: 0.8,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        mb: 2,
                        bgcolor: "primary.main",
                        boxShadow: 2,
                      }}
                    >
                      <SmartToyIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom>
                      Business Plan Assistant
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400 }}>
                      I'm here to provide feedback and guidance on your business plan. Ask me anything about your plan or business strategy!
                    </Typography>
                    <Divider sx={{ width: 60, my: 2 }} />
                    <Typography variant="caption" color="text.secondary">
                      Type a message below to get started
                    </Typography>
                  </Box>
                </Fade>
              )}

              {messages.map((msg, index) => (
                <Zoom
                  key={index}
                  in={true}
                  style={{ transitionDelay: `${50 * (index % 3)}ms` }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      mb: 2,
                      pl: msg.role === "user" ? 6 : 0,
                      pr: msg.role === "llm" ? 6 : 0,
                    }}
                  >
                    {msg.role === "llm" && (
                      <Avatar
                        sx={{
                          bgcolor: "secondary.main",
                          width: 34,
                          height: 34,
                          mr: 1.5,
                          mt: 0.5,
                        }}
                      >
                        <SmartToyIcon fontSize="small" />
                      </Avatar>
                    )}
                    <MessageBubble
                      elevation={1}
                      isuser={msg.role === "user" ? "true" : "false"}
                    >
                      {msg.role === "llm" ? (
                        <ReactMarkdown 
                          components={{
                            p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
                            strong: ({ node, ...props }) => <Box component="span" sx={{ fontWeight: 'bold' }} {...props} />,
                            em: ({ node, ...props }) => <Box component="span" sx={{ fontStyle: 'italic' }} {...props} />,
                            h1: ({ node, ...props }) => <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }} {...props} />,
                            h2: ({ node, ...props }) => <Typography variant="subtitle1" sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }} {...props} />,
                            h3: ({ node, ...props }) => <Typography variant="subtitle2" sx={{ mt: 1, mb: 0.5, fontWeight: 'bold' }} {...props} />,
                            ul: ({ node, ...props }) => <Box component="ul" sx={{ pl: 2, m: 0 }} {...props} />,
                            ol: ({ node, ...props }) => <Box component="ol" sx={{ pl: 2, m: 0 }} {...props} />,
                            li: ({ node, ...props }) => <Box component="li" sx={{ mb: 0.5 }} {...props} />,
                            code: ({ node, inline, ...props }) => 
                              inline ? 
                                <Box component="code" sx={{ 
                                  bgcolor: alpha(theme.palette.messageAI.main, 0.6), 
                                  px: 0.5, 
                                  py: 0.25,
                                  borderRadius: 0.5,
                                  fontFamily: 'monospace'
                                }} {...props} /> : 
                                <Box component="pre" sx={{ 
                                  bgcolor: alpha(theme.palette.messageAI.main, 0.6),
                                  p: 1,
                                  borderRadius: 1,
                                  overflowX: 'auto',
                                  fontFamily: 'monospace',
                                  fontSize: '0.875rem',
                                  my: 1
                                }} {...props} />,
                          }}
                        >
                          {msg.message}
                        </ReactMarkdown>
                      ) : (
                        <Typography variant="body1" component="div">
                          {msg.message.split("\n").map((text, i) => (
                            <React.Fragment key={i}>
                              {text}
                              {i !== msg.message.split("\n").length - 1 && <br />}
                            </React.Fragment>
                          ))}
                        </Typography>
                      )}
                    </MessageBubble>
                    {msg.role === "user" && (
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          width: 34,
                          height: 34,
                          ml: 1.5,
                          mt: 0.5,
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    )}
                  </Box>
                </Zoom>
              ))}

              {/* Loading indicator */}
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "secondary.main",
                      width: 34,
                      height: 34,
                      mr: 1.5,
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>
                  <Paper
                    sx={{
                      py: 1.5,
                      px: 2.5,
                      borderRadius: 2,
                      borderTopLeftRadius: 0,
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: theme.palette.messageAI.main,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <CircularProgress
                        size={20}
                        thickness={6}
                        sx={{ color: theme.palette.messageAI.contrastText }}
                      />
                      <Typography
                        variant="body2"
                        color="inherit"
                        sx={{ ml: 1.5, fontWeight: 500 }}
                      >
                        Thinking...
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )}

              {/* Scroll button */}
              {showScrollButton && (
                <Zoom in={showScrollButton}>
                  <ScrollDownButton
                    color="primary"
                    size="small"
                    onClick={() => scrollToBottom(true)}
                  >
                    <ExpandMoreIcon />
                  </ScrollDownButton>
                </Zoom>
              )}
            </Box>

            {/* Input area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                backgroundColor: alpha(theme.palette.background.paper, 0.8),
                backdropFilter: "blur(8px)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <TextField
                  placeholder="Type your message..."
                  multiline
                  maxRows={4}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 3,
                      pr: 1,
                      transition: "all 0.3s",
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        boxShadow: `0 2px 10px ${alpha(
                          theme.palette.primary.main,
                          0.1
                        )}`,
                      },
                      "&.Mui-focused": {
                        boxShadow: `0 4px 15px ${alpha(
                          theme.palette.primary.main,
                          0.25
                        )}`,
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <Box sx={{ ml: 1 }}>
                        <SendButton
                          onClick={sendMessage}
                          disabled={!input.trim() || loading || !sessionId}
                          size="large"
                        >
                          <SendIcon fontSize="small" />
                        </SendButton>
                      </Box>
                    ),
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1, textAlign: "center" }}
              >
                Ask about your business strategy, target market, or financial projections
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Slide>
    </ThemeProvider>
  );
}