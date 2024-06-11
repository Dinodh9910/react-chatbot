// src/Chatbot.jsx
import React, { useState, useEffect } from 'react';
import nlp from 'compromise';
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BotAvatar from './assets/chat-bot.png';  // Ensure this image exists in the src directory
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        nlp.plugin({
            words: {
                hello: 'Greeting',
                hi: 'Greeting',
                hey: 'Greeting',
                bye: 'Exit',
                goodbye: 'Exit',
                weather: 'Weather',
                news: 'News',
                joke: 'Joke',
            },
        });
    }, []);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const newMessages = [...messages, { text: input, user: true }];
        setMessages(newMessages);
        setInput('');

        setIsTyping(true);

        // Simulate chatbot response
        setTimeout(async () => {
            const botResponse = await getBotResponse(input);
            setMessages([...newMessages, { text: botResponse, user: false }]);
            setIsTyping(false);
        }, 1000);
    };

    const getBotResponse = async (input) => {
        const doc = nlp(input);
        const intent = doc.match('#Greeting').out('text');
        const exit = doc.match('#Exit').out('text');
        const weather = doc.match('#Weather').out('text');
        const news = doc.match('#News').out('text');
        const joke = doc.match('#Joke').out('text');

        if (intent) return 'Hello! How can I assist you today?';
        if (exit) return 'Goodbye! Have a great day!';
        if (weather) return 'The weather is sunny with a chance of rain later in the afternoon.';
        if (news) return 'Today’s top news: AI is revolutionizing the tech industry!';
        if (joke) {
            const jokeResponse = await fetch('https://official-joke-api.appspot.com/jokes/random');
            const jokeData = await jokeResponse.json();
            return `${jokeData.setup} - ${jokeData.punchline}`;
        }

        return 'I am a simple chatbot. Try asking about the weather, news, or a joke.';
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ padding: 2, marginTop: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Chatbot
                </Typography>
                <Box sx={{ maxHeight: '400px', overflowY: 'auto', padding: 2, marginBottom: 2 }}>
                    {messages.map((msg, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.user ? 'flex-end' : 'flex-start',
                                marginBottom: 1,
                            }}
                        >
                            {!msg.user && (
                                <Avatar alt="Bot" src={BotAvatar} sx={{ marginRight: 1 }} />
                            )}
                            <Box
                                sx={{
                                    backgroundColor: msg.user ? '#1976d2' : '#e0e0e0',
                                    color: msg.user ? 'white' : 'black',
                                    padding: 1,
                                    borderRadius: 2,
                                    maxWidth: '70%',
                                }}
                            >
                                {msg.text}
                            </Box>
                        </Box>
                    ))}
                    {isTyping && (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Avatar alt="Bot" src={BotAvatar} sx={{ marginRight: 1 }} />
                            <CircularProgress size={24} />
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message"
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSend}
                        sx={{ marginLeft: 1 }}
                        endIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Chatbot;
