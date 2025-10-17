/**
 * Gōru Chatbot Engine
 * Main chatbot logic for processing user queries and generating responses
 */

const OpenAI = require('openai');
const KnowledgeBase = require('./knowledge-base');
const ResponseFormatter = require('./response-formatter');
const ProductRecommender = require('./product-recommender');
const Logger = require('../utils/logger');

class GoruChatbot {
  constructor(config = {}) {
    this.openai = new OpenAI({
      apiKey: config.openaiApiKey || process.env.OPENAI_API_KEY,
    });

    this.model = config.model || process.env.OPENAI_MODEL || 'gpt-4';
    this.knowledgeBase = new KnowledgeBase(config.kbPath);
    this.responseFormatter = new ResponseFormatter();
    this.productRecommender = new ProductRecommender();
    this.logger = new Logger('GoruChatbot');

    // Conversation context storage (in production, use database)
    this.conversationHistory = new Map();
    this.maxContextMessages = 10;
  }

  /**
   * Process user message and generate response
   * @param {string} userMessage - User's input message
   * @param {string} conversationId - Unique conversation identifier
   * @param {object} context - Additional context (user info, etc.)
   * @returns {Promise<object>} - Response object with message and metadata
   */
  async processMessage(userMessage, conversationId, context = {}) {
    try {
      this.logger.info(`Processing message for conversation: ${conversationId}`);

      // Validate input
      if (!userMessage || userMessage.trim().length === 0) {
        return this.createErrorResponse('Please provide a message.');
      }

      // Get or create conversation history
      const history = this.getConversationHistory(conversationId);

      // Search knowledge base for relevant information
      const kbResults = await this.knowledgeBase.search(userMessage);
      this.logger.debug(`Found ${kbResults.length} KB results`);

      // Check if product recommendation is appropriate
      const shouldRecommendBundle = this.productRecommender.shouldRecommend(
        userMessage,
        kbResults
      );

      // Build system prompt with brand voice guidelines
      const systemPrompt = this.buildSystemPrompt(shouldRecommendBundle);

      // Build messages for OpenAI
      const messages = this.buildMessages(
        history,
        userMessage,
        kbResults,
        shouldRecommendBundle
      );

      // Call OpenAI API
      const aiResponse = await this.openai.chat.completions.create({
        model: this.model,
        messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
      });

      const assistantMessage = aiResponse.choices[0].message.content;

      // Format response with brand voice and resources
      const formattedResponse = await this.responseFormatter.format(
        assistantMessage,
        kbResults,
        shouldRecommendBundle
      );

      // Update conversation history
      this.updateConversationHistory(conversationId, userMessage, formattedResponse);

      // Prepare response object
      const response = {
        id: this.generateMessageId(),
        conversationId,
        message: formattedResponse.text,
        resources: formattedResponse.resources,
        productSuggestion: formattedResponse.productSuggestion,
        sources: kbResults.map((r) => r.id),
        timestamp: new Date().toISOString(),
        metadata: {
          model: this.model,
          tokensUsed: aiResponse.usage.total_tokens,
          kbResultsCount: kbResults.length,
          bundleRecommended: shouldRecommendBundle,
        },
      };

      this.logger.info(`Response generated successfully`);
      return response;
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`);
      return this.createErrorResponse(
        'I encountered an issue processing your request. Please try again or contact support.'
      );
    }
  }

  /**
   * Build system prompt with brand voice guidelines
   * @param {boolean} shouldRecommendBundle - Whether to include bundle recommendation guidance
   * @returns {string} - System prompt
   */
  buildSystemPrompt(shouldRecommendBundle = false) {
    let prompt = `You are Gōru, a helpful and expert chatbot for a startup guidance platform.

Your tone should be:
- Encouraging and supportive of founders
- Practical and action-oriented
- Expert-guided with credible references
- Startup-focused and relevant

Guidelines:
1. Be concise but thorough (2-3 paragraphs max)
2. Use active voice and clear language
3. Provide specific, actionable steps
4. Reference Gōru's methodology when relevant
5. Include relevant links and resources
6. Maintain a professional yet approachable tone
7. Avoid jargon or explain it clearly
8. Never provide financial or legal advice

When referencing Gōru resources:
- Mention the Startup Toolkit eBook (120 pages, full color)
- Reference the 52 Risks framework (Strategic, Financial, Operational)
- Suggest relevant templates (Business Plan, Pitch Deck, Cash Flow, etc.)
- Link to https://www.goruworld.com/shop/ for purchases`;

    if (shouldRecommendBundle) {
      prompt += `

IMPORTANT: The user's question suggests they would benefit from the Startup Bundle.
When appropriate, recommend it as a comprehensive solution that includes:
- Startup Toolkit eBook
- Business Plan Template
- Pitch Deck Template
- Cash Flow Forecast Template
- Project Plan Template
- Task List Template

Price: $104.55 AUD (includes GST)`;
    }

    return prompt;
  }

  /**
   * Build messages array for OpenAI API
   * @param {array} history - Conversation history
   * @param {string} userMessage - Current user message
   * @param {array} kbResults - Knowledge base search results
   * @param {boolean} shouldRecommendBundle - Whether to include bundle context
   * @returns {array} - Messages for OpenAI
   */
  buildMessages(history, userMessage, kbResults, shouldRecommendBundle) {
    const messages = [];

    // Add system message
    messages.push({
      role: 'system',
      content: this.buildSystemPrompt(shouldRecommendBundle),
    });

    // Add conversation history (limited to maxContextMessages)
    const recentHistory = history.slice(-this.maxContextMessages);
    recentHistory.forEach((msg) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      });
    });

    // Add knowledge base context
    if (kbResults.length > 0) {
      const kbContext = this.formatKBContext(kbResults);
      messages.push({
        role: 'system',
        content: `Relevant information from Gōru knowledge base:\n\n${kbContext}`,
      });
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    return messages;
  }

  /**
   * Format knowledge base results for context
   * @param {array} kbResults - KB search results
   * @returns {string} - Formatted context
   */
  formatKBContext(kbResults) {
    return kbResults
      .slice(0, 5) // Limit to top 5 results
      .map(
        (result, index) =>
          `[${index + 1}] ${result.title}\n${result.content}\nSource: ${result.source}`
      )
      .join('\n\n');
  }

  /**
   * Get conversation history
   * @param {string} conversationId - Conversation ID
   * @returns {array} - Message history
   */
  getConversationHistory(conversationId) {
    if (!this.conversationHistory.has(conversationId)) {
      this.conversationHistory.set(conversationId, []);
    }
    return this.conversationHistory.get(conversationId);
  }

  /**
   * Update conversation history
   * @param {string} conversationId - Conversation ID
   * @param {string} userMessage - User message
   * @param {object} response - Bot response
   */
  updateConversationHistory(conversationId, userMessage, response) {
    const history = this.getConversationHistory(conversationId);

    history.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    });

    history.push({
      role: 'assistant',
      content: response.text,
      timestamp: new Date().toISOString(),
    });

    // Keep history size manageable
    if (history.length > this.maxContextMessages * 2) {
      history.splice(0, 2);
    }
  }

  /**
   * Generate unique message ID
   * @returns {string} - Message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create error response
   * @param {string} message - Error message
   * @returns {object} - Error response object
   */
  createErrorResponse(message) {
    return {
      id: this.generateMessageId(),
      message,
      error: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Clear conversation history
   * @param {string} conversationId - Conversation ID to clear
   */
  clearConversationHistory(conversationId) {
    this.conversationHistory.delete(conversationId);
    this.logger.info(`Cleared history for conversation: ${conversationId}`);
  }

  /**
   * Get conversation statistics
   * @param {string} conversationId - Conversation ID
   * @returns {object} - Statistics
   */
  getConversationStats(conversationId) {
    const history = this.getConversationHistory(conversationId);
    return {
      messageCount: history.length,
      userMessages: history.filter((m) => m.role === 'user').length,
      assistantMessages: history.filter((m) => m.role === 'assistant').length,
      duration: history.length > 0 ? new Date() - new Date(history[0].timestamp) : 0,
    };
  }
}

module.exports = GoruChatbot;

