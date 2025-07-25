class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
    }

    preload() {
        // Создаем графику для установки бота
        this.load.image('bot-install', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="600" fill="#f0f8ff"/>
                <circle cx="400" cy="300" r="100" fill="#007acc" opacity="0.1"/>
                <circle cx="400" cy="300" r="60" fill="#007acc" opacity="0.3"/>
                <circle cx="400" cy="300" r="30" fill="#007acc"/>
                <rect x="350" y="280" width="100" height="40" fill="#fff" rx="5"/>
                <text x="400" y="305" font-family="Arial" font-size="16" text-anchor="middle" fill="#007acc">BOT</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон
        this.add.image(width/2, height/2, 'bot-install').setDisplaySize(width, height);
        
        // Заголовок
        this.add.text(width/2, 80, GAME_CONFIG.texts.scene2.title, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Описание процесса
        const descText = this.add.text(width/2, 150, GAME_CONFIG.texts.scene2.description, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#555',
            align: 'center'
        }).setOrigin(0.5);
        
        // Анимация загрузки
        this.createLoadingAnimation();
        
        // Показываем Telegram интерфейс
        this.createTelegramUI(width, height);
        
        // Автоматический переход через 3 секунды
        this.time.delayedCall(3000, () => {
            this.showSuccessMessage();
        });
    }
    
    createLoadingAnimation() {
        const dots = [];
        for (let i = 0; i < 3; i++) {
            const dot = this.add.circle(this.scale.width/2 - 20 + i * 20, 200, 5, 0x007acc).setAlpha(0.3);
            dots.push(dot);
            
            this.tweens.add({
                targets: dot,
                alpha: { from: 0.3, to: 1 },
                duration: 400,
                delay: i * 200,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createTelegramUI(width, height) {
        // Создаем имитацию Telegram интерфейса
        const telegramBg = this.add.rectangle(width/2, height/2 + 50, 300, 200, 0x2481cc, 0.9);
        
        this.add.text(width/2, height/2 - 30, '💬 Telegram Bot', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Сообщения бота
        const messages = [
            'Привет! Я ваш помощник 🤖',
            'Готов отвечать 24/7',
            'Собираю заявки автоматически'
        ];
        
        messages.forEach((msg, index) => {
            this.time.delayedCall(1000 + index * 800, () => {
                this.add.text(width/2 - 120, height/2 + index * 25, msg, {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#fff'
                }).setOrigin(0);
            });
        });
    }
    
    showSuccessMessage() {
        // Показываем сообщение об успехе
        const successBg = this.add.rectangle(this.scale.width/2, this.scale.height - 120, 300, 80, 0x28a745);
        
        this.add.text(this.scale.width/2, this.scale.height - 140, GAME_CONFIG.texts.scene2.success, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Кнопка продолжить
        const continueBtn = this.add.rectangle(this.scale.width/2, this.scale.height - 100, 150, 40, 0x007acc)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Scene3'))
            .on('pointerover', () => continueBtn.setFillStyle(0x005fa3))
            .on('pointerout', () => continueBtn.setFillStyle(0x007acc));
            
        this.add.text(this.scale.width/2, this.scale.height - 100, 'Продолжить', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff'
        }).setOrigin(0.5);
    }
}
