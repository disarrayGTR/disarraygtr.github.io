class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
    }

    preload() {
        // Используем офисный фон
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Элементы для празднования успеха
        this.load.image('success-badge', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#ffb347;stop-opacity:1" />
                    </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="45" fill="url(#goldGrad)" stroke="#ff8c00" stroke-width="3"/>
                <star cx="50" cy="50" points="50,15 58,35 80,35 62,50 70,70 50,58 30,70 38,50 20,35 42,35" fill="#fff"/>
                <text x="50" y="85" font-family="Arial" font-size="12" text-anchor="middle" fill="#ff8c00" font-weight="bold">SUCCESS</text>
            </svg>
        `));
        
        this.load.image('trophy', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="60" height="80" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="60" width="20" height="20" fill="#8b4513"/>
                <ellipse cx="30" cy="40" rx="15" ry="20" fill="#ffd700" stroke="#ff8c00" stroke-width="2"/>
                <ellipse cx="10" cy="35" rx="8" ry="10" fill="#ffd700" stroke="#ff8c00" stroke-width="1"/>
                <ellipse cx="50" cy="35" rx="8" ry="10" fill="#ffd700" stroke="#ff8c00" stroke-width="1"/>
                <text x="30" y="46" font-family="Arial" font-size="16" text-anchor="middle" fill="#ff8c00">🏆</text>
            </svg>
        `));
        
        this.load.image('achievement-card', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="300" height="80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style="stop-color:#fff;stop-opacity:0.95" />
                        <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:0.95" />
                    </linearGradient>
                </defs>
                <rect width="300" height="80" fill="url(#cardGrad)" stroke="#27ae60" stroke-width="2" rx="10"/>
                <circle cx="40" cy="40" r="25" fill="#27ae60" opacity="0.1"/>
                <rect x="80" y="15" width="200" height="50" fill="transparent"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с золотистым успешным оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Золотистый оверлей успеха
        const successOverlay = this.add.rectangle(width/2, height/2, width, height, 0xffd700, 0.2);
        
        // Персонаж теперь радостный и успешный
        const player = this.add.image(width/2 - width * 0.2, height * 0.65, 'player');
        const playerScale = Math.min(width / 600, height / 800) * 0.3;
        player.setScale(playerScale);
        
        // Анимация радости персонажа
        this.tweens.add({
            targets: player,
            y: player.y - 15,
            rotation: { from: -0.05, to: 0.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок с анимацией
        const title = this.add.text(width/2, height * 0.1, GAME_CONFIG.texts.scene4.title, {
            fontSize: Math.min(width, height) * 0.055 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#e67e22',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0);
        
        this.tweens.add({
            targets: title,
            alpha: 1,
            y: height * 0.08,
            scale: { from: 0.8, to: 1 },
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Создаем праздничную анимацию
        this.createCelebrationAnimation();
        
        // Показываем значок успеха
        this.createSuccessBadge(width, height);
        
        // Показываем достижения
        this.showAchievements(width, height);
        
        // Кнопка для перехода к форме
        this.time.delayedCall(5000, () => {
            this.createFinalButton(width, height);
        });
    }
    
    createCelebrationAnimation() {
        const { width, height } = this.scale;
        
        // Конфетти различных цветов
        for (let i = 0; i < 30; i++) {
            this.time.delayedCall(i * 100, () => {
                const x = Phaser.Math.Between(0, width);
                const y = -20;
                const colors = [0xffd700, 0xff6b35, 0x007acc, 0x27ae60, 0xe74c3c, 0x9b59b6];
                const color = Phaser.Math.RND.pick(colors);
                
                const confetti = this.add.circle(x, y, Phaser.Math.Between(2, 5), color);
                
                this.tweens.add({
                    targets: confetti,
                    y: height + 20,
                    x: x + Phaser.Math.Between(-100, 100),
                    rotation: Phaser.Math.PI * 6,
                    duration: Phaser.Math.Between(2000, 4000),
                    onComplete: () => confetti.destroy()
                });
            });
        }
        
        // Звездочки появляются в случайных местах
        for (let i = 0; i < 15; i++) {
            this.time.delayedCall(500 + i * 300, () => {
                this.createStar();
            });
        }
        
        // Пузыри успеха
        for (let i = 0; i < 10; i++) {
            this.time.delayedCall(1000 + i * 400, () => {
                this.createSuccessBubble();
            });
        }
    }
    
    createStar() {
        const { width, height } = this.scale;
        const x = Phaser.Math.Between(50, width - 50);
        const y = Phaser.Math.Between(50, height - 100);
        
        const star = this.add.star(x, y, 5, 8, 16, 0xffd700).setAlpha(0);
        
        this.tweens.add({
            targets: star,
            alpha: 1,
            scale: { from: 0, to: 1.2 },
            rotation: Phaser.Math.PI,
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: star,
            alpha: 0,
            scale: 0,
            delay: 2000,
            duration: 500,
            onComplete: () => star.destroy()
        });
    }
    
    createSuccessBubble() {
        const { width, height } = this.scale;
        const x = Phaser.Math.Between(50, width - 50);
        const y = height;
        
        const bubble = this.add.circle(x, y, Phaser.Math.Between(15, 25), 0xffffff, 0.6);
        bubble.setStrokeStyle(2, 0xffd700);
        
        this.tweens.add({
            targets: bubble,
            y: -50,
            alpha: { from: 0.6, to: 0 },
            scale: { from: 1, to: 1.5 },
            duration: 3000,
            onComplete: () => bubble.destroy()
        });
    }
    
    createSuccessBadge(width, height) {
        const badge = this.add.image(width/2 + width * 0.15, height * 0.3, 'success-badge');
        badge.setScale(0);
        
        this.tweens.add({
            targets: badge,
            scale: 1.2,
            duration: 800,
            delay: 1000,
            ease: 'Elastic.easeOut'
        });
        
        // Пульсация значка
        this.time.delayedCall(2000, () => {
            this.tweens.add({
                targets: badge,
                scale: { from: 1.2, to: 1.3 },
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Трофе�� рядом с персонажем
        this.time.delayedCall(1500, () => {
            const trophy = this.add.image(width/2 - width * 0.1, height * 0.5, 'trophy');
            trophy.setScale(0);
            
            this.tweens.add({
                targets: trophy,
                scale: 1,
                duration: 600,
                ease: 'Back.easeOut'
            });
            
            // Вращение трофея
            this.tweens.add({
                targets: trophy,
                rotation: { from: -0.1, to: 0.1 },
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    showAchievements(width, height) {
        const achievements = [
            { icon: '📈', text: 'Увеличили продажи', value: '+150%', color: '#27ae60' },
            { icon: '👥', text: 'Снизили нагрузку на персонал', value: '-60%', color: '#3498db' },
            { icon: '⚙️', text: 'Автоматизировали воронку', value: '100%', color: '#9b59b6' },
            { icon: '💰', text: 'Экономия на зарплатах', value: '30 000₽', color: '#e67e22' }
        ];
        
        achievements.forEach((achievement, index) => {
            this.time.delayedCall(2000 + index * 600, () => {
                const y = height * 0.45 + index * (height * 0.08);
                const cardX = width/2;
                
                // Фон достижения
                const card = this.add.image(cardX, y, 'achievement-card');
                const cardScale = Math.min(width / 800, 1);
                card.setScale(0, cardScale);
                
                // Иконка
                const icon = this.add.text(cardX - width * 0.12, y, achievement.icon, {
                    fontSize: Math.min(width, height) * 0.04 + 'px'
                }).setOrigin(0.5).setAlpha(0);
                
                // Текст достижения
                const text = this.add.text(cardX - width * 0.05, y - height * 0.01, achievement.text, {
                    fontSize: Math.min(width, height) * 0.025 + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#2c3e50',
                    fontStyle: 'bold'
                }).setOrigin(0, 0.5).setAlpha(0);
                
                // Значение
                const value = this.add.text(cardX + width * 0.08, y, achievement.value, {
                    fontSize: Math.min(width, height) * 0.03 + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: achievement.color,
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);
                
                // Анимация появления карточки
                this.tweens.add({
                    targets: card,
                    scaleX: cardScale,
                    duration: 400,
                    ease: 'Back.easeOut'
                });
                
                // Анимация появления содержимого
                this.tweens.add({
                    targets: [icon, text, value],
                    alpha: 1,
                    x: `+=${10}`,
                    duration: 500,
                    delay: 200,
                    ease: 'Power2'
                });
                
                // Эффект "награды" для каждого достижения
                this.time.delayedCall(300, () => {
                    const sparkle = this.add.circle(cardX + width * 0.12, y, 8, 0xffd700);
                    sparkle.setAlpha(0);
                    
                    this.tweens.add({
                        targets: sparkle,
                        alpha: 1,
                        scale: 2,
                        duration: 300
                    });
                    
                    this.tweens.add({
                        targets: sparkle,
                        alpha: 0,
                        scale: 0,
                        delay: 300,
                        duration: 400,
                        onComplete: () => sparkle.destroy()
                    });
                });
            });
        });
    }
    
    createFinalButton(width, height) {
        const finalBtn = this.add.rectangle(width/2, height * 0.88, 280, 60, 0xe67e22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Scene5'))
            .on('pointerover', () => {
                finalBtn.setFillStyle(0xd35400);
                this.tweens.add({ targets: finalBtn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                finalBtn.setFillStyle(0xe67e22);
                this.tweens.add({ targets: finalBtn, scale: 1, duration: 150 });
            })
            .setAlpha(0);
            
        const btnText = this.add.text(width/2, height * 0.88, '🚀 Заказать такого бота!', {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        // Ани��ация появления кнопки
        this.tweens.add({
            targets: [finalBtn, btnText],
            alpha: 1,
            scale: { from: 0.8, to: 1 },
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Привлекающая пульсация
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: finalBtn,
                scale: { from: 1, to: 1.08 },
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Добавляем мерцающий эффект
        this.time.delayedCall(1500, () => {
            const shimmer = this.add.rectangle(width/2, height * 0.88, 280, 60, 0xffffff, 0.3);
            shimmer.setAlpha(0);
            
            this.tweens.add({
                targets: shimmer,
                alpha: { from: 0, to: 0.4 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
