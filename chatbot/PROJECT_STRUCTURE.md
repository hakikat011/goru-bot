# Gōru Chatbot - Project Structure

## Overview
This document outlines the complete project structure for the Gōru Chatbot implementation using a custom Node.js + OpenAI API solution with WordPress integration.

---

## Directory Structure

```
goru-chatbot/
├── src/
│   ├── core/
│   │   ├── chatbot.js              # Main chatbot engine
│   │   ├── knowledge-base.js       # Knowledge base query system
│   │   ├── response-formatter.js   # Response formatting with tone
│   │   └── product-recommender.js  # Bundle recommendation logic
│   ├── integrations/
│   │   ├── wordpress-plugin.php    # WordPress plugin wrapper
│   │   ├── wordpress-api.js        # WordPress REST API integration
│   │   └── woocommerce-api.js      # WooCommerce integration
│   ├── utils/
│   │   ├── logger.js               # Logging utility
│   │   ├── config.js               # Configuration management
│   │   └── validators.js           # Input validation
│   ├── templates/
│   │   ├── response-templates.js   # Response templates
│   │   ├── tone-guidelines.js      # Brand voice guidelines
│   │   └── product-suggestions.js  # Product recommendation templates
│   └── api/
│       ├── routes.js               # API endpoints
│       ├── middleware.js           # Express middleware
│       └── controllers.js          # Request handlers
├── knowledge-base/
│   ├── data/
│   │   ├── products.json           # Product data
│   │   ├── faqs.json               # FAQ data
│   │   ├── methodology.json        # Startup Lifecycle & 52 Risks
│   │   └── resources.json          # Links and resources
│   └── embeddings/
│       └── kb-embeddings.json      # Pre-computed embeddings
├── tests/
│   ├── unit/
│   │   ├── chatbot.test.js
│   │   ├── knowledge-base.test.js
│   │   └── response-formatter.test.js
│   ├── integration/
│   │   ├── wordpress-integration.test.js
│   │   └── api-integration.test.js
│   └── fixtures/
│       └── test-data.json
├── config/
│   ├── development.env
│   ├── production.env
│   ├── openai-config.js
│   └── wordpress-config.js
├── docs/
│   ├── API.md                      # API documentation
│   ├── TONE_GUIDE.md               # Brand voice guide
│   ├── SETUP.md                    # Setup instructions
│   └── DEPLOYMENT.md               # Deployment guide
├── scripts/
│   ├── setup.js                    # Initial setup script
│   ├── migrate-kb.js               # Knowledge base migration
│   └── generate-embeddings.js      # Embedding generation
├── package.json
├── .env.example
├── .gitignore
├── README.md
└── server.js                       # Main server entry point
```

---

## Technology Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **AI/NLP:** OpenAI API (GPT-4 or GPT-3.5-turbo)
- **Database:** PostgreSQL (for conversation history)
- **Cache:** Redis (for performance)

### Frontend Integration
- **WordPress Plugin:** Custom PHP plugin
- **Widget:** React component (embedded in WordPress)
- **API Communication:** REST API

### DevOps
- **Hosting:** AWS EC2 or Azure VM
- **Database:** AWS RDS PostgreSQL
- **Cache:** AWS ElastiCache Redis
- **Monitoring:** CloudWatch + Datadog
- **CI/CD:** GitHub Actions

### Development Tools
- **Package Manager:** npm
- **Testing:** Jest + Supertest
- **Linting:** ESLint
- **Code Formatting:** Prettier
- **Version Control:** Git

---

## Core Components

### 1. Chatbot Engine (chatbot.js)
- Processes user queries
- Manages conversation context
- Integrates with OpenAI API
- Handles multi-turn conversations

### 2. Knowledge Base (knowledge-base.js)
- Queries structured knowledge base
- Performs semantic search
- Returns relevant information
- Manages embeddings

### 3. Response Formatter (response-formatter.js)
- Applies Gōru brand voice
- Adds resource links
- Includes product recommendations
- Formats with CTAs

### 4. Product Recommender (product-recommender.js)
- Analyzes user queries
- Suggests Startup Bundle when appropriate
- Provides comparison information
- Generates purchase links

### 5. WordPress Integration (wordpress-plugin.php)
- Registers chatbot widget
- Handles authentication
- Manages user data
- Integrates with WooCommerce

---

## Data Structure

### Knowledge Base Format (JSON)
```json
{
  "id": "unique-id",
  "category": "products",
  "title": "Product Title",
  "content": "Detailed content",
  "keywords": ["keyword1", "keyword2"],
  "links": ["https://example.com"],
  "embedding": [0.123, 0.456, ...],
  "metadata": {
    "source": "file-name",
    "updated": "2024-10-16",
    "relevance": "high"
  }
}
```

### Conversation History Format
```json
{
  "conversation_id": "uuid",
  "user_id": "user-uuid",
  "messages": [
    {
      "role": "user",
      "content": "User message",
      "timestamp": "2024-10-16T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Bot response",
      "timestamp": "2024-10-16T10:00:05Z",
      "sources": ["kb-id-1", "kb-id-2"]
    }
  ],
  "metadata": {
    "satisfaction": 4.5,
    "escalated": false,
    "duration": 300
  }
}
```

---

## API Endpoints

### Chat Endpoints
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history/:conversationId` - Get conversation history
- `POST /api/chat/feedback` - Submit user feedback

### Knowledge Base Endpoints
- `GET /api/kb/search` - Search knowledge base
- `GET /api/kb/products` - Get product information
- `GET /api/kb/faqs` - Get FAQs

### Admin Endpoints
- `POST /api/admin/kb/update` - Update knowledge base
- `GET /api/admin/analytics` - Get analytics
- `POST /api/admin/escalate` - Escalate to human

---

## Configuration

### Environment Variables
```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4
WORDPRESS_URL=https://goruworld.com
WORDPRESS_API_KEY=...
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
NODE_ENV=production
LOG_LEVEL=info
```

---

## Development Workflow

1. **Setup:** Run `npm install` and configure `.env`
2. **Development:** Run `npm run dev` for hot reload
3. **Testing:** Run `npm test` for unit and integration tests
4. **Build:** Run `npm run build` for production
5. **Deploy:** Use CI/CD pipeline for deployment

---

## Key Features

✅ Natural language understanding  
✅ Semantic search with embeddings  
✅ Brand voice consistency  
✅ Product recommendations  
✅ Resource linking  
✅ Conversation history  
✅ User feedback collection  
✅ Analytics tracking  
✅ Human escalation  
✅ WordPress integration  

---

## Next Steps

1. Initialize Node.js project
2. Install dependencies
3. Create core modules
4. Build knowledge base system
5. Implement response formatting
6. Create WordPress plugin
7. Set up testing
8. Deploy to staging

