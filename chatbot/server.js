/**
 * Gōru Chatbot Server
 * Main Express server for the chatbot API
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Logger = require('./src/utils/logger');
const GoruChatbot = require('./src/core/chatbot');

// Initialize
const app = express();
const logger = new Logger('Server');
const chatbot = new GoruChatbot({
  openaiApiKey: process.env.OPENAI_API_KEY,
  model: process.env.OPENAI_MODEL || 'gpt-4',
  kbPath: './knowledge-base/data',
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Chat endpoint
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;

    // Validate input
    if (!message || !conversationId) {
      return res.status(400).json({
        error: 'Missing required fields: message, conversationId',
      });
    }

    // Process message
    const response = await chatbot.processMessage(
      message,
      conversationId,
      context || {}
    );

    if (response.error) {
      return res.status(500).json(response);
    }

    res.json(response);
  } catch (error) {
    logger.error(`Error in /api/chat/message: ${error.message}`);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message,
    });
  }
});

// Get conversation history
app.get('/api/chat/history/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const history = chatbot.getConversationHistory(conversationId);
    const stats = chatbot.getConversationStats(conversationId);

    res.json({
      conversationId,
      messages: history,
      stats,
    });
  } catch (error) {
    logger.error(`Error in /api/chat/history: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// Submit feedback
app.post('/api/chat/feedback', (req, res) => {
  try {
    const { conversationId, messageId, rating, comment } = req.body;

    // In production, save to database
    logger.info(`Feedback received: ${conversationId} - Rating: ${rating}`);

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
    });
  } catch (error) {
    logger.error(`Error in /api/chat/feedback: ${error.message}`);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Knowledge base search endpoint
app.get('/api/kb/search', async (req, res) => {
  try {
    const { query, limit } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const results = await chatbot.knowledgeBase.search(query, parseInt(limit) || 5);

    res.json({
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    logger.error(`Error in /api/kb/search: ${error.message}`);
    res.status(500).json({ error: 'Failed to search knowledge base' });
  }
});

// Get products
app.get('/api/kb/products', (req, res) => {
  try {
    const products = chatbot.knowledgeBase.getAllProducts();
    res.json({
      products,
      count: products.length,
    });
  } catch (error) {
    logger.error(`Error in /api/kb/products: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Get FAQs
app.get('/api/kb/faqs', (req, res) => {
  try {
    const { category } = req.query;
    const faqs = chatbot.knowledgeBase.getFAQs(category);

    res.json({
      faqs,
      count: faqs.length,
      category: category || 'all',
    });
  } catch (error) {
    logger.error(`Error in /api/kb/faqs: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve FAQs' });
  }
});

// Get KB statistics
app.get('/api/kb/stats', (req, res) => {
  try {
    const stats = chatbot.knowledgeBase.getStats();
    res.json(stats);
  } catch (error) {
    logger.error(`Error in /api/kb/stats: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
});

// Clear conversation
app.delete('/api/chat/history/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    chatbot.clearConversationHistory(conversationId);

    res.json({
      success: true,
      message: 'Conversation history cleared',
    });
  } catch (error) {
    logger.error(`Error clearing history: ${error.message}`);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Gōru Chatbot Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Knowledge Base Stats:`, chatbot.knowledgeBase.getStats());
});

module.exports = app;

