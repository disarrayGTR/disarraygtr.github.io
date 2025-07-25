// Обработчик формы для сбора лидов
class LeadFormHandler {
    constructor() {
        this.form = null;
        this.isSubmitting = false;
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
        
        console.log('Форма лидов инициализирована');
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
        
        // Валидация телефона
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
        
        // Удаляем старое сообщение об ошибке
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Добавляем новое сообщение об ошибке
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
            source: 'automation-game'
        };
        
        try {
            // Отправляем через игру
            let success = false;
            
            if (window.automationGame) {
                // Пробуем отправить через Telegram WebApp
                success = await window.automationGame.sendToTelegram(formData);
                
                // Если не получилось, пробуем через API
                if (!success) {
                    success = await window.automationGame.sendToTelegramAPI(formData);
                }
            }
            
            if (success) {
                this.showSuccess();
            } else {
                // Резервный способ - сохраняем в localStorage
                this.saveToLocalStorage(formData);
                this.showMessage('Заявка сохранена! Мы свяжемся с вами в ближайшее время.', 'success');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);
            this.saveToLocalStorage(formData);
            this.showMessage('Заявка сохранена! Мы свяжемся с вами в ближайшее время.', 'success');
        } finally {
            this.isSubmitting = false;
            this.setSubmitButton(false);
        }
    }
    
    saveToLocalStorage(data) {
        const leads = JSON.parse(localStorage.getItem('automation-game-leads') || '[]');
        leads.push(data);
        localStorage.setItem('automation-game-leads', JSON.stringify(leads));
    }
    
    setSubmitButton(disabled) {
        const button = document.getElementById('submitBtn');
        button.disabled = disabled;
        button.textContent = disabled ? 'Отправка...' : 'Оставить заявку';
    }
    
    showMessage(message, type = 'info') {
        // Удаляем существующее сообщение
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Создаем новое сообщение
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
            ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
            ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
            ${type === 'info' ? 'background: #d1ecf1; color: #0c5460; border: 1px solid #bee5eb;' : ''}
        `;
        messageDiv.textContent = message;
        
        this.form.appendChild(messageDiv);
        
        // Автоматически скрываем сообщение через 5 секунд
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
    
    showSuccess() {
        // Скрываем форму
        this.form.style.display = 'none';
        
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
            <h3 style="color: #28a745; margin-bottom: 15px;">Заявка отправлена!</h3>
            <p style="color: #666; margin-bottom: 20px;">
                Спасибо за интерес к автоматизации!<br>
                Мы свяжемся с вами в течение часа.
            </p>
            <button onclick="window.location.reload()" style="
                padding: 12px 24px;
                background: #007acc;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
            ">Играть снова</button>
        `;
        
        const formContainer = document.getElementById('leadForm');
        formContainer.innerHTML = '';
        formContainer.appendChild(successDiv);
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
    // Не инициализируем сразу, только когда форма будет показана
    window.initLeadForm = initLeadForm;
});
