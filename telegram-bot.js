// Модуль для интеграции с Telegram Bot
class TelegramBotIntegration {
    constructor() {
        this.initialized = false;
        this.botToken = null;
        this.chatId = null;
    }

    init() {
        // Проверяем наличие Telegram WebApp
        if (window.Telegram && window.Telegram.WebApp) {
            const tg = window.Telegram.WebApp;
            
            // Инициализируем WebApp
            tg.ready();
            tg.expand();
            
            // Настраиваем цвета интерфейса
            try {
                tg.setHeaderColor('bg_color');
                tg.setBottomBarColor('#ffffff');
                tg.disableClosingConfirmation();
                tg.MainButton.hide();
            } catch (e) {
                console.warn('Некоторые функции Telegram WebApp не поддерживаются в этой версии');
            }
            
            // Получаем данные пользователя
            if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
                this.chatId = tg.initDataUnsafe.user.id;
                console.log('🤖 Пользователь Telegram:', tg.initDataUnsafe.user);
            }
            
            this.initialized = true;
            console.log('🤖 Telegram Bot Integration initialized');
            
            return tg;
        } else {
            console.log('🤖 Telegram Bot Integration initialized for web (no WebApp)');
            return null;
        }
    }

    // Отправка данных через Telegram WebApp
    sendData(data) {
        if (window.Telegram && window.Telegram.WebApp) {
            try {
                window.Telegram.WebApp.sendData(data);
                return true;
            } catch (error) {
                console.error('Ошибка отправки данных через Telegram WebApp:', error);
                return false;
            }
        }
        return false;
    }

    // Закрыть WebApp
    close() {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.close();
        }
    }

    // Показать уведомление
    showAlert(message) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.showAlert(message);
        } else {
            alert(message);
        }
    }

    // Показать подтверждение
    showConfirm(message, callback) {
        if (window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.showConfirm(message, callback);
        } else {
            const result = confirm(message);
            callback(result);
        }
    }

    // Логирование событий для отладки
    logEvent(event, data = {}) {
        const eventData = {
            event,
            timestamp: Date.now(),
            data,
            telegramUser: this.chatId,
            isWebApp: this.initialized
        };

        console.log('📊 Bot event:', eventData);

        // Сохраняем в localStorage для отладки
        try {
            const events = JSON.parse(localStorage.getItem('telegram-events') || '[]');
            events.push(eventData);
            
            // Ограничиваем размер лога
            if (events.length > 50) {
                events.splice(0, events.length - 50);
            }
            
            localStorage.setItem('telegram-events', JSON.stringify(events));
        } catch (e) {
            console.warn('Не удалось сохранить событие в localStorage');
        }
    }

    // Получить сохраненные события для отладки
    getEvents() {
        try {
            return JSON.parse(localStorage.getItem('telegram-events') || '[]');
        } catch (e) {
            return [];
        }
    }

    // Очистить лог событий
    clearEvents() {
        localStorage.removeItem('telegram-events');
    }
}

// Экспортируем для глобального использования
window.TelegramBotIntegration = TelegramBotIntegration;

console.log('🤖 Telegram Bot module loaded successfully');
