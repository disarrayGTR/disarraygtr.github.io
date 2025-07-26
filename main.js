// Основной файл игры с улучшенной обработкой ошибок
class AutomationGame {
    constructor() {
        this.telegram = null;
        this.config = null;
        this.game = null;
        this.isInitialized = false;
    }
    
    createAudioContext() {
        // Создаем AudioContext только после пользовательского взаимодействия
        let audioContext = null;

        const createContext = () => {
            if (!audioContext) {
                try {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    if (audioContext.state === 'suspended') {
                        audioContext.resume();
                    }
                } catch (e) {
                    console.warn('AudioContext не поддерживается');
                }
            }
            return audioContext;
        };

        // Добавляем обработчик для первого пользовательского взаимодействия
        const enableAudio = () => {
            createContext();
            document.removeEventListener('touchstart', enableAudio);
            document.removeEventListener('touchend', enableAudio);
            document.removeEventListener('mousedown', enableAudio);
            document.removeEventListener('keydown', enableAudio);
        };

        document.addEventListener('touchstart', enableAudio);
        document.addEventListener('touchend', enableAudio);
        document.addEventListener('mousedown', enableAudio);
        document.addEventListener('keydown', enableAudio);

        return createContext();
    }

    init() {
        try {
            // Инициализация Telegram WebApp
            this.telegram = initTelegram();
            
            console.log('✅ Telegram WebApp initialized successfully');
            
            // Отслеживание инициализации Telegram
            this.trackEvent('telegram_webapp_init', {
                version: this.telegram?.version || 'unknown',
                isTelegram: !!this.telegram,
                userId: this.telegram?.initDataUnsafe?.user?.id || null
            });
        
            // Конфигурация Phaser с улучшенным качеством рендеринга
            this.config = {
                type: Phaser.AUTO,
                width: GAME_CONFIG.width,
                height: GAME_CONFIG.height,
                parent: 'game-container',
                backgroundColor: '#ffffff',
                // Настройки для четкого отображения
                render: {
                    antialias: false,
                    pixelArt: false,
                    roundPixels: true,
                    transparent: false,
                    clearBeforeRender: true,
                    preserveDrawingBuffer: false,
                    premultipliedAlpha: true,
                    failIfMajorPerformanceCaveat: false,
                    powerPreference: 'high-performance',
                    batchSize: 4096
                },
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { y: 0 },
                        debug: false
                    }
                },
                audio: {
                    disableWebAudio: false,
                    context: this.createAudioContext()
                },
                scene: [Scene1, Scene2, Scene3, Scene4, Scene5],
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: GAME_CONFIG.width,
                    height: GAME_CONFIG.height,
                    // Поддержка высокого разрешения
                    resolution: GAME_CONFIG.pixelRatio,
                    // Минимальные и максимальные размеры
                    min: {
                        width: 320,
                        height: 240
                    },
                    max: {
                        width: 1200,
                        height: 900
                    }
                }
            };
            
            // Создание игры
            this.game = new Phaser.Game(this.config);

            // Оптимизация канваса для четкости
            this.optimizeCanvas();
            
            // Скрытие индикатора загрузки
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            this.isInitialized = true;
            console.log('🚀 Game app fully initialized with Telegram integration');
            
            // Отслеживаем старт игры
            this.trackGameStart();
            
        } catch (error) {
            console.error('❌ Error initializing game:', error);
            this.handleInitError(error);
        }
    }
    
    handleInitError(error) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.innerHTML = `
                <div style="color: #ff4444; text-align: center;">
                    <h3>Ошибка загрузки игры</h3>
                    <p>Попробуйте обновить страницу</p>
                    <button onclick="window.location.reload()" style="
                        padding: 10px 20px;
                        background: #007acc;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    ">Обновить</button>
                </div>
            `;
        }
        
        this.trackEvent('game_init_error', {
            error: error.message,
            stack: error.stack
        });
    }
    
    trackGameStart() {
        const userData = {
            userId: this.telegram?.initDataUnsafe?.user?.id || null,
            username: this.telegram?.initDataUnsafe?.user?.username || null,
            isWebApp: !!this.telegram
        };
        
        console.log('📊 Game start logged (no chat_id):', userData);
        
        this.trackEvent('game_start', userData);
    }

    optimizeCanvas() {
        // Оптимизация канваса для улучшенного качества изображения
        setTimeout(() => {
            const canvas = this.game.canvas;
            if (canvas) {
                const ctx = canvas.getContext('2d') || canvas.getContext('webgl') || canvas.getContext('webgl2');

                // Устанавливаем правильные размеры с учетом DPI
                const rect = canvas.getBoundingClientRect();
                const dpr = window.devicePixelRatio || 1;

                // Устанавливаем CSS размеры
                canvas.style.width = rect.width + 'px';
                canvas.style.height = rect.height + 'px';

                // Отключаем размытие при масштабировании
                canvas.style.imageRendering = 'crisp-edges';
                canvas.style.imageRendering = '-moz-crisp-edges';
                canvas.style.imageRendering = '-webkit-optimize-contrast';
                canvas.style.imageRendering = 'optimize-contrast';
                canvas.style.imageRendering = 'pixelated';

                // Дополнительные CSS стили для четкости
                canvas.style.msInterpolationMode = 'nearest-neighbor';

                console.log('🎨 Canvas optimized for crisp rendering');
            }
        }, 100);
    }

    trackEvent(event, data = {}) {
        const eventData = {
            event,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            isTelegram: !!this.telegram,
            userId: this.telegram?.initDataUnsafe?.user?.id || null,
            ...data
        };
        
        console.log('📊 Event tracked:', eventData);
        
        // Сохраняем события локально для отладки
        try {
            const events = JSON.parse(localStorage.getItem('game-events') || '[]');
            events.push(eventData);
            // Сохраняем только последние 100 событий
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            localStorage.setItem('game-events', JSON.stringify(events));
        } catch (e) {
            console.warn('Could not save event to localStorage:', e);
        }
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
    
    // Альтернатив��ая отправка через HTTP API
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

// Глобальный обработчик ошибок JavaScript
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    
    // Отслеживаем JavaScript ошибки
    if (automationGame) {
        automationGame.trackEvent('javascript_error', {
            message: event.error?.message || event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    }
});

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
