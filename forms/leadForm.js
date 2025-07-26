// Обработчик формы для сбора лидов с интеграцией Google Sheets и Telegram
class LeadFormHandler {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
        this.config = {
            // Google Apps Script конфигурация
            googleSheets: {
                deploymentId: 'AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw',
                webhookUrl: 'https://script.google.com/macros/s/AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw/exec',
                spreadsheetId: '1QdvmycbM8TDtU6e3FB0rG-eTmZLtOc4NZNxYTrRFn0I',
                enabled: true
            },
            // Telegram webhook конфигурация  
            telegram: {
                webhookUrl: 'https://your-server.com/webhook/telegram', // Замените на ваш webhook URL
                botToken: '8464911334:AAGK_M9HU1VWp0nUcNgnBr3fEIlE-B-eI1c',
                chatId: null, // Будет получен автоматически
                enabled: true
            },
            // Резервный способ - отправка на собственный сервер
            fallback: {
                enabled: true,
                url: '/api/leads' // Endpoint на вашем сервере
            }
        };
    }
    
    init() {
        this.form = document.getElementById('contactForm');
        if (!this.form) {
            console.error('Форма не найдена');
            return;
        }
        
        // Добавляем обработчик отправки
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Добавляем валидацию полей в реальном времени
        this.setupValidation();
        
        console.log('📋 Форма лидов инициализирована с интеграциями:', {
            googleSheets: this.config.googleSheets.enabled,
            telegram: this.config.telegram.enabled,
            fallback: this.config.fallback.enabled
        });
    }
    
    setupValidation() {
        const nameInput = document.getElementById('name');
        const phoneInput = document.getElementById('phone');
        const emailInput = document.getElementById('email');
        
        // Валидация имени
        nameInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            if (value.length < 2) {
                this.setFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
            } else {
                this.clearFieldError(nameInput);
            }
        });
        
        // Валидация телефона с улучшенным форматированием
        phoneInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Форматирование номера
            if (value.length > 0) {
                if (value.length <= 1) {
                    value = '+7';
                } else if (value.length <= 4) {
                    value = `+7 (${value.slice(1)}`;
                } else if (value.length <= 7) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4)}`;
                } else if (value.length <= 9) {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7)}`;
                } else {
                    value = `+7 (${value.slice(1, 4)}) ${value.slice(4, 7)}-${value.slice(7, 9)}-${value.slice(9, 11)}`;
                }
            }
            
            e.target.value = value;
            
            // Валидация
            const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
            if (value.length > 0 && !phoneRegex.test(value)) {
                this.setFieldError(phoneInput, 'Введите корректный номер телефона');
            } else {
                this.clearFieldError(phoneInput);
            }
        });
        
        // Валидация email
        emailInput.addEventListener('input', (e) => {
            const value = e.target.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (value.length > 0 && !emailRegex.test(value)) {
                this.setFieldError(emailInput, 'Введите корректный email');
            } else {
                this.clearFieldError(emailInput);
            }
        });
    }
    
    setFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
    }
    
    clearFieldError(field) {
        field.style.borderColor = '#e0e0e0';
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    validateForm() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        
        const errors = [];
        
        if (name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
        if (!phoneRegex.test(phone)) {
            errors.push('Введите корректный номер телефона');
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push('Введите корректный email');
        }
        
        return errors;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) {
            return;
        }
        
        // Валидация
        const errors = this.validateForm();
        if (errors.length > 0) {
            this.showMessage(errors.join('\n'), 'error');
            return;
        }
        
        this.isSubmitting = true;
        this.setSubmitButton(true);
        
        // Собираем данные формы
        const formData = {
            name: document.getElementById('name').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            email: document.getElementById('email').value.trim(),
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('ru-RU'),
            time: new Date().toLocaleTimeString('ru-RU'),
            source: 'automation-game',
            userAgent: navigator.userAgent,
            language: navigator.language,
            referrer: document.referrer || 'direct'
        };
        
        console.log('📤 Отправляем данные лида:', formData);
        
        try {
            // Пытаемся отправить через различные каналы
            const results = await this.sendToAllChannels(formData);
            
            // Проверяем результаты
            const successCount = results.filter(r => r.success).length;
            
            if (successCount > 0) {
                console.log(`✅ Данные успешно отправлены через ${successCount} канал(ов)`);
                this.showSuccess(results);
            } else {
                console.warn('⚠️ Ни один канал отправки не сработал, сохраняем локально');
                this.saveToLocalStorage(formData);
                this.showMessage('Заявка сохранена локально! Мы обработаем её в ближайшее время.', 'warning');
            }
            
        } catch (error) {
            console.error('❌ Ошибка отправки формы:', error);
            this.saveToLocalStorage(formData);
            this.showMessage('Заявка сохранена! Мы свяжемся с вами в ближайшее время.', 'success');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButton(false);
        }
    }
    
    async sendToAllChannels(formData) {
        const results = [];
        
        // 1. Отправка в Google Sheets
        if (this.config.googleSheets.enabled) {
            try {
                const googleResult = await this.sendToGoogleSheets(formData);
                results.push({ channel: 'Google Sheets', success: googleResult, data: formData });
            } catch (error) {
                console.error('Google Sheets error:', error);
                results.push({ channel: 'Google Sheets', success: false, error: error.message });
            }
        }
        
        // 2. Отправка через Telegram webhook
        if (this.config.telegram.enabled) {
            try {
                const telegramResult = await this.sendToTelegramWebhook(formData);
                results.push({ channel: 'Telegram Webhook', success: telegramResult, data: formData });
            } catch (error) {
                console.error('Telegram webhook error:', error);
                results.push({ channel: 'Telegram Webhook', success: false, error: error.message });
            }
        }
        
        // 3. Отправка через Telegram WebApp (если доступен)
        if (window.automationGame) {
            try {
                const webappResult = await window.automationGame.sendToTelegram(formData);
                results.push({ channel: 'Telegram WebApp', success: webappResult, data: formData });
            } catch (error) {
                console.error('Telegram WebApp error:', error);
                results.push({ channel: 'Telegram WebApp', success: false, error: error.message });
            }
        }
        
        // 4. Резервная отправка на собственный сервер
        if (this.config.fallback.enabled) {
            try {
                const fallbackResult = await this.sendToFallbackServer(formData);
                results.push({ channel: 'Fallback Server', success: fallbackResult, data: formData });
            } catch (error) {
                console.error('Fallback server error:', error);
                results.push({ channel: 'Fallback Server', success: false, error: error.message });
            }
        }
        
        return results;
    }
    
    async sendToGoogleSheets(formData) {
        console.log('📊 Отправка в Google Sheets через Google Apps Script...');

        const googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw/exec';

        const response = await fetch(googleAppsScriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Google Apps Script требует no-cors
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        // С no-cors мы не можем проверить response, поэтому считаем успешным
        console.log('✅ Данные отправлены в Google Apps Script');
        return true;
    }
    
    async sendToTelegramWebhook(formData) {
        console.log('🤖 Отправка через Telegram webhook...');
        
        if (!this.config.telegram.webhookUrl || this.config.telegram.webhookUrl === 'https://your-server.com/webhook/telegram') {
            console.warn('⚠️ Telegram webhook URL не настроен');
            return false;
        }
        
        const message = `🎯 *Новая заявка из игры!*
        
👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📧 *Email:* ${formData.email}

📊 *Детали:*
🕐 Время: ${formData.date} ${formData.time}
🎮 Источник: ${formData.source}
🌐 Язык: ${formData.language}
📱 Устройство: ${this.getDeviceInfo(formData.userAgent)}

#лид #автоматизация #игра`;
        
        const payload = {
            chat_id: this.config.telegram.chatId || '@your_channel',
            text: message,
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: '📞 Связаться', url: `tel:${formData.phone}` },
                        { text: '📧 Email', url: `mailto:${formData.email}` }
                    ]
                ]
            }
        };
        
        const response = await fetch(this.config.telegram.webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log('✅ Сообщение отправлено в Telegram');
            return true;
        } else {
            const error = await response.text();
            console.error('❌ Ошибка Telegram webhook:', error);
            throw new Error(`Telegram webhook error: ${response.status}`);
        }
    }
    
    async sendToFallbackServer(formData) {
        console.log('🔄 Отправка на резервный сервер...');
        
        const response = await fetch(this.config.fallback.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            console.log('✅ Данные отправлены на резервный сервер');
            return true;
        } else {
            throw new Error(`Fallback server error: ${response.status}`);
        }
    }
    
    getDeviceInfo(userAgent) {
        if (/Mobile|Android|iPhone|iPad/i.test(userAgent)) {
            return 'Мобильное';
        } else if (/Tablet/i.test(userAgent)) {
            return 'Планшет';
        } else {
            return 'Десктоп';
        }
    }
    
    saveToLocalStorage(data) {
        const leads = JSON.parse(localStorage.getItem('automation-game-leads') || '[]');
        leads.push(data);
        localStorage.setItem('automation-game-leads', JSON.stringify(leads));
        console.log('💾 Данные сохранены локально');
    }
    
    setSubmitButton(disabled) {
        const button = document.getElementById('submitBtn');
        button.disabled = disabled;
        button.textContent = disabled ? 'Отправка...' : 'Оставить заявку';
        
        if (disabled) {
            button.style.opacity = '0.7';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }
    
    showMessage(message, type = 'info') {
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 14px;
            line-height: 1.4;
            ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${type === 'warning' ? 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;' : ''}
            ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
        `;
        messageDiv.textContent = message;
        
        this.form.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 7000);
    }
    
    showSuccess(results) {
        // Скрываем форму
        this.form.style.display = 'none';
        
        // Подсчитываем успешные отправки
        const successfulChannels = results.filter(r => r.success).map(r => r.channel);
        
        // Показываем сообщение об успехе
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            text-align: center;
            padding: 30px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
        `;
        
        successDiv.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
            <h3 style="color: #28a745; margin-bottom: 15px;">Заявка успешно отправлена!</h3>
            <p style="color: #666; margin-bottom: 15px;">
                Спасибо за интерес к автоматизации!<br>
                Мы свяжемся с вами в течение 30 минут.
            </p>
            <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin: 15px 0; font-size: 12px; color: #666;">
                ✅ Отправлено через: ${successfulChannels.join(', ')}
            </div>
            <button onclick="window.location.reload()" style="
                padding: 12px 24px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                margin-right: 10px;
            ">Играть снова</button>
            <button onclick="window.close()" style="
                padding: 12px 24px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
            ">Закрыть</button>
        `;
        
        const formContainer = document.getElementById('leadForm');
        formContainer.innerHTML = '';
        formContainer.appendChild(successDiv);
        
        // Отправляем событие успешной отправки
        if (window.gtag) {
            window.gtag('event', 'lead_submitted', {
                event_category: 'engagement',
                event_label: 'automation_game'
            });
        }
    }
}

// Глобальная инициализация формы
let leadFormHandler;

function initLeadForm() {
    leadFormHandler = new LeadFormHandler();
    leadFormHandler.init();
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.initLeadForm = initLeadForm;
});

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeadFormHandler;
}
