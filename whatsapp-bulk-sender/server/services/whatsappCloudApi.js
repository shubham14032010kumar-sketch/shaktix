/**
 * SHAKTIX WhatsApp Cloud API Client
 * Official Meta Graph API Integration
 */

const axios = require('axios');

class WhatsAppCloudApiService {
  constructor(config = {}) {
    this.token = config.token || process.env.WHATSAPP_ACCESS_TOKEN;
    this.phoneNumberId = config.phoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;
    this.wabaId = config.wabaId || process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    this.apiVersion = config.apiVersion || process.env.WHATSAPP_API_VERSION || 'v21.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  // Format phone number to E.164 without '+' or leading zeros
  formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.toString().replace(/\D/g, '');
    // If 10 digits (Indian standard), prepend 91
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return cleaned;
  }

  // Common Axios client with Auth Headers
  getClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 15000
    });
  }

  /**
   * Send WhatsApp Approved Template Message
   * @param {Object} params
   * @param {string} params.to - Recipient phone number
   * @param {string} params.templateName - Approved template name
   * @param {string} params.languageCode - e.g., 'en', 'en_US', 'hi'
   * @param {Array} params.components - Body / Header variables
   */
  async sendTemplateMessage({ to, templateName, languageCode = 'en', components = [] }) {
    const formattedPhone = this.formatPhoneNumber(to);
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: components
      }
    };

    try {
      const response = await this.getClient().post(`/${this.phoneNumberId}/messages`, payload);
      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
        recipient: formattedPhone,
        raw: response.data
      };
    } catch (error) {
      const errorData = error.response?.data?.error || {};
      return {
        success: false,
        recipient: formattedPhone,
        errorCode: errorData.code || 'UNKNOWN_ERROR',
        errorSubcode: errorData.error_subcode,
        errorMessage: errorData.message || error.message,
        errorDetails: errorData.error_data?.details || ''
      };
    }
  }

  /**
   * Send Standard Freeform Text Message (Only works within active 24-hr user-initiated window)
   */
  async sendTextMessage({ to, body }) {
    const formattedPhone = this.formatPhoneNumber(to);
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: formattedPhone,
      type: 'text',
      text: { preview_url: true, body: body }
    };

    try {
      const response = await this.getClient().post(`/${this.phoneNumberId}/messages`, payload);
      return {
        success: true,
        messageId: response.data.messages?.[0]?.id,
        recipient: formattedPhone,
        raw: response.data
      };
    } catch (error) {
      const errorData = error.response?.data?.error || {};
      return {
        success: false,
        recipient: formattedPhone,
        errorCode: errorData.code || 'UNKNOWN_ERROR',
        errorMessage: errorData.message || error.message
      };
    }
  }

  /**
   * Fetch Approved Message Templates from Meta WABA
   */
  async getTemplates() {
    try {
      const response = await this.getClient().get(`/${this.wabaId}/message_templates`, {
        params: { limit: 100 }
      });
      return {
        success: true,
        templates: response.data.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * Check WhatsApp Business Phone Number Status & Quality Rating
   */
  async getPhoneNumberHealth() {
    try {
      const response = await this.getClient().get(`/${this.phoneNumberId}`, {
        params: { fields: 'display_phone_number,verified_name,quality_rating,status' }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }
}

module.exports = WhatsAppCloudApiService;
