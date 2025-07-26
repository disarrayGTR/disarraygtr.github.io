// Конфигурация интеграций для сбора лидов
const INTEGRATIONS_CONFIG = {
  // Google Sheets интеграция
  googleSheets: {
    enabled: true,
    method: 'google-apps-script', // 'api' или 'google-apps-script'
    
    // Для Google Sheets API (отключено, используется Google Apps Script)
    api: {
      enabled: false,
      spreadsheetId: '1QdvmycbM8TDtU6e3FB0rG-eTmZLtOc4NZNxYTrRFn0I',
      apiKey: 'YOUR_GOOGLE_API_KEY',
      range: 'Sheet1!A:G'
    },
    
    // Для Google Apps Script (рекомендуется)
    appsScript: {
      deploymentId: 'AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw',
      webhookUrl: 'https://script.google.com/macros/s/AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw/exec',
      spreadsheetId: '1QdvmycbM8TDtU6e3FB0rG-eTmZLtOc4NZNxYTrRFn0I'
    }
  },

  // Telegram интеграция
  telegram: {
    enabled: true,
    
    // Webhook метод (рекомендуется)
    webhook: {
      enabled: true,
      url: 'https://your-server.com/webhook/telegram',
      secretKey: 'your-webhook-secret'
    },
    
    // Прямая отправка через Bot API
    botApi: {
      enabled: true,
      botToken: '8464911334:AAGK_M9HU1VWp0nUcNgnBr3fEIlE-B-eI1c',
      chatId: 'YOUR_CHAT_ID', // Получить у @userinfobot
      parseMode: 'Markdown'
    },
    
    // Telegram WebApp (автоматически)
    webApp: {
      enabled: true // Работает автоматически в Telegram
    }
  },

  // Email интеграция
  email: {
    enabled: false, // Включите при необходимости
    
    // SMTP настройки
    smtp: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
      }
    },
    
    // Получатели уведомлений
    recipients: {
      admin: 'admin@example.com',
      sales: 'sales@example.com'
    },
    
    // Шаблоны писем
    templates: {
      newLead: {
        subject: 'Новая заявка: {{name}}',
        template: 'new-lead.html'
      },
      leadConfirmation: {
        subject: 'Спасибо за заявку!',
        template: 'confirmation.html'
      }
    }
  },

  // CRM интеграция
  crm: {
    enabled: false, // Включите при необходимости
    
    // AmoCRM
    amocrm: {
      enabled: false,
      domain: 'your-domain.amocrm.ru',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
      redirectUri: 'https://your-site.com/amocrm/callback'
    },
    
    // Bitrix24
    bitrix24: {
      enabled: false,
      webhook: 'https://your-domain.bitrix24.ru/rest/USER_ID/WEBHOOK_KEY/'
    }
  },

  // Аналитика
  analytics: {
    enabled: true,
    
    // Google Analytics
    googleAnalytics: {
      enabled: true,
      trackingId: 'UA-XXXXXXXXX-X' // Замените на ваш ID
    },
    
    // Яндекс.Метрика
    yandexMetrica: {
      enabled: true,
      counterId: 'XXXXXXXX' // Замените на ваш счетчик
    },
    
    // Facebook Pixel
    facebookPixel: {
      enabled: false,
      pixelId: 'XXXXXXXXXXXXXXXXX'
    }
  },

  // Безопасность
  security: {
    // Разрешенные домены
    allowedOrigins: [
      'https://YOUR_USERNAME.github.io',
      'http://localhost:3000',
      'http://localhost:8080',
      'http://127.0.0.1'
    ],
    
    // Ограничение частоты запросов
    rateLimit: {
      enabled: true,
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 5 // максимум 5 заявок с одного IP за окно
    },
    
    // Защита от спама
    spam: {
      enabled: true,
      honeypot: true, // Скрытое поле для ботов
      duplicateCheck: true // Проверка дубликатов
    }
  },

  // Резервные методы
  fallback: {
    enabled: true,
    
    // Локальное сохранение
    localStorage: {
      enabled: true,
      key: 'automation-game-leads'
    },
    
    // Отправка на email (если другие методы не работают)
    emailFallback: {
      enabled: false,
      recipient: 'fallback@example.com'
    }
  }
};

// Функции для работы с конфигурацией
class IntegrationsManager {
  constructor(config = INTEGRATIONS_CONFIG) {
    this.config = config;
    this.initialized = false;
  }

