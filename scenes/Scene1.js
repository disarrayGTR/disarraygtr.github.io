class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.chaosElements = [];
    }

    preload() {
        // Загружаем реальные изображения с правильными настройками
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
        
        // Создаем простые четкие элементы для уведомлений и хаоса
        this.load.image('notification', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="36" fill="#e74c3c" stroke="#fff" stroke-width="4"/>
                <text x="40" y="52" font-family="Arial" font-size="36" text-anchor="middle" fill="#fff" font-weight="bold">!</text>
            </svg>
        `));
        
        this.load.image('message-bubble', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="120" height="80" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="60" cy="40" rx="56" ry="36" fill="#fff" stroke="#bdc3c7" stroke-width="3"/>
                <polygon points="30,70 50,50 40,50" fill="#fff" stroke="#bdc3c7" stroke-width="2"/>
                <text x="60" y="50" font-family="Arial" font-size="24" text-anchor="middle" fill="#2c3e50" font-weight="bold">?</text>
            </svg>
        `));
        
        this.load.image('stack-papers', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="60" height="80" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="15" width="45" height="60" fill="#ecf0f1" stroke="#95a5a6" stroke-width="2" rx="3"/>
                <rect x="10" y="10" width="45" height="60" fill="#f8f9fa" stroke="#95a5a6" stroke-width="2" rx="3"/>
                <rect x="15" y="5" width="45" height="60" fill="#fff" stroke="#95a5a6" stroke-width="2" rx="3"/>
                <line x1="20" y1="20" x2="45" y2="20" stroke="#bdc3c7" stroke-width="2"/>
                <line x1="20" y1="30" x2="50" y2="30" stroke="#bdc3c7" stroke-width="2"/>
                <line x1="20" y1="40" x2="45" y2="40" stroke="#bdc3c7" stroke-width="2"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с правильным масштабированием для четкости
        const bg = this.add.image(width/2, height/2, 'office-bg');
        
        // Масштабируем фон чтобы покрыть весь экран без размытия
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Устанавливаем четкое отображение
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Добавляем персонажа в центр сцены, выглядящего растерянным
        const player = this.add.image(width/2, height * 0.65, 'player');
        
        // Масштабируем персонажа с сохранением четкости
        const playerScale = Math.min(width / 800, height / 600) * 0.35;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Анимация "растерянности" персонажа
        this.tweens.add({
            targets: player,
            rotation: { from: -0.08, to: 0.08 },
            duration: 1800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Заголовок согласно ТЗ
        const title = this.add.text(width/2, height * 0.08, GAME_CONFIG.texts.scene1.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.055) + 'px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            align: 'center',
            resolution: window.devicePixelRatio || 1
        }).setOrigin(0.5);
        
        // Описание проблемы согласно ТЗ
        const description = this.add.text(width/2, height * 0.18, GAME_CONFIG.texts.scene1.description, {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            lineSpacing: 8,
            stroke: '#ffffff',
            strokeThickness: 1,
            resolution: window.devicePixelRatio || 1
        }).setOrigin(0.5);
        
        // Создаем хаос согласно ТЗ: "всплывающие окна, много заявок, сообщения, очередь клиентов"
        this.createBusinessChaos();
        
        // Кнопки выбора согласно ТЗ
        this.createChoiceButtons(width, height);
        
        // Эффект срочности
        this.createUrgencyEffect();
    }
    
    createBusinessChaos() {
        const { width, height } = this.scale;
        
        // Стопки бумаг (заявки) согласно ТЗ
        for (let i = 0; i < 4; i++) {
            this.time.delayedCall(i * 300, () => {
                const stack = this.add.image(
                    Phaser.Math.Between(50, width - 50),
                    Phaser.Math.Between(height * 0.3, height * 0.5),
                    'stack-papers'
                );
                
                stack.setScale(0.6);
                stack.setAlpha(0);
                stack.texture.source[0].scaleMode = Phaser.NEAREST;
                
                this.chaosElements.push(stack);
                
                // Анимация появления
                this.tweens.add({
                    targets: stack,
                    alpha: 0.9,
                    scale: 0.8,
                    duration: 400,
                    ease: 'Back.easeOut'
                });
                
                // Покачивание стопок
                this.tweens.add({
                    targets: stack,
                    rotation: { from: -0.05, to: 0.05 },
                    duration: 2000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        }
        
        // Уведомления (много заявок) - красные кружки с восклицательными знаками
        for (let i = 0; i < 8; i++) {
            this.time.delayedCall(500 + i * 200, () => {
                const notification = this.add.image(
                    Phaser.Math.Between(80, width - 80),
                    Phaser.Math.Between(height * 0.25, height * 0.55),
                    'notification'
                );
                
                notification.setScale(0.4);
                notification.setAlpha(0);
                notification.texture.source[0].scaleMode = Phaser.NEAREST;
                
                this.chaosElements.push(notification);
                
                // Анимация появления
                this.tweens.add({
                    targets: notification,
                    alpha: 1,
                    scale: 0.6,
                    duration: 300,
                    ease: 'Power2'
                });
                
                // Пульсация для привлечения внимания
                this.tweens.add({
                    targets: notification,
                    scale: { from: 0.6, to: 0.8 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Движение уведомлений
                this.tweens.add({
                    targets: notification,
                    x: notification.x + Phaser.Math.Between(-30, 30),
                    y: notification.y + Phaser.Math.Between(-20, 20),
                    duration: 3000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            });
        }
        
        // Сообщения от клиентов (очередь клиентов)
        for (let i = 0; i < 6; i++) {
            this.time.delayedCall(1000 + i * 400, () => {
                const bubble = this.add.image(
                    Phaser.Math.Between(100, width - 100),
                    Phaser.Math.Between(height * 0.3, height * 0.5),
                    'message-bubble'
                );
                
                bubble.setScale(0.3);
                bubble.setAlpha(0);
                bubble.texture.source[0].scaleMode = Phaser.NEAREST;
                
                this.chaosElements.push(bubble);
                
                // Анимация появления
                this.tweens.add({
                    targets: bubble,
                    alpha: 0.8,
                    scale: 0.5,
                    y: bubble.y - 15,
                    duration: 500,
                    ease: 'Back.easeOut'
                });
                
                // Исчезновение и появление новых (имитация постоянного потока)
                this.tweens.add({
                    targets: bubble,
                    alpha: 0,
                    y: bubble.y - 30,
                    delay: 2500,
                    duration: 600,
                    onComplete: () => {
                        // Создаем новое сообщение на том же месте
                        bubble.setAlpha(0.8);
                        bubble.y = bubble.y + 45;
                        this.tweens.add({
                            targets: bubble,
                            y: bubble.y - 15,
                            duration: 500,
                            ease: 'Back.easeOut'
                        });
                    }
                });
            });
        }
    }
    
    createChoiceButtons(width, height) {
        const buttonWidth = Math.min(width * 0.38, 220);
        const buttonHeight = Math.min(height * 0.14, 90);
        const buttonY = height * 0.82;
        
        // Кнопка "Нанять менедже��а" - согласно ТЗ: дорого и неэффективно
        const managerBtn = this.add.rectangle(
            width/2 - buttonWidth/2 - 25, 
            buttonY, 
            buttonWidth, 
            buttonHeight, 
            0xe74c3c
        )
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => this.chooseManager())
        .on('pointerover', () => {
            managerBtn.setFillStyle(0xc0392b);
            this.tweens.add({
                targets: managerBtn,
                scale: 1.05,
                duration: 150
            });
        })
        .on('pointerout', () => {
            managerBtn.setFillStyle(0xe74c3c);
            this.tweens.add({
                targets: managerBtn,
                scale: 1,
                duration: 150
            });
        });
            
        this.add.text(width/2 - buttonWidth/2 - 25, buttonY, GAME_CONFIG.texts.scene1.choice1, {
            fontSize: Math.floor(Math.min(width, height) * 0.026) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Кнопка "Установить чат-бота" - согласно ТЗ: правильный выбор
        const botBtn = this.add.rectangle(
            width/2 + buttonWidth/2 + 25, 
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
            
        this.add.text(width/2 + buttonWidth/2 + 25, buttonY, GAME_CONFIG.texts.scene1.choice2, {
            fontSize: Math.floor(Math.min(width, height) * 0.026) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Подсказка - рекомендованный выбор согласно ТЗ
        const hint = this.add.text(width/2 + buttonWidth/2 + 25, buttonY - buttonHeight/2 - 20, '🤖 Умное решение', {
            fontSize: Math.floor(Math.min(width, height) * 0.022) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Пульсация подсказки
        this.tweens.add({
            targets: hint,
            scale: { from: 1, to: 1.1 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createUrgencyEffect() {
        // Эффект срочности - красные вспышки по краям экрана
        const { width, height } = this.scale;
        
        const urgencyOverlay = this.add.rectangle(width/2, height/2, width, height, 0xe74c3c, 0);
        
        this.tweens.add({
            targets: urgencyOverlay,
            alpha: { from: 0, to: 0.12 },
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    chooseManager() {
        // Останавливаем анимации хаоса
        this.tweens.killAll();
        
        // Показываем неудачный р��зультат согласно ТЗ
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
                duration: 600,
                onComplete: () => element.destroy()
            });
        });
        
        // Анимация облегчения персонажа
        const playerObjects = this.children.list.filter(child => child.texture?.key === 'player');
        if (playerObjects.length > 0) {
            const player = playerObjects[0];
            this.tweens.add({
                targets: player,
                rotation: 0,
                scale: player.scale * 1.15,
                duration: 1200,
                ease: 'Back.easeOut'
            });
        }
        
        // Переходим к следующей сцене согласно ТЗ
        this.time.delayedCall(1800, () => {
            this.scene.start('Scene2');
        });
    }
    
    showBadChoice() {
        const { width, height } = this.scale;
        
        const overlay = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0.75);
        
        const popup = this.add.rectangle(width/2, height/2, width * 0.85, height * 0.45, 0xffffff)
            .setStrokeStyle(4, 0xe74c3c);
            
        const text = this.add.text(width/2, height/2 - 30, 
            'Один менеджер не спасает ситуацию!\nКлиенты по-прежнему ждут ответа.\n\n💸 Потери: -10 клиентов в неделю\n💰 Дополнительные расходы: 30 000₽/мес\n\n❌ Хаос продолжается...', {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        
        const tryAgainBtn = this.add.rectangle(width/2, height/2 + height * 0.12, 200, 50, 0x007acc)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                overlay.destroy();
                popup.destroy();
                text.destroy();
                tryAgainBtn.destroy();
                tryAgainText.destroy();
                
                // Перезапускаем хаос
                this.createBusinessChaos();
            })
            .on('pointerover', () => tryAgainBtn.setFillStyle(0x005fa3))
            .on('pointerout', () => tryAgainBtn.setFillStyle(0x007acc));
            
        const tryAgainText = this.add.text(width/2, height/2 + height * 0.12, 'Попробовать снова', {
            fontSize: Math.floor(Math.min(width, height) * 0.026) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
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
            duration: 500,
            ease: 'Back.easeOut',
            delay: 200
        });
    }
}
