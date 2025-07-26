// Утилиты для отладки игры
class GameDebugger {
    constructor() {
        this.isEnabled = localStorage.getItem('debug-mode') === 'true';
        this.logBuffer = [];
        this.maxLogs = 200;
        
        if (this.isEnabled) {
            this.init();
        }
    }

    init() {
        console.log('🔍 Debug mode enabled');
        
        // Перехватываем консольные методы
        this.interceptConsole();
        
        // Добавляем глобальные методы отладки
        window.debugGame = this;
        window.enableDebug = () => this.enable();
        window.disableDebug = () => this.disable();
        window.showGameStats = () => this.showStats();
        window.downloadLogs = () => this.downloadLogs();
        
        // Мониторинг производительности
        this.startPerformanceMonitoring();
    }

    enable() {
        localStorage.setItem('debug-mode', 'true');
        this.isEnabled = true;
        console.log('🔍 Debug mode enabled - refresh page to apply');
    }

    disable() {
        localStorage.setItem('debug-mode', 'false');
        this.isEnabled = false;
        console.log('🔍 Debug mode disabled');
    }

    interceptConsole() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;

        console.log = (...args) => {
            this.addLog('log', args);
            originalLog.apply(console, args);
        };

        console.error = (...args) => {
            this.addLog('error', args);
            originalError.apply(console, args);
        };

        console.warn = (...args) => {
            this.addLog('warn', args);
            originalWarn.apply(console, args);
        };
    }

    addLog(level, args) {
        const logEntry = {
            timestamp: Date.now(),
            level,
            message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' ')
        };

        this.logBuffer.push(logEntry);

        // ��граничиваем размер буфера
        if (this.logBuffer.length > this.maxLogs) {
            this.logBuffer.shift();
        }
    }

    showStats() {
        const stats = {
            gameInitialized: window.automationGame?.isInitialized || false,
            telegramAvailable: !!window.Telegram?.WebApp,
            phaserVersion: window.Phaser?.VERSION || 'unknown',
            gameEvents: this.getStoredEvents('game-events'),
            telegramEvents: this.getStoredEvents('telegram-events'),
            savedLeads: this.getStoredEvents('automation-game-leads'),
            performance: this.getPerformanceData(),
            errors: this.getErrorSummary()
        };

        console.table(stats);
        return stats;
    }

    getStoredEvents(key) {
        try {
            const events = JSON.parse(localStorage.getItem(key) || '[]');
            return {
                count: events.length,
                latest: events[events.length - 1]?.timestamp || null
            };
        } catch (e) {
            return { count: 0, latest: null };
        }
    }

    getPerformanceData() {
        if (performance && performance.timing) {
            const timing = performance.timing;
            return {
                pageLoadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domContentLoadedEventEnd - timing.navigationStart,
                firstPaint: performance.getEntriesByType('paint')
                    .find(entry => entry.name === 'first-paint')?.startTime || 'unknown'
            };
        }
        return { error: 'Performance API not available' };
    }

    getErrorSummary() {
        const errors = this.logBuffer.filter(log => log.level === 'error');
        return {
            totalErrors: errors.length,
            recentErrors: errors.slice(-5).map(err => ({
                time: new Date(err.timestamp).toLocaleTimeString(),
                message: err.message.substring(0, 100)
            }))
        };
    }

    downloadLogs() {
        const data = {
            debugLogs: this.logBuffer,
            gameEvents: this.getFullStoredEvents('game-events'),
            telegramEvents: this.getFullStoredEvents('telegram-events'),
            leads: this.getFullStoredEvents('automation-game-leads'),
            stats: this.showStats(),
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `game-debug-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('📁 Debug logs downloaded');
    }

    getFullStoredEvents(key) {
        try {
            return JSON.parse(localStorage.getItem(key) || '[]');
        } catch (e) {
            return [];
        }
    }

    startPerformanceMonitoring() {
        // Мониторинг FPS (если доступно)
        if (window.requestAnimationFrame) {
            let frameCount = 0;
            let lastTime = performance.now();

            const countFPS = () => {
                frameCount++;
                const currentTime = performance.now();
                
                if (currentTime - lastTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                    
                    // Записываем в localStorage для мониторинга
                    const fpsHistory = JSON.parse(localStorage.getItem('fps-history') || '[]');
                    fpsHistory.push({ timestamp: Date.now(), fps });
                    
                    if (fpsHistory.length > 60) { // Последние 60 секунд
                        fpsHistory.shift();
                    }
                    
                    localStorage.setItem('fps-history', JSON.stringify(fpsHistory));
                    
                    frameCount = 0;
                    lastTime = currentTime;
                    
                    // Предупреждение о низком FPS
                    if (fps < 30) {
                        console.warn(`⚠️ Low FPS detected: ${fps}`);
                    }
                }
                
                requestAnimationFrame(countFPS);
            };

            requestAnimationFrame(countFPS);
        }
    }

    // Метод для тестирования всех сцен игры
    testAllScenes() {
        if (!window.automationGame?.game) {
            console.error('Game not initialized');
            return;
        }

        const scenes = ['Scene1', 'Scene2', 'Scene3', 'Scene4', 'Scene5'];
        let currentScene = 0;

        const testNext = () => {
            if (currentScene < scenes.length) {
                console.log(`Testing scene: ${scenes[currentScene]}`);
                window.automationGame.game.scene.start(scenes[currentScene]);
                currentScene++;
                setTimeout(testNext, 3000); // 3 секунды на сцену
            } else {
                console.log('✅ All scenes tested');
            }
        };

        testNext();
    }

    // Симуляция заполнения формы для тестирования
    simulateFormFill() {
        const nameField = document.getElementById('name');
        const phoneField = document.getElementById('phone');
        const emailField = document.getElementById('email');

        if (nameField && phoneField && emailField) {
            nameField.value = 'Тест Тестов';
            phoneField.value = '+7 (999) 123-45-67';
            emailField.value = 'test@example.com';

            // Триггерим события для валидации
            nameField.dispatchEvent(new Event('input'));
            phoneField.dispatchEvent(new Event('input'));
            emailField.dispatchEvent(new Event('input'));

            console.log('📝 Form filled with test data');
        } else {
            console.warn('Form fields not found');
        }
    }
}

// Инициализация отладчика
const gameDebugger = new GameDebugger();

// Автоматическое включение debug режима в development
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    gameDebugger.enable();
}

console.log(`
🎮 Game Debugger loaded
Commands:
- enableDebug() - включить отладку
- disableDebug() - выключить отладку  
- showGameStats() - показать статистику
- downloadLogs() - скачать логи
- debugGame.testAllScenes() - протестировать все сцены
- debugGame.simulateFormFill() - заполнить форму тестовыми данными
`);
