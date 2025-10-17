/**
 * Gōru Response Formatter
 * Formats chatbot responses with brand voice, links, and CTAs
 */

const Logger = require('../utils/logger');

class ResponseFormatter {
  constructor() {
    this.logger = new Logger('ResponseFormatter');
    this.shopUrl = 'https://www.goruworld.com/shop/';
    this.contactEmail = 'info@goruworld.com';
    this.contactPhone = '+61 402 222 193';
  }

  /**
   * Format response with brand voice and resources
   * @param {string} aiResponse - Raw AI response
   * @param {array} kbResults - Knowledge base results
   * @param {boolean} shouldRecommendBundle - Whether to recommend bundle
   * @returns {Promise<object>} - Formatted response object
   */
  async format(aiResponse, kbResults = [], shouldRecommendBundle = false) {
    try {
      let formattedText = aiResponse;

      // Add resource links
      const resources = this.extractResources(kbResults);
      if (resources.length > 0) {
        formattedText = this.addResourceLinks(formattedText, resources);
      }

      // Add product suggestion if appropriate
      let productSuggestion = null;
      if (shouldRecommendBundle) {
        productSuggestion = this.generateBundleSuggestion();
        formattedText = this.addProductSuggestion(formattedText, productSuggestion);
      }

      // Ensure proper formatting
      formattedText = this.ensureProperFormatting(formattedText);

      // Add CTA if not already present
      if (!formattedText.includes('→')) {
        formattedText = this.addDefaultCTA(formattedText);
      }

      return {
        text: formattedText,
        resources,
        productSuggestion,
      };
    } catch (error) {
      this.logger.error(`Error formatting response: ${error.message}`);
      return {
        text: aiResponse,
        resources: [],
        productSuggestion: null,
      };
    }
  }

  /**
   * Extract resources from KB results
   * @param {array} kbResults - KB search results
   * @returns {array} - Extracted resources
   */
  extractResources(kbResults) {
    const resources = [];

    kbResults.forEach((result) => {
      if (result.links && Array.isArray(result.links)) {
        result.links.forEach((link) => {
          resources.push({
            title: result.title,
            url: link,
            source: result.source,
          });
        });
      }

      // Add shop link for products
      if (result.type === 'product' || result.category === 'products') {
        resources.push({
          title: `${result.title} - Shop`,
          url: this.shopUrl,
          source: 'shop',
        });
      }
    });

    // Remove duplicates
    return Array.from(new Map(resources.map((r) => [r.url, r])).values());
  }

  /**
   * Add resource links to response
   * @param {string} text - Response text
   * @param {array} resources - Resources to add
   * @returns {string} - Text with resource links
   */
  addResourceLinks(text, resources) {
    if (resources.length === 0) return text;

    let resourceSection = '\n\n**Helpful Resources:**\n';
    resources.slice(0, 3).forEach((resource, index) => {
      resourceSection += `${index + 1}. [${resource.title}](${resource.url})\n`;
    });

    return text + resourceSection;
  }

  /**
   * Generate bundle suggestion
   * @returns {object} - Bundle suggestion
   */
  generateBundleSuggestion() {
    return {
      title: 'Startup Bundle',
      description:
        'Get everything you need to launch your startup with confidence',
      price: '$104.55 AUD',
      includes: [
        'Startup Toolkit eBook (120 pages)',
        'Business Plan Template',
        'Pitch Deck Template',
        'Cash Flow Forecast',
        'Project Plan (Gantt Chart)',
        'Task List',
      ],
      url: this.shopUrl,
      cta: 'Explore the Bundle',
    };
  }

  /**
   * Add product suggestion to response
   * @param {string} text - Response text
   * @param {object} suggestion - Product suggestion
   * @returns {string} - Text with suggestion
   */
  addProductSuggestion(text, suggestion) {
    const suggestionText = `

---

**💡 Perfect for Your Needs: ${suggestion.title}**

${suggestion.description}

**Includes:**
${suggestion.includes.map((item) => `• ${item}`).join('\n')}

**Price:** ${suggestion.price}

→ [${suggestion.cta}](${suggestion.url})`;

    return text + suggestionText;
  }

