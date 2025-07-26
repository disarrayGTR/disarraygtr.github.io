// Конфигурация игры
const GAME_CONFIG = {
    // Размеры игры - фиксированные для четкого отображения
    width: 800,
    height: 600,
    // Соотношение пикселей для Retina дисплеев
    pixelRatio: window.devicePixelRatio || 1,
    
    // Telegram WebApp
    telegram: {
        botToken: '8464911334:AAGK_M9HU1VWp0nUcNgnBr3fEIlE-B-eI1c',
        chatId: null // Будет получен от Telegram WebApp
    },
    
    // Цвета
    colors: {
        primary: '#007acc',
        secondary: '#ff6b35',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        background: '#f8f9fa',
        text: '#333333'
    },
    
    // Тексты для экранов согласно ТЗ
    texts: {
        scene1: {
            title: 'Ваш бизнес растёт!',
            description: 'Но вы не справляетесь с заявками.\nКруглосуточно поступают вопросы,\nменеджеры не успевают — клиенты уходят.',
            choice1: 'Нанять менеджера\n(-30 000 ₽/месяц)',
            choice2: 'Установить чат-бота\n(+1 день на внедрение, +5X заявки)'
        },
        scene2: {
            title: 'Установка чат-бота',
            description: 'Анимация подключения чат-бота',
            success: 'Бот активирован!'
        },
        scene3: {
            title: 'Автоматизация работает!',
            description: 'Бот отвечает клиентам 24/7\nСобирает контакты и направляет в CRM\nМеньше хаоса, больше порядка\nРост заявок: +30%'
        },
        scene4: {
            title: 'Поздравляем!',
            description: 'Благодаря чат-боту вы:\n• Увеличили продажи\n• Снизили нагрузку на персонал\n• Автоматизировали воронку'
        },
        scene5: {
            title: 'Хотите такую игру под свой бизнес?',
            description: 'Закажите чат-бота\nдля своего бизнеса!'
        }
    }
};

// Telegram WebApp инициализация
function initTelegram() {
    try {
        const botIntegration = new TelegramBotIntegration();
        const tg = botIntegration.init();

        // Обновляем конфигурацию
        if (botIntegration.chatId) {
            GAME_CONFIG.telegram.chatId = botIntegration.chatId;
        }

        // Логируем инициализацию
        botIntegration.logEvent('telegram_init', {
            hasWebApp: !!tg,
            chatId: botIntegration.chatId
        });

        return tg;
    } catch (error) {
        console.error('Ошибка инициализации Telegram:', error);
        return null;
    }
}
