# Gōru Chatbot

AI-powered startup guidance chatbot with WordPress integration, built with Node.js and OpenAI API.

## Overview

The Gōru Chatbot is an intelligent conversational AI designed to help founders navigate their startup journey. It provides:

- **Expert Guidance** - Answers questions about Gōru products and startup methodology
- **Smart Recommendations** - Suggests the Startup Bundle when appropriate
- **Resource Links** - Provides relevant links and references
- **Brand Voice** - Maintains Gōru's encouraging, practical, expert-guided tone
- **Conversation Context** - Remembers conversation history for better responses

## Features

✅ Natural language understanding with OpenAI GPT-4  
✅ Semantic search of knowledge base  
✅ Intelligent product recommendations  
✅ Brand voice consistency  
✅ Resource linking and CTAs  
✅ Conversation history management  
✅ User feedback collection  
✅ Analytics tracking  
✅ Human escalation support  
✅ WordPress integration ready  

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+
- OpenAI API key
- PostgreSQL (optional, for production)
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/goruworld/goru-chatbot.git
   cd goru-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### Chat Endpoints

**Send Message**
```
POST /api/chat/message
Content-Type: application/json

{
  "message": "What products do you offer?",
  "conversationId": "conv-123",
  "context": {
    "userId": "user-123",
    "userType": "founder"
  }
}
```

**Get Conversation History**
```
GET /api/chat/history/:conversationId
```

**Submit Feedback**
```
POST /api/chat/feedback
Content-Type: application/json

{
  "conversationId": "conv-123",
  "messageId": "msg-456",
  "rating": 4.5,
  "comment": "Very helpful!"
}
```

### Knowledge Base Endpoints

**Search Knowledge Base**
```
GET /api/kb/search?query=business+plan&limit=5
```

**Get All Products**
```
GET /api/kb/products
```

**Get FAQs**
```
GET /api/kb/faqs?category=products
```

**Get Statistics**
```
GET /api/kb/stats
```

## Project Structure

```
chatbot/
├── src/
│   ├── core/
│   │   ├── chatbot.js              # Main chatbot engine
│   │   ├── knowledge-base.js       # KB query system
│   │   ├── response-formatter.js   # Response formatting
│   │   └── product-recommender.js  # Product recommendations
│   ├── utils/
│   │   └── logger.js               # Logging utility
│   └── integrations/
│       └── wordpress-plugin.php    # WordPress integration
├── knowledge-base/
│   └── data/
│       ├── products.json           # Product data
│       ├── faqs.json               # FAQ data
│       └── methodology.json        # Methodology data
├── tests/
│   ├── unit/
│   └── integration/
├── docs/
│   ├── API.md
│   ├── TONE_GUIDE.md
│   └── SETUP.md
├── package.json
├── server.js
└── README.md
```

## Configuration

### Environment Variables

Key environment variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - Model to use (default: gpt-4)
- `WORDPRESS_URL` - WordPress site URL
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `LOG_LEVEL` - Logging level (error, warn, info, debug)

See `.env.example` for all available options.

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Brand Voice

The chatbot maintains Gōru's brand voice:

- **Encouraging & Supportive** - Celebrates founder progress
- **Practical & Action-Oriented** - Provides specific steps
- **Expert-Guided** - References Gōru methodology
- **Startup-Focused** - Relevant to founder challenges

See `TONE_GUIDE.md` for detailed guidelines.

## Knowledge Base

The knowledge base includes:

- **Products** - All Gōru offerings with pricing
- **FAQs** - Common questions and answers
- **Methodology** - Startup Lifecycle and 52 Risks
- **Resources** - Links and references

Update knowledge base files in `knowledge-base/data/` to keep content current.

## Product Recommendations

The chatbot intelligently recommends the Startup Bundle when:

- User asks about getting started
- User needs multiple tools
- User asks about comprehensive guidance
- User mentions multiple products

See `src/core/product-recommender.js` for logic.

## Deployment

### Docker

```bash
docker build -t goru-chatbot .
docker run -p 3000:3000 --env-file .env goru-chatbot
```

### AWS

See `docs/DEPLOYMENT.md` for AWS deployment guide.

### WordPress Integration

The chatbot integrates with WordPress via:

1. REST API endpoints
2. Custom WordPress plugin
3. Embedded chat widget

See `src/integrations/wordpress-plugin.php` for details.

## Monitoring & Analytics

The chatbot tracks:

- Conversation metrics
- User satisfaction
- Response accuracy
- Product recommendations
- Escalation rates

Access analytics via `/api/admin/analytics`

## Support

For issues or questions:

- 📧 Email: info@goruworld.com
- 📞 Phone: +61 402 222 193
- 🌐 Website: https://www.goruworld.com

## License

MIT License - See LICENSE file for details

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Changelog

### Version 1.0.0 (Initial Release)
- Core chatbot engine
- Knowledge base integration
- Product recommendations
- Brand voice consistency
- API endpoints
- WordPress integration ready

---

**Built with ❤️ by the Gōru Team**

Unleash Your Potential! 🚀

