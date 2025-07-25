// Конфигурация игры
const GAME_CONFIG = {
    // Размеры игры
    width: Math.min(window.innerWidth, 800),
    height: Math.min(window.innerHeight, 600),
    
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
    
    // Тексты для экранов
    texts: {
        scene1: {
            title: 'Ваш бизнес растёт!',
            description: 'Но вы не справляетесь с заявками.\nКруглосуточно поступают вопросы,\nменеджеры не успевают — клиенты уходят.',
            choice1: 'Нанять менеджера\n(-30 000 ₽/месяц)',
            choice2: 'Установить чат-бота\n(+5X заявки)'
        },
        scene2: {
            title: 'Установка чат-бота',
            description: 'Подключаем автоматические ответы...',
            success: 'Бот активирован!'
        },
        scene3: {
            title: 'Автоматизация работает!',
            description: 'Бот отвечает клиентам 24/7\nСобирает контакты\nНаправляет в CRM\nРост заявок: +30%'
        },
        scene4: {
            title: 'Поздравляем!',
            description: 'Благодаря чат-боту вы:\n• Увеличил�� продажи\n• Снизили нагрузку на персонал\n• Автоматизировали воронку'
        },
        scene5: {
            title: 'Готовы к успеху?',
            description: 'Закажите чат-бота\nдля своего бизнеса!'
        }
    }
};

// Telegram WebApp инициализация
function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();
        tg.expand();
        
        // Получаем информацию о пользователе
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            GAME_CONFIG.telegram.chatId = tg.initDataUnsafe.user.id;
        }
        
        console.log('Telegram WebApp initialized');
        return tg;
    }
    return null;
}
