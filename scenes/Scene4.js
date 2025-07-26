class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
    }

    preload() {
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        this.load.on('filecomplete', (key, type, data) => {
            if (type === 'image') {
                const texture = this.textures.get(key);
                if (texture.source[0].image) {
                    texture.source[0].image.style.imageRendering = 'crisp-edges';
                }
            }
        });
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон с золотистым успешным оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(scale);
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        const successOverlay = this.add.rectangle(width/2, height/2, width, height, 0xf39c12, 0.2);
        
        // Радостный персонаж
        const player = this.add.image(width/2 - width * 0.2, height * 0.6, 'player');
        const playerScale = Math.min(width / 800, height / 600) * 0.35;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        this.tweens.add({
            targets: player,
            y: player.y - 12,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок согласно ТЗ
        this.add.text(width/2, height * 0.12, GAME_CONFIG.texts.scene4.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.06) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#e67e22',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Достижения согласно ТЗ
        const achievements = [
            '📈 Ув��личили продажи на 150%',
            '👥 Снизили нагрузку на пе��сонал',
            '⚙️ Автоматизировали воронку',
            '💰 Экономия 30 000₽/месяц'
        ];
        
        achievements.forEach((achievement, index) => {
            this.time.delayedCall(1000 + index * 500, () => {
                const y = height * 0.3 + index * (height * 0.08);
                
                const card = this.add.rectangle(width/2, y, width * 0.8, height * 0.06, 0xffffff, 0.95);
                card.setStrokeStyle(2, 0x27ae60);
                card.setScale(0);
                
                const text = this.add.text(width/2, y, achievement, {
                    fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#2c3e50',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                text.setAlpha(0);
                
                this.tweens.add({
                    targets: card,
                    scale: 1,
                    duration: 400,
                    ease: 'Back.easeOut'
                });
                
                this.tweens.add({
                    targets: text,
                    alpha: 1,
                    duration: 300,
                    delay: 200
                });
            });
        });
        
        // Кнопка к финальной сцене
        this.time.delayedCall(4000, () => {
            const finalBtn = this.add.rectangle(width/2, height * 0.85, 300, 60, 0xe67e22)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    console.log('🚀 Переход к Scene5 (форма лидов)');
                    this.scene.start('Scene5');
                })
                .on('pointerover', () => {
                    finalBtn.setFillStyle(0xd35400);
                    this.tweens.add({ targets: finalBtn, scale: 1.05, duration: 150 });
                })
                .on('pointerout', () => {
                    finalBtn.setFillStyle(0xe67e22);
                    this.tweens.add({ targets: finalBtn, scale: 1, duration: 150 });
                });
                
            const btnText = this.add.text(width/2, height * 0.85, '🚀 Получить такой результат!', {
                fontSize: Math.floor(Math.min(width, height) * 0.03) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.tweens.add({
                targets: [finalBtn, btnText],
                alpha: { from: 0, to: 1 },
                scale: { from: 0.8, to: 1 },
                duration: 600,
                ease: 'Back.easeOut'
            });
        });
    }
}
