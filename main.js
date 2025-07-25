// Основной файл игры
class AutomationGame {
    constructor() {
        this.telegram = null;
        this.config = null;
        this.game = null;
    }
    
    init() {
        // Инициализация Telegram WebApp
        this.telegram = initTelegram();
        
        // Конфигурация Phaser
        this.config = {
            type: Phaser.AUTO,
            width: GAME_CONFIG.width,
            height: GAME_CONFIG.height,
            parent: 'game-container',
            backgroundColor: '#ffffff',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: GAME_CONFIG.width,
                height: GAME_CONFIG.height
            }
        };
        
        // Создание игры
        this.game = new Phaser.Game(this.config);
        
        // Скрытие индикатора загрузки
        document.getElementById('loading').style.display = 'none';
        
        console.log('Игра "Автоматизация спасёт бизнес" запущена');
    }
    
    // Отправка данных в Telegram бот
    async sendToTelegram(data) {
        if (!this.telegram) {
            console.warn('Telegram WebApp не инициализирован');
            return false;
        }
        
        try {
            const message = `🎯 Новая заявка из игры!\n\n` +
                          `👤 Имя: ${data.name}\n` +
                          `📞 Телефон: ${data.phone}\n` +
                          `📧 Email: ${data.email}\n` +
                          `🎮 Источник: Игра "Автоматизация спасёт бизнес"\n` +
                          `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
            
            // Отправляем данные через Telegram WebApp
            this.telegram.sendData(JSON.stringify({
                type: 'lead',
                data: data,
                message: message
            }));
            
            return true;
        } catch (error) {
            console.error('Ошибка отправки в Telegram:', error);
            return false;
        }
    }
    
    // Альтернативная отправка через HTTP API
    async sendToTelegramAPI(data) {
        const botToken = GAME_CONFIG.telegram.botToken;
        const chatId = GAME_CONFIG.telegram.chatId || '@SavingBusinessBot'; // или ID чата
        
        const message = `🎯 Новая заявка из игры!\n\n` +
                       `👤 Имя: ${data.name}\n` +
                       `📞 Телефон: ${data.phone}\n` +
                       `📧 Email: ${data.email}\n` +
                       `🎮 Источник: Игра "Автоматизация спасёт бизнес"\n` +
                       `⏰ Время: ${new Date().toLocaleString('ru-RU')}`;
        
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            if (response.ok) {
                console.log('Заявка успешно отправлена в Telegram');
                return true;
            } else {
                console.error('Ошибка отправки в Telegram API');
                return false;
            }
        } catch (error) {
            console.error('Ошибка сети при отправке в Telegram:', error);
            return false;
        }
    }
}

// Глобальная переменная игры
let automationGame;

// Инициализация при загрузке страницы
window.addEventListener('load', () => {
    automationGame = new AutomationGame();
    automationGame.init();
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    if (automationGame && automationGame.game) {
        automationGame.game.scale.refresh();
    }
});

// Экспорт для использования в других файлах
window.automationGame = automationGame;
