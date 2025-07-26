class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        // Используем тот же офисный фон и персонажа
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Настройки для четких изображений
        this.load.on('filecomplete', (key, type, data) => {
            if (type === 'image') {
                const texture = this.textures.get(key);
                if (texture.source[0].image) {
                    const img = texture.source[0].image;
                    img.style.imageRendering = 'crisp-edges';
                    img.style.imageRendering = 'pixelated';
                }
            }
        });
        
        // Элементы для визуализации установки бота - увеличенные и четкие
        this.load.image('bot-icon', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="160" height="160" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="botGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#3498db;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#2980b9;stop-opacity:1" />
                    </radialGradient>
                </defs>
                <circle cx="80" cy="80" r="70" fill="url(#botGrad)" stroke="#fff" stroke-width="6"/>
                <circle cx="65" cy="65" r="8" fill="#fff"/>
                <circle cx="95" cy="65" r="8" fill="#fff"/>
                <rect x="60" y="85" width="40" height="12" fill="#fff" rx="6"/>
                <text x="80" y="125" font-family="Arial" font-size="18" text-anchor="middle" fill="#fff" font-weight="bold">BOT</text>
            </svg>
        `));
        
        this.load.image('telegram-interface', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="400" height="300" fill="#0088cc" rx="20"/>
                <rect x="15" y="15" width="370" height="40" fill="#006ba6" rx="8"/>
                <text x="200" y="40" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff" font-weight="bold">💬 Business Bot Online</text>
                
                <!-- Сообщения бота -->
                <rect x="25" y="70" width="280" height="35" fill="#fff" rx="15"/>
                <text x="35" y="92" font-family="Arial" font-size="16" fill="#2c3e50">Привет! Я ваш автоматический помощник 🤖</text>
                
                <rect x="25" y="115" width="250" height="35" fill="#fff" rx="15"/>
                <text x="35" y="137" font-family="Arial" font-size="16" fill="#2c3e50">Готов принимать заявки 24/7!</text>
                
                <rect x="25" y="160" width="300" height="35" fill="#fff" rx="15"/>
                <text x="35" y="182" font-family="Arial" font-size="16" fill="#2c3e50">Автоматически направляю данные в CRM</text>
                
                <rect x="25" y="205" width="220" height="35" fill="#fff" rx="15"/>
                <text x="35" y="227" font-family="Arial" font-size="16" fill="#2c3e50">Никто не останется без ответа!</text>
                
                <!-- Индикатор онлайн -->
                <circle cx="350" cy="35" r="8" fill="#27ae60"/>
                <text x="365" y="40" font-family="Arial" font-size="14" fill="#fff">24/7</text>
            </svg>
        `));
        
        this.load.image('progress-circle', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ecf0f1" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#27ae60" stroke-width="8" 
                        stroke-dasharray="0 283" stroke-linecap="round" transform="rotate(-90 50 50)" id="progress"/>
                <text x="50" y="58" font-family="Arial" font-size="16" text-anchor="middle" fill="#2c3e50" font-weight="bold">0%</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с успокаивающим оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Успокаивающий синий оверлей показывает решение проблемы
        const calmOverlay = this.add.rectangle(width/2, height/2, width, height, 0x3498db, 0.1);
        
        // Персонаж теперь обнадежен и смотрит на установку бота
        const player = this.add.image(width/2 - width * 0.15, height * 0.65, 'player');
        const playerScale = Math.min(width / 800, height / 600) * 0.3;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Анимация ожидания персонажа
        this.tweens.add({
            targets: player,
            y: player.y - 8,
            duration: 2200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок согласно ТЗ
        const title = this.add.text(width/2, height * 0.08, GAME_CONFIG.texts.scene2.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.055) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        
        // Описание процесса согласно ТЗ
        const descText = this.add.text(width/2, height * 0.16, GAME_CONFIG.texts.scene2.description, {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Анимация установки бота согласно ТЗ: "Анимация подключения чат-бота"
        this.createBotInstallAnimation(width, height);
        
        // Прогресс установки
        this.createProgressIndicator(width, height);
        
        // Показываем Telegram интерфейс согласно ТЗ: "Появляется окно Telegram/WhatsApp с автоответами"
        this.time.delayedCall(2500, () => {
            this.createTelegramUI(width, height);
        });
        
        // Ав��оматический переход согласно ТЗ
        this.time.delayedCall(6000, () => {
            this.showSuccessMessage();
        });
    }
    
    createBotInstallAnimation(width, height) {
        // Большая иконка бота в центре справа
        const botIcon = this.add.image(width/2 + width * 0.12, height * 0.4, 'bot-icon');
        botIcon.setScale(0);
        botIcon.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Анимация появления бота
        this.tweens.add({
            targets: botIcon,
            scale: 0.8,
            duration: 1200,
            ease: 'Back.easeOut'
        });
        
        // Пульсация бота для показа активности
        this.time.delayedCall(1200, () => {
            this.tweens.add({
                targets: botIcon,
                scale: { from: 0.8, to: 0.9 },
                duration: 1800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Эффект "подключения" - световые частицы
        this.time.delayedCall(800, () => {
            for (let i = 0; i < 16; i++) {
                this.time.delayedCall(i * 80, () => {
                    const angle = (i / 16) * Math.PI * 2;
                    const radius = 80;
                    const x = botIcon.x + Math.cos(angle) * radius;
                    const y = botIcon.y + Math.sin(angle) * radius;
                    
                    const particle = this.add.circle(x, y, 4, 0x00ff88);
                    particle.setAlpha(0);
                    
                    this.tweens.add({
                        targets: particle,
                        alpha: 1,
                        scale: 2,
                        duration: 300
                    });
                    
                    this.tweens.add({
                        targets: particle,
                        x: botIcon.x,
                        y: botIcon.y,
                        alpha: 0,
                        delay: 300,
                        duration: 600,
                        onComplete: () => particle.destroy()
                    });
                });
            }
        });
        
        // Текст установки
        const installText = this.add.text(botIcon.x, botIcon.y + 100, 'Установка бота...', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#3498db',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.time.delayedCall(3000, () => {
            installText.setText('✅ Бот установлен!');
            installText.setFill('#27ae60');
        });
    }
    
    createProgressIndicator(width, height) {
        const progressContainer = this.add.container(width/2, height * 0.75);
        
        // Круглый прогресс-бар
        const progressBg = this.add.circle(0, 0, 50, 0, 0x000000, 0);
        progressBg.setStrokeStyle(8, 0xecf0f1);
        progressContainer.add(progressBg);
        
        const progressFill = this.add.circle(0, 0, 50, 0, 0x000000, 0);
        progressFill.setStrokeStyle(8, 0x27ae60);
        progressContainer.add(progressFill);
        
        // Текст процента
        const progressText = this.add.text(0, 0, '0%', {
            fontSize: Math.floor(Math.min(width, height) * 0.035) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        progressContainer.add(progressText);
        
        // Анимация заполнения прогресса
        let progress = 0;
        const progressTimer = this.time.addEvent({
            delay: 80,
            repeat: 100,
            callback: () => {
                progress += 1;
                const circumference = 2 * Math.PI * 50;
                const dashArray = (progress / 100) * circumference;
                
                progressText.setText(progress + '%');
                
                // Эмуляция обновления stroke-dasharray
                const alpha = progress / 100;
                progressFill.setAlpha(alpha);
                
                if (progress >= 100) {
                    progressText.setText('✅ Готово!');
                    progressText.setFill('#27ae60');
                }
            }
        });
        
        // Текст под прогрессом
        const statusText = this.add.text(0, 80, 'Настройка автоответов...', {
            fontSize: Math.floor(Math.min(width, height) * 0.025) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#7f8c8d'
        }).setOrigin(0.5);
        progressContainer.add(statusText);
        
        // Обновляем статус
        this.time.delayedCall(2000, () => statusText.setText('Подключение к CRM...'));
        this.time.delayedCall(4000, () => statusText.setText('Тестирование системы...'));
        this.time.delayedCall(6000, () => {
            statusText.setText('✅ Система готова к работе!');
            statusText.setFill('#27ae60');
        });
    }
    
    createTelegramUI(width, height) {
        // Telegram интерфейс появляется справа согласно ТЗ
        const telegramUI = this.add.image(width * 0.7, height * 0.35, 'telegram-interface');
        telegramUI.setScale(0);
        telegramUI.setAlpha(0);
        telegramUI.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Адаптивное масштабирование для разных размеров экрана
        const uiScale = Math.min(width / 1200, height / 900, 0.6);
        
        // Анимация появления интерфейса
        this.tweens.add({
            targets: telegramUI,
            scale: uiScale,
            alpha: 1,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Добавляем индикаторы активности
        this.time.delayedCall(1200, () => {
            this.createActivityIndicators(telegramUI, width, height);
        });
        
        // Заголовок интерфейса
        const uiTitle = this.add.text(telegramUI.x, telegramUI.y - 120, 'Telegram Bot активирован!', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#0088cc',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        uiTitle.setAlpha(0);
        this.tweens.add({
            targets: uiTitle,
            alpha: 1,
            y: uiTitle.y - 10,
            duration: 600,
            delay: 1000
        });
    }
    
    createActivityIndicators(telegramUI, width, height) {
        // Создаем точки активности рядом с интерфейсом
        for (let i = 0; i < 3; i++) {
            const dot = this.add.circle(
                telegramUI.x + 140, 
                telegramUI.y - 40 + i * 20, 
                5, 
                0x27ae60
            );
            dot.setAlpha(0);
            
            this.tweens.add({
                targets: dot,
                alpha: 1,
                scale: 1.5,
                duration: 500,
                delay: i * 250,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Текст статуса
        const statusText = this.add.text(
            telegramUI.x + 160, 
            telegramUI.y - 40, 
            '🟢 Online 24/7\n📊 CRM интеграция\n⚡ Автоответы', {
                fontSize: Math.floor(Math.min(width, height) * 0.022) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#27ae60',
                fontStyle: 'bold',
                lineSpacing: 5
            }
        );
        
        statusText.setAlpha(0);
        this.tweens.add({
            targets: statusText,
            alpha: 1,
            duration: 600,
            delay: 800
        });
    }
    
    showSuccessMessage() {
        const { width, height } = this.scale;
        
        // Показываем сообщение об успехе согласно ТЗ
        const successBg = this.add.rectangle(width/2, height * 0.9, width * 0.95, 100, 0x27ae60);
        successBg.setStrokeStyle(4, 0x229954);
        successBg.setAlpha(0);
        
        const successText = this.add.text(width/2, height * 0.9, 
            '🎉 ' + GAME_CONFIG.texts.scene2.success + '\n✅ Автоответы настроены • ✅ CRM подключена • ✅ 24/7 работа', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        successText.setAlpha(0);
        
        // Анимация появления сообщения успеха
        this.tweens.add({
            targets: [successBg, successText],
            alpha: 1,
            duration: 700,
            ease: 'Power2'
        });
        
        // Кнопка продолжить
        this.time.delayedCall(1500, () => {
            const continueBtn = this.add.rectangle(width/2, height * 0.96, 250, 50, 0x007acc)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => this.scene.start('Scene3'))
                .on('pointerover', () => {
                    continueBtn.setFillStyle(0x005fa3);
                    this.tweens.add({ targets: continueBtn, scale: 1.05, duration: 150 });
                })
                .on('pointerout', () => {
                    continueBtn.setFillStyle(0x007acc);
                    this.tweens.add({ targets: continueBtn, scale: 1, duration: 150 });
                });
                
            const continueText = this.add.text(width/2, height * 0.96, 'Посмотреть результаты работы', {
                fontSize: Math.floor(Math.min(width, height) * 0.026) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Анимация появления кнопки
            continueBtn.setScale(0);
            continueText.setScale(0);
            
            this.tweens.add({
                targets: [continueBtn, continueText],
                scale: 1,
                duration: 500,
                ease: 'Back.easeOut'
            });
            
            // Пульсация кнопки для привлечения внимания
            this.time.delayedCall(600, () => {
                this.tweens.add({
                    targets: continueBtn,
                    scale: { from: 1, to: 1.08 },
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        });
    }
}
