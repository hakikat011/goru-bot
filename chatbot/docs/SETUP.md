# Gōru Chatbot - Setup Guide

Complete setup instructions for the Gōru Chatbot.

## Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **OpenAI API Key** (get from https://platform.openai.com/api-keys)
- **Git** for version control
- **PostgreSQL** 12+ (for production)
- **Redis** (optional, for caching)

## Step 1: Clone Repository

```bash
git clone https://github.com/goruworld/goru-chatbot.git
cd goru-chatbot
```

## Step 2: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Express.js (web framework)
- OpenAI (AI integration)
- dotenv (environment configuration)
- And more...

## Step 3: Configure Environment

### Copy Example Configuration

```bash
cp .env.example .env
```

### Edit .env File

Open `.env` and configure:

```bash
# Required
OPENAI_API_KEY=sk-your-actual-api-key
OPENAI_MODEL=gpt-4

# Optional (development defaults work)
NODE_ENV=development
PORT=3000
LOG_LEVEL=info

# WordPress (if integrating)
WORDPRESS_URL=https://www.goruworld.com
WORDPRESS_API_KEY=your-key

# Database (optional for development)
DATABASE_URL=postgresql://localhost/goru_chatbot
```

### Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key
4. Paste into `.env` as `OPENAI_API_KEY`

**Important:** Never commit `.env` to version control!

## Step 4: Verify Installation

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version   # Should be 9+

# Check dependencies
npm list
```

## Step 5: Start Development Server

```bash
npm run dev
```

You should see:
```
[timestamp] [INFO] [Server] Gōru Chatbot Server running on port 3000
[timestamp] [INFO] [Server] Environment: development
[timestamp] [INFO] [Server] Knowledge Base Stats: { totalEntries: 17, sources: {...} }
```

## Step 6: Test the Chatbot

### Using curl

```bash
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What products do you offer?",
    "conversationId": "test-conv-1"
  }'
```

### Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3000/api/chat/message`
4. Headers: `Content-Type: application/json`
5. Body:
```json
{
  "message": "What is the Startup Bundle?",
  "conversationId": "test-conv-1"
}
```

### Using JavaScript

```javascript
const response = await fetch('http://localhost:3000/api/chat/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Tell me about your products',
    conversationId: 'test-conv-1'
  })
});

const data = await response.json();
console.log(data);
```

## Step 7: Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Step 8: Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Production Setup

### 1. Environment Configuration

Create `.env.production`:

```bash
NODE_ENV=production
PORT=3000
LOG_LEVEL=warn

OPENAI_API_KEY=sk-prod-key
OPENAI_MODEL=gpt-4

DATABASE_URL=postgresql://prod-user:prod-pass@prod-host:5432/goru_prod
REDIS_URL=redis://prod-redis:6379

WORDPRESS_URL=https://www.goruworld.com
ALLOWED_ORIGINS=https://www.goruworld.com
```

### 2. Database Setup

```bash
# Create PostgreSQL database
createdb goru_chatbot

# Run migrations (when available)
npm run migrate
```

### 3. Build for Production

```bash
npm run build
npm start
```

### 4. Deploy

See `docs/DEPLOYMENT.md` for deployment options:
- AWS EC2
- Heroku
- Docker
- DigitalOcean

## Troubleshooting

### Issue: "Cannot find module 'openai'"

**Solution:**
```bash
npm install
npm install openai
```

### Issue: "OPENAI_API_KEY is not defined"

**Solution:**
1. Check `.env` file exists
2. Verify `OPENAI_API_KEY` is set
3. Restart server: `npm run dev`

### Issue: "Port 3000 already in use"

**Solution:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Issue: "Knowledge base not loading"

**Solution:**
1. Check `knowledge-base/data/` directory exists
2. Verify JSON files are valid
3. Check file permissions
4. Restart server

### Issue: "OpenAI API error"

**Solution:**
1. Verify API key is correct
2. Check API key has credits
3. Verify model name is correct
4. Check rate limits

## Next Steps

1. **Customize Knowledge Base**
   - Edit files in `knowledge-base/data/`
   - Add more FAQs and products
   - Update methodology content

2. **Integrate with WordPress**
   - Copy `src/integrations/wordpress-plugin.php` to WordPress
   - Configure API endpoints
   - Test integration

3. **Deploy to Production**
   - Follow `docs/DEPLOYMENT.md`
   - Set up monitoring
   - Configure backups

4. **Monitor & Optimize**
   - Track analytics
   - Collect user feedback
   - Improve responses

## Support

For help:
- Check `README.md` for overview
- Review `docs/API.md` for API details
- See `TONE_GUIDE.md` for brand voice
- Contact: info@goruworld.com

## Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm test                # Run tests
npm run lint            # Check code quality

# Production
npm start               # Start production server
npm run build           # Build for production

# Utilities
npm run migrate-kb      # Migrate knowledge base
npm run generate-embeddings  # Generate embeddings
npm run setup           # Initial setup
```

---

**Ready to launch? Let's go! 🚀**

