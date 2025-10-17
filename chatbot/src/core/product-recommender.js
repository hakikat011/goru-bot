/**
 * Gōru Product Recommender
 * Intelligently recommends products based on user queries
 */

const Logger = require('../utils/logger');

class ProductRecommender {
  constructor() {
    this.logger = new Logger('ProductRecommender');

    // Keywords that trigger bundle recommendations
    this.bundleTriggerKeywords = [
      'getting started',
      'startup bundle',
      'all-in-one',
      'complete toolkit',
      'everything i need',
      'templates',
      'business plan',
      'pitch deck',
      'cash flow',
      'project plan',
      'task list',
      'comprehensive',
      'full package',
      'where do i start',
      'how do i begin',
      'first time founder',
      'new entrepreneur',
      'launch my startup',
      'plan my business',
      'need help planning',
      'multiple tools',
      'all the tools',
    ];

    // Keywords that suggest bundle is NOT appropriate
    this.bundleExcludeKeywords = [
      'just the ebook',
      'only the book',
      'single product',
      'individual template',
      'just one',
      'pricing of individual',
      'separate purchase',
    ];

    // Product-specific keywords
    this.productKeywords = {
      ebook: ['ebook', 'book', 'read', 'learning', 'guide', 'audiobook'],
      businessPlan: ['business plan', 'planning', 'strategy', 'plan'],
      pitchDeck: ['pitch', 'presentation', 'investors', 'funding'],
      cashFlow: ['cash flow', 'financial', 'forecast', 'money', 'budget'],
      projectPlan: ['project plan', 'timeline', 'gantt', 'schedule'],
      taskList: ['task list', 'tasks', 'checklist', 'todo'],
    };
  }