  // Инициализация всех активных интеграций
  async init() {
    console.log('🔧 Инициализация интеграций...');
    
    const results = {};
    
    // Google Sheets
    if (this.config.googleSheets.enabled) {
      results.googleSheets = await this.initGoogleSheets();
    }
    
    // Telegram
    if (this.config.telegram.enabled) {
      results.telegram = await this.initTelegram();
    }
    
    // Email
    if (this.config.email.enabled) {
      results.email = await this.initEmail();
    }
    
    // Analytics
    if (this.config.analytics.enabled) {
      results.analytics = await this.initAnalytics();
    }
    
    this.initialized = true;
    console.log('✅ Интеграции инициализированы:', results);
    
    return results;
  }

  async initGoogleSheets() {
    if (this.config.googleSheets.method === 'google-apps-script') {
      return {
        method: 'google-apps-script',
        url: this.config.googleSheets.appsScript.webhookUrl,
        status: this.config.googleSheets.appsScript.webhookUrl !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
      };
    } else {
      return {
        method: 'api',
        status: this.config.googleSheets.api.apiKey !== 'YOUR_GOOGLE_API_KEY'
      };
    }
  }

  async initTelegram() {
    const methods = [];
    
    if (this.config.telegram.webhook.enabled) {
      methods.push('webhook');
    }
    
    if (this.config.telegram.botApi.enabled) {
      methods.push('bot-api');
    }
    
    if (this.config.telegram.webApp.enabled) {
      methods.push('web-app');
    }
    
    return {
      methods: methods,
      status: methods.length > 0
    };
  }

  async initEmail() {
    return {
      smtp: this.config.email.smtp.host !== '',
      recipients: Object.keys(this.config.email.recipients).length > 0
    };
  }

  async initAnalytics() {
    const services = [];
    
    if (this.config.analytics.googleAnalytics.enabled) {
      services.push('google-analytics');
    }
    
    if (this.config.analytics.yandexMetrica.enabled) {
      services.push('yandex-metrica');
    }
    
    if (this.config.analytics.facebookPixel.enabled) {
      services.push('facebook-pixel');
    }
    
    return {
      services: services,
      status: services.length > 0
    };
  }

  // Получение активных интеграций
  getActiveIntegrations() {
    const active = [];
    
    if (this.config.googleSheets.enabled) {
      active.push({
        name: 'Google Sheets',
        type: 'storage',
        method: this.config.googleSheets.method
      });
    }
    
    if (this.config.telegram.enabled) {
      const methods = [];
      if (this.config.telegram.webhook.enabled) methods.push('webhook');
      if (this.config.telegram.botApi.enabled) methods.push('bot-api');
      if (this.config.telegram.webApp.enabled) methods.push('web-app');
      
      active.push({
        name: 'Telegram',
        type: 'notification',
        methods: methods
      });
    }
    
    if (this.config.email.enabled) {
      active.push({
        name: 'Email',
        type: 'notification',
        method: 'smtp'
      });
    }
    
    if (this.config.crm.enabled) {
      active.push({
        name: 'CRM',
        type: 'storage',
        method: 'api'
      });
    }
    
    return active;
  }

  // Проверка конфигурации
  validateConfig() {
    const issues = [];
    
    // Google Sheets
    if (this.config.googleSheets.enabled) {
      if (this.config.googleSheets.method === 'api' && 
          this.config.googleSheets.api.apiKey === 'YOUR_GOOGLE_API_KEY') {
        issues.push('Google Sheets API key not configured');
      }
      
      if (this.config.googleSheets.method === 'google-apps-script' && 
          this.config.googleSheets.appsScript.webhookUrl.includes('YOUR_SCRIPT_ID')) {
        issues.push('Google Apps Script webhook URL not configured');
      }
    }
    
    // Telegram
    if (this.config.telegram.enabled) {
      if (this.config.telegram.botApi.enabled && 
          this.config.telegram.botApi.chatId === 'YOUR_CHAT_ID') {
        issues.push('Telegram chat ID not configured');
      }
      
      if (this.config.telegram.webhook.enabled && 
          this.config.telegram.webhook.url.includes('your-server.com')) {
        issues.push('Telegram webhook URL not configured');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues: issues
    };
  }
}

// Экспорт для использования в браузере и Node.js
if (typeof window !== 'undefined') {
  // Браузер
  window.INTEGRATIONS_CONFIG = INTEGRATIONS_CONFIG;
  window.IntegrationsManager = IntegrationsManager;
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js
  module.exports = {
    INTEGRATIONS_CONFIG,
    IntegrationsManager
  };
}