  /**
   * Add default CTA to response
   * @param {string} text - Response text
   * @returns {string} - Text with CTA
   */
  addDefaultCTA(text) {
    const ctas = [
      `\n\n→ [Learn More](${this.shopUrl})`,
      `\n\n→ [Get Started](${this.shopUrl})`,
      `\n\n→ [Explore Resources](${this.shopUrl})`,
      `\n\n→ [Contact Us](mailto:${this.contactEmail})`,
    ];

    // Select random CTA for variety
    return text + ctas[Math.floor(Math.random() * ctas.length)];
  }

  /**
   * Ensure proper formatting
   * @param {string} text - Response text
   * @returns {string} - Properly formatted text
   */
  ensureProperFormatting(text) {
    // Fix common formatting issues
    text = text.replace(/\n{3,}/g, '\n\n'); // Remove excessive line breaks
    text = text.replace(/\*\*\*/g, '**'); // Fix triple asterisks
    text = text.replace(/\*\*/g, '**'); // Normalize bold
    text = text.trim();

    return text;
  }

  /**
   * Generate escalation message
   * @param {string} reason - Reason for escalation
   * @returns {string} - Escalation message
   */
  generateEscalationMessage(reason = 'personalized assistance') {
    return `I want to make sure you get the best answer to this question. Let me connect you with our support team who can provide ${reason}.

**Contact Information:**
📧 Email: ${this.contactEmail}
📞 Phone: ${this.contactPhone}

In the meantime, you might find our [Startup Toolkit](${this.shopUrl}) helpful!`;
  }

  /**
   * Generate error message
   * @param {string} context - Error context
   * @returns {string} - Error message
   */
  generateErrorMessage(context = 'processing your request') {
    return `I encountered an issue ${context}. Please try again or contact our support team:

📧 Email: ${this.contactEmail}
📞 Phone: ${this.contactPhone}

We're here to help!`;
  }

  /**
   * Generate welcome message
   * @returns {string} - Welcome message
   */
  generateWelcomeMessage() {
    return `Welcome to Gōru! 👋

I'm here to help you navigate your startup journey. I can answer questions about:

• **Our Products** — Startup Toolkit, templates, and bundles
• **Methodology** — Startup Lifecycle and 52 Risks framework
• **Getting Started** — How to launch your venture
• **Planning Tools** — Business plans, pitch decks, and more
• **Risk Management** — Identifying and mitigating startup risks

What would you like to know?`;
  }

  /**
   * Generate FAQ response
   * @param {object} faq - FAQ entry
   * @returns {string} - FAQ response
   */
  generateFAQResponse(faq) {
    let response = `**${faq.question}**\n\n${faq.answer}`;

    if (faq.relatedResources && Array.isArray(faq.relatedResources)) {
      response += '\n\n**Related Resources:**\n';
      faq.relatedResources.forEach((resource, index) => {
        response += `${index + 1}. [${resource.title}](${resource.url})\n`;
      });
    }

    return response;
  }

  /**
   * Add tone markers for emphasis
   * @param {string} text - Response text
   * @param {string} tone - Tone type: 'encouraging', 'expert', 'practical'
   * @returns {string} - Text with tone markers
   */
  addToneMarkers(text, tone = 'encouraging') {
    const markers = {
      encouraging: ['Great question!', "You're thinking about the right things!", 'Excellent!'],
      expert: ['According to our methodology...', 'Our framework shows...', 'Based on our experience...'],
      practical: ['Here's how to...', 'Start by...', 'The key is to...'],
    };

    // This is handled by the AI model, but can be used for post-processing
    return text;
  }

  /**
   * Validate response quality
   * @param {string} text - Response text
   * @returns {object} - Validation result
   */
  validateResponse(text) {
    const issues = [];

    if (text.length < 50) {
      issues.push('Response too short');
    }

    if (text.length > 2000) {
      issues.push('Response too long');
    }

    if (!text.includes('→') && !text.includes('[')) {
      issues.push('No CTA or links included');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }
}

module.exports = ResponseFormatter;