  /**
   * Determine if bundle should be recommended
   * @param {string} userMessage - User's message
   * @param {array} kbResults - Knowledge base results
   * @returns {boolean} - Whether to recommend bundle
   */
  shouldRecommend(userMessage, kbResults = []) {
    try {
      const messageLower = userMessage.toLowerCase();

      // Check for exclusion keywords
      if (this.hasExcludeKeywords(messageLower)) {
        this.logger.debug('Bundle recommendation excluded due to keywords');
        return false;
      }

      // Check for trigger keywords
      if (this.hasTriggerKeywords(messageLower)) {
        this.logger.debug('Bundle recommendation triggered by keywords');
        return true;
      }

      // Check KB results for bundle relevance
      if (this.isBundleRelevantToResults(kbResults)) {
        this.logger.debug('Bundle recommendation triggered by KB results');
        return true;
      }

      // Check for multiple product mentions
      if (this.mentionsMultipleProducts(messageLower)) {
        this.logger.debug('Bundle recommendation triggered by multiple products');
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Error in shouldRecommend: ${error.message}`);
      return false;
    }
  }

  /**
   * Check if message has exclusion keywords
   * @param {string} messageLower - Lowercase message
   * @returns {boolean} - Has exclusion keywords
   */
  hasExcludeKeywords(messageLower) {
    return this.bundleExcludeKeywords.some((keyword) => messageLower.includes(keyword));
  }

  /**
   * Check if message has trigger keywords
   * @param {string} messageLower - Lowercase message
   * @returns {boolean} - Has trigger keywords
   */
  hasTriggerKeywords(messageLower) {
    return this.bundleTriggerKeywords.some((keyword) => messageLower.includes(keyword));
  }

  /**
   * Check if bundle is relevant to KB results
   * @param {array} kbResults - KB search results
   * @returns {boolean} - Is bundle relevant
   */
  isBundleRelevantToResults(kbResults) {
    if (!Array.isArray(kbResults) || kbResults.length === 0) {
      return false;
    }

    // Check if results mention bundle or multiple products
    return kbResults.some(
      (result) =>
        (result.type === 'bundle' ||
          result.category === 'bundle' ||
          result.title.toLowerCase().includes('bundle')) &&
        result.score > 0.5
    );
  }

  /**
   * Check if message mentions multiple products
   * @param {string} messageLower - Lowercase message
   * @returns {boolean} - Mentions multiple products
   */
  mentionsMultipleProducts(messageLower) {
    let productCount = 0;

    for (const keywords of Object.values(this.productKeywords)) {
      if (keywords.some((kw) => messageLower.includes(kw))) {
        productCount++;
      }
    }

    return productCount >= 2;
  }

  /**
   * Get recommended products based on query
   * @param {string} userMessage - User's message
   * @returns {array} - Recommended products
   */
  getRecommendedProducts(userMessage) {
    const messageLower = userMessage.toLowerCase();
    const recommendations = [];

    // Check for specific product mentions
    for (const [product, keywords] of Object.entries(this.productKeywords)) {
      if (keywords.some((kw) => messageLower.includes(kw))) {
        recommendations.push({
          product,
          confidence: this.calculateConfidence(messageLower, keywords),
        });
      }
    }

    // Sort by confidence
    recommendations.sort((a, b) => b.confidence - a.confidence);

    return recommendations;
  }

  /**
   * Calculate recommendation confidence
   * @param {string} messageLower - Lowercase message
   * @param {array} keywords - Product keywords
   * @returns {number} - Confidence score (0-1)
   */
  calculateConfidence(messageLower, keywords) {
    const matches = keywords.filter((kw) => messageLower.includes(kw)).length;
    return Math.min(matches / keywords.length, 1);
  }

  /**
   * Generate product recommendation text
   * @param {string} product - Product name
   * @returns {string} - Recommendation text
   */
  generateRecommendationText(product) {
    const recommendations = {
      ebook: `Our **Startup Toolkit eBook** is a comprehensive 120-page guide with full-color illustrations. It covers all stages of your startup journey and includes practical examples and checklists.`,

      businessPlan: `The **Business Plan Template** helps you structure your business strategy. It includes sections for market analysis, financial projections, and operational planning.`,

      pitchDeck: `Our **Pitch Deck Template** (20 pages) is designed to help you present your startup to investors. It includes best practices and example slides.`,

      cashFlow: `The **Cash Flow Forecast Template** helps you project your financial needs. It's an advanced Excel spreadsheet with built-in formulas and scenarios.`,

      projectPlan: `The **Project Plan Template** uses a Gantt chart format to help you visualize your startup timeline and manage dependencies.`,

      taskList: `The **Task List Template** helps you organize all the tasks needed to launch your startup. It's a simple but powerful Excel tool.`,
    };

    return recommendations[product] || 'We have a product that might help with your needs.';
  }

  /**
   * Get bundle details
   * @returns {object} - Bundle information
   */
  getBundleDetails() {
    return {
      name: 'Startup Bundle',
      price: '$104.55 AUD',
      description: 'Complete toolkit for launching your startup',
      includes: [
        'Startup Toolkit eBook (120 pages, full color)',
        'Business Plan Template (Word)',
        'Pitch Deck Template (PowerPoint, 20 pages)',
        'Cash Flow Forecast (Excel)',
        'Project Plan (Excel Gantt Chart)',
        'Task List (Excel)',
      ],
      benefits: [
        'Everything you need in one package',
        'Save time with ready-to-use templates',
        'Professional formatting and guidance',
        'Comprehensive coverage of startup stages 1-3',
        'Integrated risk management framework',
      ],
      shopUrl: 'https://www.goruworld.com/shop/',
    };
  }

  /**
   * Generate bundle comparison
   * @param {array} selectedProducts - Selected products
   * @returns {object} - Comparison data
   */
  generateBundleComparison(selectedProducts = []) {
    const bundle = this.getBundleDetails();
    let bundlePrice = 104.55;
    let individualPrice = 0;

    // Estimate individual prices (these would come from KB in production)
    const productPrices = {
      ebook: 19.99,
      businessPlan: 34.99,
      pitchDeck: 34.99,
      cashFlow: 49.99,
      projectPlan: 34.99,
      taskList: 19.99,
    };

    selectedProducts.forEach((product) => {
      individualPrice += productPrices[product] || 0;
    });

    return {
      bundle: {
        name: bundle.name,
        price: bundlePrice,
        items: bundle.includes.length,
      },
      individual: {
        price: individualPrice,
        items: selectedProducts.length,
      },
      savings: Math.max(0, individualPrice - bundlePrice),
      recommendation: individualPrice > bundlePrice ? 'Bundle saves you money!' : 'Both options available',
    };
  }

  /**
   * Get next product recommendation
   * @param {string} currentProduct - Current product
   * @returns {object} - Next recommended product
   */
  getNextRecommendation(currentProduct) {
    const recommendations = {
      ebook: {
        next: 'businessPlan',
        reason: 'After reading the guide, create your business plan',
      },
      businessPlan: {
        next: 'pitchDeck',
        reason: 'Present your plan to potential investors',
      },
      pitchDeck: {
        next: 'cashFlow',
        reason: 'Back up your pitch with financial projections',
      },
      cashFlow: {
        next: 'projectPlan',
        reason: 'Plan your execution timeline',
      },
      projectPlan: {
        next: 'taskList',
        reason: 'Break down your plan into actionable tasks',
      },
    };

    return recommendations[currentProduct] || null;
  }
}

module.exports = ProductRecommender;

