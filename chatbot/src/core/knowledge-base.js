/**
 * Gōru Knowledge Base
 * Manages knowledge base queries and semantic search
 */

const fs = require('fs');
const path = require('path');
const Logger = require('../utils/logger');

class KnowledgeBase {
  constructor(kbPath = './knowledge-base/data') {
    this.kbPath = kbPath;
    this.logger = new Logger('KnowledgeBase');
    this.data = {};
    this.loadKnowledgeBase();
  }

  /**
   * Load knowledge base from JSON files
   */
  loadKnowledgeBase() {
    try {
      const files = ['products.json', 'faqs.json', 'methodology.json', 'resources.json'];

      files.forEach((file) => {
        const filePath = path.join(this.kbPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          this.data[file] = JSON.parse(content);
          this.logger.info(`Loaded ${file}`);
        }
      });

      this.logger.info('Knowledge base loaded successfully');
    } catch (error) {
      this.logger.error(`Error loading knowledge base: ${error.message}`);
    }
  }

  /**
   * Search knowledge base for relevant information
   * @param {string} query - Search query
   * @param {number} limit - Maximum results to return
   * @returns {Promise<array>} - Relevant KB entries
   */
  async search(query, limit = 5) {
    try {
      const results = [];

      // Search across all data sources
      for (const [source, entries] of Object.entries(this.data)) {
        if (Array.isArray(entries)) {
          entries.forEach((entry) => {
            const score = this.calculateRelevance(query, entry);
            if (score > 0.3) {
              results.push({
                ...entry,
                score,
                source,
              });
            }
          });
        }
      }

      // Sort by relevance score
      results.sort((a, b) => b.score - a.score);

      return results.slice(0, limit);
    } catch (error) {
      this.logger.error(`Error searching knowledge base: ${error.message}`);
      return [];
    }
  }

  /**
   * Calculate relevance score between query and KB entry
   * @param {string} query - Search query
   * @param {object} entry - KB entry
   * @returns {number} - Relevance score (0-1)
   */
  calculateRelevance(query, entry) {
    const queryLower = query.toLowerCase();
    let score = 0;

    // Check title match (highest weight)
    if (entry.title && entry.title.toLowerCase().includes(queryLower)) {
      score += 0.5;
    }

    // Check keywords match
    if (entry.keywords && Array.isArray(entry.keywords)) {
      const matchedKeywords = entry.keywords.filter((kw) =>
        queryLower.includes(kw.toLowerCase())
      );
      score += (matchedKeywords.length / entry.keywords.length) * 0.3;
    }

    // Check content match
    if (entry.content && entry.content.toLowerCase().includes(queryLower)) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  /**
   * Get product information
   * @param {string} productId - Product ID or name
   * @returns {object} - Product information
   */
  getProduct(productId) {
    const products = this.data['products.json'] || [];
    return products.find(
      (p) =>
        p.id === productId ||
        p.name.toLowerCase() === productId.toLowerCase() ||
        p.title.toLowerCase() === productId.toLowerCase()
    );
  }

  /**
   * Get all products
   * @returns {array} - All products
   */
  getAllProducts() {
    return this.data['products.json'] || [];
  }

  /**
   * Get FAQ entries
   * @param {string} category - FAQ category (optional)
   * @returns {array} - FAQ entries
   */
  getFAQs(category = null) {
    const faqs = this.data['faqs.json'] || [];
    if (category) {
      return faqs.filter((faq) => faq.category === category);
    }
    return faqs;
  }

  /**
   * Get methodology information
   * @param {string} topic - Methodology topic
   * @returns {object} - Methodology information
   */
  getMethodology(topic) {
    const methodology = this.data['methodology.json'] || [];
    return methodology.find((m) => m.topic.toLowerCase() === topic.toLowerCase());
  }

  /**
   * Get resources/links
   * @param {string} category - Resource category
   * @returns {array} - Resources
   */
  getResources(category = null) {
    const resources = this.data['resources.json'] || [];
    if (category) {
      return resources.filter((r) => r.category === category);
    }
    return resources;
  }

  /**
   * Get Startup Bundle information
   * @returns {object} - Bundle details
   */
  getStartupBundle() {
    const products = this.getAllProducts();
    return products.find((p) => p.id === 'startup-bundle' || p.type === 'bundle');
  }

  /**
   * Get 52 Risks framework information
   * @returns {object} - 52 Risks framework details
   */
  get52RisksFramework() {
    return this.getMethodology('52-risks');
  }

  /**
   * Get Startup Lifecycle information
   * @returns {object} - Startup Lifecycle details
   */
  getStartupLifecycle() {
    return this.getMethodology('startup-lifecycle');
  }

  /**
   * Search by category
   * @param {string} category - Category to search
   * @returns {array} - Entries in category
   */
  searchByCategory(category) {
    const results = [];

    for (const entries of Object.values(this.data)) {
      if (Array.isArray(entries)) {
        entries.forEach((entry) => {
          if (entry.category === category) {
            results.push(entry);
          }
        });
      }
    }

    return results;
  }

  /**
   * Get related entries
   * @param {object} entry - KB entry
   * @param {number} limit - Max results
   * @returns {array} - Related entries
   */
  getRelated(entry, limit = 3) {
    if (!entry.keywords || entry.keywords.length === 0) {
      return [];
    }

    const query = entry.keywords.join(' ');
    const results = this.search(query, limit + 1);

    // Filter out the original entry
    return results.filter((r) => r.id !== entry.id).slice(0, limit);
  }

  /**
   * Reload knowledge base
   */
  reload() {
    this.data = {};
    this.loadKnowledgeBase();
    this.logger.info('Knowledge base reloaded');
  }

  /**
   * Get KB statistics
   * @returns {object} - Statistics
   */
  getStats() {
    let totalEntries = 0;
    const stats = {};

    for (const [source, entries] of Object.entries(this.data)) {
      if (Array.isArray(entries)) {
        stats[source] = entries.length;
        totalEntries += entries.length;
      }
    }

    return {
      totalEntries,
      sources: stats,
    };
  }
}

module.exports = KnowledgeBase;

