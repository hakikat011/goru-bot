# Gōru Chatbot - Implementation Guide

Complete guide to understanding and implementing the Gōru Chatbot codebase.

## Architecture Overview

The Gōru Chatbot is built with a modular, scalable architecture:

```
User Request
    ↓
Express Server (server.js)
    ↓
API Route Handler
    ↓
Chatbot Engine (chatbot.js)
    ├── Knowledge Base Search (knowledge-base.js)
    ├── Product Recommendation (product-recommender.js)
    └── OpenAI API Call
    ↓
Response Formatter (response-formatter.js)
    ├── Add Brand Voice
    ├── Add Resource Links
    ├── Add Product Suggestions
    └── Add CTAs
    ↓
Formatted Response
    ↓
User
```

## Core Components

### 1. Chatbot Engine (`src/core/chatbot.js`)

**Purpose:** Main orchestrator for processing user messages

**Key Methods:**
- `processMessage(userMessage, conversationId, context)` - Main entry point
- `buildSystemPrompt(shouldRecommendBundle)` - Creates AI system prompt
- `buildMessages(history, userMessage, kbResults)` - Prepares messages for OpenAI
- `getConversationHistory(conversationId)` - Retrieves conversation context

**Flow:**
1. Validates user input
2. Retrieves conversation history
3. Searches knowledge base
4. Checks if bundle recommendation is appropriate
5. Calls OpenAI API with context
6. Formats and returns response

### 2. Knowledge Base (`src/core/knowledge-base.js`)

**Purpose:** Manages knowledge base queries and semantic search

**Key Methods:**
- `search(query, limit)` - Semantic search of KB
- `calculateRelevance(query, entry)` - Scores relevance
- `getProduct(productId)` - Retrieves product info
- `getFAQs(category)` - Gets FAQ entries
- `getMethodology(topic)` - Gets methodology info

**Data Sources:**
- `products.json` - Product catalog
- `faqs.json` - FAQ entries
- `methodology.json` - Startup Lifecycle & 52 Risks
- `resources.json` - Links and references

### 3. Response Formatter (`src/core/response-formatter.js`)

**Purpose:** Formats responses with brand voice and resources

**Key Methods:**
- `format(aiResponse, kbResults, shouldRecommendBundle)` - Main formatter
- `addResourceLinks(text, resources)` - Adds KB links
- `generateBundleSuggestion()` - Creates bundle suggestion
- `addProductSuggestion(text, suggestion)` - Adds product CTA
- `generateEscalationMessage()` - Creates escalation message

**Features:**
- Maintains Gōru brand voice
- Adds relevant resource links
- Includes product recommendations
- Adds clear CTAs
- Ensures proper formatting

### 4. Product Recommender (`src/core/product-recommender.js`)

**Purpose:** Intelligently recommends products

**Key Methods:**
- `shouldRecommend(userMessage, kbResults)` - Determines if bundle should be recommended
- `getRecommendedProducts(userMessage)` - Gets specific product recommendations
- `generateBundleComparison(selectedProducts)` - Compares bundle vs individual
- `getNextRecommendation(currentProduct)` - Suggests next product

**Recommendation Logic:**
- Analyzes user message for trigger keywords
- Checks KB results for relevance
- Detects multiple product mentions
- Avoids recommendations when explicitly declined

## Brand Voice Implementation

### Tone Guidelines

The chatbot maintains Gōru's voice through:

1. **System Prompt** - Defines tone in OpenAI instructions
2. **Response Templates** - Pre-formatted response patterns
3. **Tone Markers** - Encouraging language and CTAs
4. **Resource Linking** - Provides actionable next steps

### Example Response Flow

```
User: "I'm starting a new business. Where do I begin?"

1. Knowledge Base Search
   → Finds: Startup Lifecycle, Business Plan template, Bundle

2. Product Recommendation Check
   → Trigger: "starting", "where do I begin"
   → Decision: Recommend Bundle = YES

3. OpenAI Processing
   → System Prompt: Include bundle recommendation guidance
   → Context: KB results + conversation history
   → Response: Encouraging, practical advice

4. Response Formatting
   → Add: Resource links to templates
   → Add: Bundle suggestion with price and benefits
   → Add: CTA to shop page
   → Result: Complete, branded response
```

## API Endpoints

### Chat Endpoints

