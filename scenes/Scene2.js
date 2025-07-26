class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        // Используем тот же офисный фон
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Создаем элементы для визуализации установки бота
        this.load.image('bot-icon', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="35" fill="#007acc" stroke="#fff" stroke-width="3"/>
                <circle cx="30" cy="32" r="4" fill="#fff"/>
                <circle cx="50" cy="32" r="4" fill="#fff"/>
                <rect x="25" y="45" width="30" height="8" fill="#fff" rx="4"/>
                <text x="40" y="60" font-family="Arial" font-size="8" text-anchor="middle" fill="#fff">BOT</text>
            </svg>
        `));
        
        this.load.image('telegram-interface', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="200" fill="#2481cc" rx="15"/>
                <rect x="10" y="10" width="280" height="30" fill="#1e6ba8" rx="5"/>
                <text x="150" y="30" font-family="Arial" font-size="16" text-anchor="middle" fill="#fff">💬 Business Bot</text>
                <rect x="20" y="50" width="200" height="25" fill="#fff" rx="12"/>
                <text x="30" y="67" font-family="Arial" font-size="12" fill="#333">Привет! Я ваш помощник 🤖</text>
                <rect x="20" y="85" width="180" height="25" fill="#fff" rx="12"/>
                <text x="30" y="102" font-family="Arial" font-size="12" fill="#333">Готов помочь 24/7!</text>
                <rect x="20" y="120" width="220" height="25" fill="#fff" rx="12"/>
                <text x="30" y="137" font-family="Arial" font-size="12" fill="#333">Могу собирать заявки автоматически</text>
            </svg>
        `));
        
        this.load.image('progress-bar', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="300" height="20" xmlns="http://www.w3.org/2000/svg">
                <rect width="300" height="20" fill="#e0e0e0" rx="10"/>
                <rect width="0" height="20" fill="#27ae60" rx="10" id="progress"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса (теперь более спокойный)
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Добавляем легкий успокаивающий оверлей
        const calmOverlay = this.add.rectangle(width/2, height/2, width, height, 0x27ae60, 0.1);
        
        // Персонаж теперь выглядит обнадеженным
        const player = this.add.image(width/2 - width * 0.15, height * 0.7, 'player');
        const playerScale = Math.min(width / 600, height / 800) * 0.25;
        player.setScale(playerScale);
        
        // Анимация ожидания персонажа
        this.tweens.add({
            targets: player,
            y: player.y - 10,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок
        this.add.text(width/2, height * 0.08, GAME_CONFIG.texts.scene2.title, {
            fontSize: Math.min(width, height) * 0.05 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Описание процесса
        const descText = this.add.text(width/2, height * 0.16, GAME_CONFIG.texts.scene2.description, {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            stroke: '#fff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Анимация установки бота
        this.createBotInstallAnimation(width, height);
        
        // Показываем прогресс-бар
        this.createProgressBar(width, height);
        
        // Показываем Telegram интерфейс через некоторое время
        this.time.delayedCall(2000, () => {
            this.createTelegramUI(width, height);
        });
        
        // Автоматический переход через 5 секунд
        this.time.delayedCall(5000, () => {
            this.showSuccessMessage();
        });
    }
    
    createBotInstallAnimation(width, height) {
        // Большая иконка бота в центре
        const botIcon = this.add.image(width/2 + width * 0.1, height * 0.4, 'bot-icon');
        botIcon.setScale(0);
        
        // Анимация появления бота
        this.tweens.add({
            targets: botIcon,
            scale: 1.2,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Пульсация бота
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: botIcon,
                scale: { from: 1.2, to: 1.4 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Эффект "подключения" - частицы вокруг бота
        this.time.delayedCall(500, () => {
            for (let i = 0; i < 12; i++) {
                this.time.delayedCall(i * 100, () => {
                    const angle = (i / 12) * Math.PI * 2;
                    const radius = 60;
                    const x = botIcon.x + Math.cos(angle) * radius;
                    const y = botIcon.y + Math.sin(angle) * radius;
                    
                    const particle = this.add.circle(x, y, 3, 0x00ff88);
                    particle.setAlpha(0);
                    
                    this.tweens.add({
                        targets: particle,
                        alpha: 1,
                        scale: 1.5,
                        duration: 300
                    });
                    
                    this.tweens.add({
                        targets: particle,
                        x: botIcon.x,
                        y: botIcon.y,
                        alpha: 0,
                        delay: 300,
                        duration: 500,
                        onComplete: () => particle.destroy()
                    });
                });
            }
        });
    }
    
    createProgressBar(width, height) {
        const progressBg = this.add.rectangle(width/2, height * 0.55, 300, 20, 0xe0e0e0);
        progressBg.setStrokeStyle(2, 0x999999);
        
        const progressFill = this.add.rectangle(width/2 - 150, height * 0.55, 0, 16, 0x27ae60);
        progressFill.setOrigin(0, 0.5);
        
        // Анимация заполнения прогресс-бара
        this.tweens.add({
            targets: progressFill,
            width: 300,
            duration: 3000,
            ease: 'Power2'
        });
        
        // Текст прогресса
        const progressText = this.add.text(width/2, height * 0.6, 'Подключение автоответчика...', {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#666'
        }).setOrigin(0.5);
        
        // Обновляем текст прогресса
        let progress = 0;
        const progressTimer = this.time.addEvent({
            delay: 100,
            repeat: 30,
            callback: () => {
                progress += 3.33;
                progressText.setText(`Установка бота... ${Math.round(progress)}%`);
                
                if (progress >= 100) {
                    progressText.setText('✅ Бот успешно установлен!');
                    progressText.setFill('#27ae60');
                }
            }
        });
    }
    
    createTelegramUI(width, height) {
        // Telegram интерфейс появляется справа
        const telegramUI = this.add.image(width * 0.75, height * 0.35, 'telegram-interface');
        telegramUI.setScale(0);
        telegramUI.setAlpha(0);
        
        // Анимация появления интерфейса
        this.tweens.add({
            targets: telegramUI,
            scale: Math.min(width, height) / 800,
            alpha: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        // Добавляем индикаторы активности
        this.time.delayedCall(1000, () => {
            this.createActivityIndicators(telegramUI);
        });
    }
    
    createActivityIndicators(telegramUI) {
        // Создаем точки активности рядом с интерфейсом
        for (let i = 0; i < 3; i++) {
            const dot = this.add.circle(
                telegramUI.x + 120, 
                telegramUI.y - 30 + i * 15, 
                4, 
                0x00ff88
            );
            dot.setAlpha(0);
            
            this.tweens.add({
                targets: dot,
                alpha: 1,
                scale: 1.3,
                duration: 400,
                delay: i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Добавляем текст "Online"
        const onlineText = this.add.text(
            telegramUI.x + 140, 
            telegramUI.y - 30, 
            '🟢 Online 24/7', {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#27ae60',
                fontStyle: 'bold'
            }
        );
        
        this.tweens.add({
            targets: onlineText,
            alpha: { from: 0, to: 1 },
            duration: 500,
            delay: 600
        });
    }
    
    showSuccessMessage() {
        const { width, height } = this.scale;
        
        // Показываем сообщение об успехе
        const successBg = this.add.rectangle(width/2, height * 0.8, width * 0.9, 100, 0x27ae60);
        successBg.setStrokeStyle(3, 0x229954);
        successBg.setAlpha(0);
        
        const successText = this.add.text(width/2, height * 0.8, 
            '🎉 ' + GAME_CONFIG.texts.scene2.success + '\nТеперь ваши клиенты получают мгновенные ответы!', {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        successText.setAlpha(0);
        
        // Анимация появления сообщения успеха
        this.tweens.add({
            targets: [successBg, successText],
            alpha: 1,
            duration: 600,
            ease: 'Power2'
        });
        
        // Кнопка продолжить
        this.time.delayedCall(1000, () => {
            const continueBtn = this.add.rectangle(width/2, height * 0.92, 200, 50, 0x007acc)
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
                
            const continueText = this.add.text(width/2, height * 0.92, 'Посмотреть результаты', {
                fontSize: Math.min(width, height) * 0.025 + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Анимация появления кнопки
            continueBtn.setScale(0);
            continueText.setScale(0);
            
            this.tweens.add({
                targets: [continueBtn, continueText],
                scale: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });
            
            // Пульсация кнопки для привлечения внимания
            this.time.delayedCall(500, () => {
                this.tweens.add({
                    targets: continueBtn,
                    scale: { from: 1, to: 1.1 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        });
    }
}
