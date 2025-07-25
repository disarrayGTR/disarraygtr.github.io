class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
    }

    preload() {
        // Создаем графику успеха
        this.load.image('success-bg', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.3" />
                        <stop offset="100%" style="stop-color:#ffef99;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#successGrad)"/>
                <circle cx="200" cy="150" r="40" fill="#ffd700" opacity="0.6"/>
                <circle cx="600" cy="200" r="30" fill="#ffd700" opacity="0.4"/>
                <circle cx="700" cy="400" r="25" fill="#ffd700" opacity="0.5"/>
                <circle cx="100" cy="350" r="35" fill="#ffd700" opacity="0.3"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон
        this.add.image(width/2, height/2, 'success-bg').setDisplaySize(width, height);
        
        // Заголовок с анимацией
        const title = this.add.text(width/2, 80, GAME_CONFIG.texts.scene4.title, {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ff6b35',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        this.tweens.add({
            targets: title,
            alpha: 1,
            y: 60,
            duration: 1000,
            ease: 'Back.easeOut'
        });
        
        // Создаем праздничную анимацию
        this.createCelebrationAnimation();
        
        // Показываем достижения
        this.showAchievements(width, height);
        
        // Кнопка для перехода к форме
        this.time.delayedCall(5000, () => {
            this.createFinalButton(width, height);
        });
    }
    
    createCelebrationAnimation() {
        // Конфетти
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = -20;
            const color = Phaser.Math.RND.pick([0xffd700, 0xff6b35, 0x007acc, 0x28a745]);
            
            const confetti = this.add.circle(x, y, 3, color);
            
            this.tweens.add({
                targets: confetti,
                y: this.scale.height + 20,
                x: x + Phaser.Math.Between(-50, 50),
                rotation: Phaser.Math.PI * 4,
                duration: Phaser.Math.Between(2000, 4000),
                delay: i * 100,
                onComplete: () => confetti.destroy()
            });
        }
        
        // Звездочки
        for (let i = 0; i < 10; i++) {
            this.time.delayedCall(i * 300, () => {
                this.createStar();
            });
        }
    }
    
    createStar() {
        const x = Phaser.Math.Between(100, this.scale.width - 100);
        const y = Phaser.Math.Between(100, this.scale.height - 200);
        
        const star = this.add.star(x, y, 5, 10, 20, 0xffd700).setAlpha(0);
        
        this.tweens.add({
            targets: star,
            alpha: 1,
            scale: 1.5,
            duration: 500,
            yoyo: true,
            onComplete: () => star.destroy()
        });
    }
    
    showAchievements(width, height) {
        const achievements = [
            { icon: '📈', text: 'Увеличили продажи', value: '+150%' },
            { icon: '👥', text: 'Снизили нагрузку на персонал', value: '-60%' },
            { icon: '⚙️', text: 'Автоматизировали воронку', value: '100%' },
            { icon: '💰', text: 'Экономия на зарплатах', value: '30 000₽' }
        ];
        
        achievements.forEach((achievement, index) => {
            this.time.delayedCall(1500 + index * 800, () => {
                const y = 180 + index * 60;
                
                // Фон достижения
                const bg = this.add.rectangle(width/2, y, 400, 50, 0xffffff, 0.9)
                    .setStrokeStyle(2, 0x28a745)
                    .setAlpha(0);
                
                // Иконка
                const icon = this.add.text(width/2 - 170, y, achievement.icon, {
                    fontSize: '24px'
                }).setOrigin(0.5).setAlpha(0);
                
                // Текст
                const text = this.add.text(width/2 - 50, y, achievement.text, {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#333'
                }).setOrigin(0, 0.5).setAlpha(0);
                
                // Значение
                const value = this.add.text(width/2 + 150, y, achievement.value, {
                    fontSize: '18px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#28a745',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setAlpha(0);
                
                // Анимация появления
                this.tweens.add({
                    targets: [bg, icon, text, value],
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2'
                });
                
                // Эффект всплытия
                [bg, icon, text, value].forEach(element => {
                    element.y += 20;
                    this.tweens.add({
                        targets: element,
                        y: y,
                        duration: 500,
                        ease: 'Back.easeOut'
                    });
                });
            });
        });
    }
    
    createFinalButton(width, height) {
        const finalBtn = this.add.rectangle(width/2, height - 80, 250, 60, 0xff6b35)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Scene5'))
            .on('pointerover', () => finalBtn.setFillStyle(0xdd5530))
            .on('pointerout', () => finalBtn.setFillStyle(0xff6b35))
            .setAlpha(0);
            
        const btnText = this.add.text(width/2, height - 80, 'Заказать такого бота!', {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        // Анимация появления кнопки
        this.tweens.add({
            targets: [finalBtn, btnText],
            alpha: 1,
            scale: { from: 0.8, to: 1 },
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Пульсация кнопки
        this.tweens.add({
            targets: finalBtn,
            scale: { from: 1, to: 1.05 },
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
