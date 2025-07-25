class Scene5 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene5' });
    }

    preload() {
        // Создаем графику для финальной сцены
        this.load.image('final-bg', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="finalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#007acc;stop-opacity:0.1" />
                        <stop offset="100%" style="stop-color:#ff6b35;stop-opacity:0.1" />
                    </linearGradient>
                </defs>
                <rect width="800" height="600" fill="url(#finalGrad)"/>
                <circle cx="400" cy="300" r="200" fill="none" stroke="#007acc" stroke-width="2" opacity="0.3"/>
                <circle cx="400" cy="300" r="150" fill="none" stroke="#ff6b35" stroke-width="2" opacity="0.4"/>
                <circle cx="400" cy="300" r="100" fill="none" stroke="#28a745" stroke-width="2" opacity="0.5"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон
        this.add.image(width/2, height/2, 'final-bg').setDisplaySize(width, height);
        
        // Заголовок
        const title = this.add.text(width/2, 100, GAME_CONFIG.texts.scene5.title, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Описание
        this.add.text(width/2, 160, GAME_CONFIG.texts.scene5.description, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#555',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        // Создаем призыв к действию
        this.createCallToAction(width, height);
        
        // Анимация фона
        this.createBackgroundAnimation();
    }
    
    createCallToAction(width, height) {
        // Контейнер для CTA
        const ctaContainer = this.add.container(width/2, height/2 + 50);
        
        // Фон для CTA
        const ctaBg = this.add.rectangle(0, 0, 350, 200, 0xffffff, 0.95)
            .setStrokeStyle(3, 0x007acc);
        ctaContainer.add(ctaBg);
        
        // Заголовок CTA
        const ctaTitle = this.add.text(0, -70, 'Получите БЕСПЛАТНУЮ консультацию!', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#007acc',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        ctaContainer.add(ctaTitle);
        
        // Список преимуществ
        const benefits = [
            '✓ Увеличение продаж до 150%',
            '✓ Экономия на персонале 30 000₽/мес',
            '✓ Автоматизация 24/7',
            '✓ Быстрая окупаемость'
        ];
        
        benefits.forEach((benefit, index) => {
            const benefitText = this.add.text(-120, -30 + index * 20, benefit, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#28a745'
            }).setOrigin(0, 0.5);
            ctaContainer.add(benefitText);
        });
        
        // Кнопка "Оставить заявку"
        const formBtn = this.add.rectangle(0, 70, 200, 50, 0xff6b35)
            .setInteractive()
            .on('pointerdown', () => this.showLeadForm())
            .on('pointerover', () => formBtn.setFillStyle(0xdd5530))
            .on('pointerout', () => formBtn.setFillStyle(0xff6b35));
        ctaContainer.add(formBtn);
        
        const formBtnText = this.add.text(0, 70, 'Оставить заявку', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        ctaContainer.add(formBtnText);
        
        // Анимация появления CTA
        ctaContainer.setAlpha(0).setScale(0.8);
        this.tweens.add({
            targets: ctaContainer,
            alpha: 1,
            scale: 1,
            duration: 800,
            ease: 'Back.easeOut'
        });
        
        // Пульсация кнопки
        this.tweens.add({
            targets: formBtn,
            scale: { from: 1, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createBackgroundAnimation() {
        // Плавающие иконки
        const icons = ['💰', '📈', '🤖', '⚡', '🎯', '💪'];
        
        icons.forEach((icon, index) => {
            this.time.delayedCall(index * 500, () => {
                const x = Phaser.Math.Between(50, this.scale.width - 50);
                const y = Phaser.Math.Between(50, this.scale.height - 50);
                
                const iconText = this.add.text(x, y, icon, {
                    fontSize: '24px'
                }).setAlpha(0.6);
                
                // Плавающая анимация
                this.tweens.add({
                    targets: iconText,
                    y: y + Phaser.Math.Between(-30, 30),
                    duration: Phaser.Math.Between(2000, 4000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                this.tweens.add({
                    targets: iconText,
                    alpha: { from: 0.6, to: 0.3 },
                    duration: Phaser.Math.Between(1500, 3000),
                    yoyo: true,
                    repeat: -1
                });
            });
        });
    }
    
    showLeadForm() {
        // Скрываем игру и показываем форму
        this.cameras.main.fadeOut(300, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Показываем HTML форму
            document.getElementById('leadForm').style.display = 'block';
            
            // Инициализируем обработку формы
            if (window.initLeadForm) {
                window.initLeadForm();
            }
        });
    }
}
