class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
    }

    preload() {
        // Создаем простые графические элементы для демонстрации
        this.load.image('office-bg', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="600" fill="#e8f4f8"/>
                <rect x="50" y="400" width="700" height="150" fill="#d4d4d4" rx="10"/>
                <rect x="100" y="100" width="120" height="80" fill="#fff" stroke="#333" stroke-width="2" rx="5"/>
                <rect x="250" y="100" width="120" height="80" fill="#fff" stroke="#333" stroke-width="2" rx="5"/>
                <rect x="400" y="100" width="120" height="80" fill="#fff" stroke="#333" stroke-width="2" rx="5"/>
                <text x="160" y="145" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">Заявки</text>
                <text x="310" y="145" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">Клиенты</text>
                <text x="460" y="145" font-family="Arial" font-size="12" text-anchor="middle" fill="#333">Очередь</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон
        this.add.image(width/2, height/2, 'office-bg').setDisplaySize(width, height);
        
        // Заголовок
        this.add.text(width/2, 80, GAME_CONFIG.texts.scene1.title, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Описание проблемы
        this.add.text(width/2, 200, GAME_CONFIG.texts.scene1.description, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#555',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        
        // Анимация хаоса - мигающие элементы
        this.createChaosAnimation();
        
        // Кнопки выбора
        this.createChoiceButtons(width, height);
    }
    
    createChaosAnimation() {
        const notifications = [];
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, this.scale.width - 100);
            const y = Phaser.Math.Between(250, 350);
            
            const notification = this.add.circle(x, y, 8, 0xff4444).setAlpha(0);
            notifications.push(notification);
            
            this.tweens.add({
                targets: notification,
                alpha: { from: 0, to: 1 },
                duration: 500,
                delay: i * 200,
                yoyo: true,
                repeat: -1
            });
        }
    }
    
    createChoiceButtons(width, height) {
        // Кнопка "Нанять менеджера"
        const managerBtn = this.add.rectangle(width/2 - 120, height - 150, 200, 80, 0xff6b35)
            .setInteractive()
            .on('pointerdown', () => this.chooseManager())
            .on('pointerover', () => managerBtn.setFillStyle(0xdd5530))
            .on('pointerout', () => managerBtn.setFillStyle(0xff6b35));
            
        this.add.text(width/2 - 120, height - 150, GAME_CONFIG.texts.scene1.choice1, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Кнопка "Установить бота"
        const botBtn = this.add.rectangle(width/2 + 120, height - 150, 200, 80, 0x007acc)
            .setInteractive()
            .on('pointerdown', () => this.chooseBot())
            .on('pointerover', () => botBtn.setFillStyle(0x005fa3))
            .on('pointerout', () => botBtn.setFillStyle(0x007acc));
            
        this.add.text(width/2 + 120, height - 150, GAME_CONFIG.texts.scene1.choice2, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            align: 'center'
        }).setOrigin(0.5);
    }
    
    chooseManager() {
        // Показываем неудачный результат
        this.showBadChoice();
    }
    
    chooseBot() {
        // Переходим к следующей сцене
        this.scene.start('Scene2');
    }
    
    showBadChoice() {
        const overlay = this.add.rectangle(this.scale.width/2, this.scale.height/2, this.scale.width, this.scale.height, 0x000000, 0.7);
        
        const popup = this.add.rectangle(this.scale.width/2, this.scale.height/2, 400, 200, 0xffffff)
            .setStrokeStyle(2, 0xff4444);
            
        const text = this.add.text(this.scale.width/2, this.scale.height/2 - 30, 
            'Один менеджер не спасает ситуацию!\nКлиенты по-прежнему ждут ответа.\nПотери: -10 клиентов в неделю', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        const tryAgainBtn = this.add.rectangle(this.scale.width/2, this.scale.height/2 + 50, 150, 40, 0x007acc)
            .setInteractive()
            .on('pointerdown', () => {
                overlay.destroy();
                popup.destroy();
                text.destroy();
                tryAgainBtn.destroy();
                tryAgainText.destroy();
            });
            
        const tryAgainText = this.add.text(this.scale.width/2, this.scale.height/2 + 50, 'Попробовать снова', {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff'
        }).setOrigin(0.5);
    }
}
