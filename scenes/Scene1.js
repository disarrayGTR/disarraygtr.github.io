class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.chaosElements = [];
    }

    preload() {
        // Загружаем реальные изображения
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Создаем простые графические элементы для уведомлений и хаоса
        this.load.image('notification', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#ff4444" stroke="#fff" stroke-width="2"/>
                <text x="20" y="26" font-family="Arial" font-size="24" text-anchor="middle" fill="#fff">!</text>
            </svg>
        `));
        
        this.load.image('message-bubble', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="30" cy="20" rx="28" ry="18" fill="#fff" stroke="#ddd" stroke-width="2"/>
                <polygon points="15,35 25,25 20,25" fill="#fff" stroke="#ddd" stroke-width="1"/>
                <text x="30" y="25" font-family="Arial" font-size="12" text-anchor="middle" fill="#666">?</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса
        const bg = this.add.image(width/2, height/2, 'office-bg');
        
        // Масштабируем фон чтобы покрыть весь экран, сохраняя пропорции
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Добавляем персонажа в центр сцены, выглядящего растерянным
        const player = this.add.image(width/2, height * 0.7, 'player');
        
        // Масштабируем персонажа соответственно размеру экрана
        const playerScale = Math.min(width / 600, height / 800) * 0.3;
        player.setScale(playerScale);
        
        // Анимация "растерянности" персонажа
        this.tweens.add({
            targets: player,
            rotation: { from: -0.1, to: 0.1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Заголовок
        this.add.text(width/2, height * 0.1, GAME_CONFIG.texts.scene1.title, {
            fontSize: Math.min(width, height) * 0.05 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Описание проблемы с улучшенным стилем
        this.add.text(width/2, height * 0.2, GAME_CONFIG.texts.scene1.description, {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            lineSpacing: 8,
            stroke: '#fff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Создаем анимацию хаоса с уведомлениями и сообщениями
        this.createChaosAnimation();
        
        // Кнопки выбора с улучшенным дизайном
        this.createChoiceButtons(width, height);
        
        // Добавляем пульсирующий эффект важности
        this.createUrgencyEffect();
    }
    
    createChaosAnimation() {
        const { width, height } = this.scale;
        
        // Создаем уведомления, летающие вокруг
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(i * 300, () => {
                const notification = this.add.image(
                    Phaser.Math.Between(50, width - 50),
                    Phaser.Math.Between(height * 0.3, height * 0.6),
                    'notification'
                );
                
                const scale = Phaser.Math.Between(6, 12) / 10;
                notification.setScale(scale);
                notification.setAlpha(0);
                
                this.chaosElements.push(notification);
                
                // Анимация появления и движения
                this.tweens.add({
                    targets: notification,
                    alpha: 1,
                    duration: 300,
                    ease: 'Power2'
                });
                
                this.tweens.add({
                    targets: notification,
                    x: notification.x + Phaser.Math.Between(-50, 50),
                    y: notification.y + Phaser.Math.Between(-30, 30),
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Пульсация
                this.tweens.add({
                    targets: notification,
                    scale: scale * 1.2,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        }
        
        // Добавляем сообщения от клиентов
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(1000 + i * 500, () => {
                const bubble = this.add.image(
                    Phaser.Math.Between(100, width - 100),
                    Phaser.Math.Between(height * 0.25, height * 0.5),
                    'message-bubble'
                );
                
                bubble.setAlpha(0);
                this.chaosElements.push(bubble);
                
                this.tweens.add({
                    targets: bubble,
                    alpha: 0.8,
                    y: bubble.y - 20,
                    duration: 400,
                    ease: 'Back.easeOut'
                });
                
                this.tweens.add({
                    targets: bubble,
                    alpha: 0,
                    y: bubble.y - 40,
                    delay: 2000,
                    duration: 500,
                    onComplete: () => bubble.destroy()
                });
            });
        }
    }
    
    createChoiceButtons(width, height) {
        const buttonWidth = Math.min(width * 0.35, 200);
        const buttonHeight = Math.min(height * 0.12, 80);
        const buttonY = height * 0.85;
        
        // Кнопка "Нанять менеджера" - красная (плохой выбор)
        const managerBtn = this.add.rectangle(
            width/2 - buttonWidth/2 - 20, 
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0xff6b35
        )
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.chooseManager())
        .on('pointerover', () => {
            managerBtn.setFillStyle(0xdd5530);
            this.tweens.add({
                targets: managerBtn,
                scale: 1.05,
                duration: 150
            });
        })
        .on('pointerout', () => {
            managerBtn.setFillStyle(0xff6b35);
            this.tweens.add({
                targets: managerBtn,
                scale: 1,
                duration: 150
            });
        });
            
        this.add.text(width/2 - buttonWidth/2 - 20, buttonY, GAME_CONFIG.texts.scene1.choice1, {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Кнопка "Установить бота" - зеленая (правильный выбор)
        const botBtn = this.add.rectangle(
            width/2 + buttonWidth/2 + 20, 
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0x27ae60
        )
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.chooseBot())
        .on('pointerover', () => {
            botBtn.setFillStyle(0x229954);
            this.tweens.add({
                targets: botBtn,
                scale: 1.05,
                duration: 150
            });
        })
        .on('pointerout', () => {
            botBtn.setFillStyle(0x27ae60);
            this.tweens.add({
                targets: botBtn,
                scale: 1,
                duration: 150
            });
        });
            
        this.add.text(width/2 + buttonWidth/2 + 20, buttonY, GAME_CONFIG.texts.scene1.choice2, {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Подсказка - рекомендованный выбор
        const hint = this.add.text(width/2 + buttonWidth/2 + 20, buttonY - buttonHeight/2 - 25, '🤖 Рекомендуется', {
            fontSize: Math.min(width, height) * 0.02 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Пульсация подсказки
        this.tweens.add({
            targets: hint,
            scale: { from: 1, to: 1.1 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createUrgencyEffect() {
        // Создаем эффект срочности с красными вспышками по краям экрана
        const { width, height } = this.scale;
        
        const urgencyOverlay = this.add.rectangle(width/2, height/2, width, height, 0xff0000, 0);
        
        this.tweens.add({
            targets: urgencyOverlay,
            alpha: { from: 0, to: 0.1 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    chooseManager() {
        // Останавливаем анимации хаоса
        this.tweens.killAll();
        
        // Показываем неудачный результат
        this.showBadChoice();
    }
    
    chooseBot() {
        // Останавливаем анимации хаоса
        this.tweens.killAll();
        
        // Убираем элементы хаоса с анимацией
        this.chaosElements.forEach(element => {
            this.tweens.add({
                targets: element,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => element.destroy()
            });
        });
        
        // Анимация облегчения персонажа
        const player = this.children.getByName('player') || this.children.list.find(child => child.texture?.key === 'player');
        if (player) {
            this.tweens.add({
                targets: player,
                rotation: 0,
                scale: player.scale * 1.1,
                duration: 1000,
                ease: 'Back.easeOut'
            });
        }
        
        // Переходим к следующей сцене через 1.5 секунды
        this.time.delayedCall(1500, () => {
            this.scene.start('Scene2');
        });
    }
    
    showBadChoice() {
        const { width, height } = this.scale;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.7);
        
        const popup = this.add.rectangle(width/2, height/2, width * 0.8, height * 0.4, 0xffffff)
            .setStrokeStyle(4, 0xff4444);
            
        const text = this.add.text(width/2, height/2 - 40, 
            'Один менеджер не спасает ситуацию!\nКлиенты по-прежнему ждут ответа.\n\n💸 Потери: -10 клиентов в неделю\n💰 Дополнительные расходы: 30 000₽/мес', {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        const tryAgainBtn = this.add.rectangle(width/2, height/2 + 60, 200, 50, 0x007acc)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                overlay.destroy();
                popup.destroy();
                text.destroy();
                tryAgainBtn.destroy();
                tryAgainText.destroy();
                
                // Перезапускаем анимации хаоса
                this.createChaosAnimation();
            })
            .on('pointerover', () => tryAgainBtn.setFillStyle(0x005fa3))
            .on('pointerout', () => tryAgainBtn.setFillStyle(0x007acc));
            
        const tryAgainText = this.add.text(width/2, height/2 + 60, 'Попробовать снова', {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Анимация появления попапа
        popup.setScale(0);
        text.setScale(0);
        tryAgainBtn.setScale(0);
        tryAgainText.setScale(0);
        
        this.tweens.add({
            targets: [popup, text, tryAgainBtn, tryAgainText],
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut',
            delay: 200
        });
    }
}