**POST /api/chat/message**
- Sends user message to chatbot
- Returns formatted response with resources
- Maintains conversation context

**GET /api/chat/history/:conversationId**
- Retrieves conversation history
- Returns messages and statistics

**POST /api/chat/feedback**
- Collects user satisfaction feedback
- Stores for analytics

### Knowledge Base Endpoints

**GET /api/kb/search**
- Searches knowledge base
- Returns relevant entries with scores

**GET /api/kb/products**
- Returns all products
- Useful for product listings

**GET /api/kb/faqs**
- Returns FAQs by category
- Supports filtering

## Configuration

### Environment Variables

**Critical:**
- `OPENAI_API_KEY` - Required for AI functionality
- `OPENAI_MODEL` - Model selection (gpt-4 recommended)

**Integration:**
- `WORDPRESS_URL` - WordPress site URL
- `WORDPRESS_API_KEY` - WordPress authentication

**Database:**
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis cache connection

**Behavior:**
- `LOG_LEVEL` - Logging verbosity
- `MAX_CONTEXT_MESSAGES` - Conversation history size
- `RESPONSE_TIMEOUT` - API timeout

## Knowledge Base Structure

### Product Entry Format

```json
{
  "id": "unique-id",
  "type": "bundle|product|template",
  "category": "products",
  "title": "Display Title",
  "name": "Short Name",
  "description": "Brief description",
  "price": "$104.55 AUD",
  "keywords": ["keyword1", "keyword2"],
  "links": ["https://example.com"],
  "source": "products.json"
}
```

### FAQ Entry Format

```json
{
  "id": "faq-001",
  "category": "products",
  "question": "What's included?",
  "answer": "Detailed answer...",
  "keywords": ["keyword1", "keyword2"],
  "relatedResources": [
    {
      "title": "Resource Title",
      "url": "https://example.com"
    }
  ],
  "source": "faqs.json"
}
```

## Extending the Chatbot

### Adding New Products

1. Edit `knowledge-base/data/products.json`
2. Add product entry with all fields
3. Include relevant keywords
4. Add shop links
5. Restart server

### Adding New FAQs

1. Edit `knowledge-base/data/faqs.json`
2. Add FAQ entry with question/answer
3. Include keywords for search
4. Add related resources
5. Restart server

### Customizing Tone

1. Edit `TONE_GUIDE.md` for guidelines
2. Update system prompt in `chatbot.js`
3. Modify response templates in `response-formatter.js`
4. Test responses thoroughly

### Adding New Features

1. Create new module in `src/core/`
2. Implement required methods
3. Integrate with chatbot engine
4. Add tests in `tests/`
5. Update documentation

## Testing

### Unit Tests

Test individual components:
```bash
npm run test:unit
```

### Integration Tests

Test component interactions:
```bash
npm run test:integration
```

### Manual Testing

Use curl or Postman to test endpoints:
```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Test", "conversationId": "test-1"}'
```

## Performance Optimization

### Caching

- Use Redis for KB caching
- Cache conversation history
- Cache product recommendations

### Database

- Index frequently searched fields
- Optimize query performance
- Use connection pooling

### API Calls

- Batch requests where possible
- Implement rate limiting
- Use response caching

## Monitoring & Analytics

### Metrics to Track

- Response time
- User satisfaction
- Deflection rate
- Escalation rate
- Product recommendations
- Conversation length

### Logging

- All API calls logged
- Errors captured with context
- Performance metrics tracked
- User interactions recorded

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Knowledge base loaded
- [ ] Tests passing
- [ ] Code linted and formatted
- [ ] Security review completed
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Documentation updated
- [ ] Team trained

## Troubleshooting

### Common Issues

**Slow Responses**
- Check OpenAI API status
- Verify network connectivity
- Review KB size
- Check database performance

**Inaccurate Recommendations**
- Review trigger keywords
- Check KB relevance scores
- Analyze user queries
- Adjust recommendation logic

**Missing Resources**
- Verify KB files loaded
- Check file permissions
- Validate JSON format
- Restart server

## Next Steps

1. Deploy to staging
2. Conduct user testing
3. Gather feedback
4. Optimize based on metrics
5. Deploy to production
6. Monitor performance
7. Iterate and improve

---

**For detailed API documentation, see `docs/API.md`**  
**For brand voice guidelines, see `TONE_GUIDE.md`**  
**For setup instructions, see `docs/SETUP.md`**

