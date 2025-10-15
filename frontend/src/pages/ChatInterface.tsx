import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Science,
  Lightbulb,
  ExpandMore,
  ContentCopy,
  ThumbUp,
  ThumbDown,
} from '@mui/icons-material';
import axios from 'axios';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendations?: MaterialRecommendation[];
}

interface MaterialRecommendation {
  material: {
    _id: string;
    name: string;
    category: string;
    properties: any;
  };
  score: number;
  reasoning: string;
  matchDetails: {
    sustainabilityScore: number;
    costScore: number;
    availabilityScore: number;
  };
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI material selection assistant. I can help you find the perfect materials for your engineering applications. Try asking me something like "I need a corrosion-resistant material for offshore oil platform structures" or "Find sustainable materials for automotive components".',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: inputMessage,
        sessionId: 'demo-session',
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.data.message,
        timestamp: new Date(),
        recommendations: response.data.recommendations,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "Find materials for high-temperature applications",
    "I need sustainable materials for construction",
    "Recommend corrosion-resistant alloys for marine use",
    "What materials are best for cryogenic storage?",
    "Find lightweight materials for aerospace applications",
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
  };

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        AI Material Assistant
      </Typography>

      <Grid container spacing={3} sx={{ flexGrow: 1 }}>
        {/* Chat Area */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Messages */}
            <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              {messages.map((message) => (
                <Box key={message.id} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Paper
                      sx={{
                        p: 2,
                        maxWidth: '70%',
                        backgroundColor: message.type === 'user' ? 'primary.main' : 'grey.100',
                        color: message.type === 'user' ? 'white' : 'text.primary',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            mr: 1,
                            backgroundColor: message.type === 'user' ? 'primary.dark' : 'secondary.main',
                          }}
                        >
                          {message.type === 'user' ? <Person fontSize="small" /> : <SmartToy fontSize="small" />}
                        </Avatar>
                        <Typography variant="caption">
                          {message.type === 'user' ? 'You' : 'AI Assistant'}
                        </Typography>
                      </Box>
                      <Typography variant="body1">{message.content}</Typography>
                      
                      {/* Material Recommendations */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Recommended Materials:
                          </Typography>
                          {message.recommendations.slice(0, 3).map((rec, index) => (
                            <Accordion key={index} sx={{ mb: 1 }}>
                              <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="body2" fontWeight="bold">
                                    {rec.material.name}
                                  </Typography>
                                  <Chip 
                                    label={`${Math.round(rec.score * 100)}% match`} 
                                    size="small" 
                                    color="primary" 
                                  />
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                  {rec.reasoning}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                  <Chip 
                                    label={`Sustainability: ${Math.round(rec.matchDetails.sustainabilityScore * 100)}%`} 
                                    size="small" 
                                    variant="outlined" 
                                  />
                                  <Chip 
                                    label={`Cost: ${Math.round(rec.matchDetails.costScore * 100)}%`} 
                                    size="small" 
                                    variant="outlined" 
                                  />
                                  <Chip 
                                    label={`Availability: ${Math.round(rec.matchDetails.availabilityScore * 100)}%`} 
                                    size="small" 
                                    variant="outlined" 
                                  />
                                </Box>
                                <Button
                                  size="small"
                                  href={`/material/${rec.material._id}`}
                                  sx={{ mt: 1 }}
                                >
                                  View Details
                                </Button>
                              </AccordionDetails>
                            </Accordion>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Box>
                  
                  {message.type === 'assistant' && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                      <IconButton size="small">
                        <ThumbUp fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ThumbDown fontSize="small" />
                      </IconButton>
                      <IconButton size="small">
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Box>
                  )}
                </Box>
              ))}
              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                  <Paper sx={{ p: 2, backgroundColor: 'grey.100' }}>
                    <Typography variant="body2">AI is thinking...</Typography>
                  </Paper>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Divider />
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  placeholder="Ask me about materials, properties, applications, or standards..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button
                  variant="contained"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  sx={{ minWidth: 60 }}
                >
                  <Send />
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Suggested Questions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Lightbulb sx={{ mr: 1 }} />
                  Suggested Questions
                </Typography>
                <List dense>
                  {suggestedQuestions.map((question, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleSuggestedQuestion(question)}
                      sx={{ borderRadius: 1, mb: 1, backgroundColor: 'grey.50' }}
                    >
                      <ListItemText
                        primary={question}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Science sx={{ mr: 1 }} />
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="outlined" fullWidth href="/search">
                    Advanced Search
                  </Button>
                  <Button variant="outlined" fullWidth href="/standards">
                    Browse Standards
                  </Button>
                  <Button variant="outlined" fullWidth href="/sustainability">
                    Sustainability Report
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tips for Better Results
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 24, height: 24, backgroundColor: 'primary.main' }}>
                        1
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Be specific about your application"
                      secondary="Include operating conditions, environment, and performance requirements"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 24, height: 24, backgroundColor: 'primary.main' }}>
                        2
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Mention priorities"
                      secondary="Tell me if cost, performance, or sustainability is most important"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 24, height: 24, backgroundColor: 'primary.main' }}>
                        3
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Ask follow-up questions"
                      secondary="I can explain material properties, compare options, or simulate behavior"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatInterface;