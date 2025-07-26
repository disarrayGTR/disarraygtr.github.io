class Scene5 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene5' });
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
        
        // Финальный фон с профессиональным оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(scale);
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        const finalOverlay = this.add.rectangle(width/2, height/2, width, height, 0x3498db, 0.15);
        
        // Уверенный персонаж
        const player = this.add.image(width/2 - width * 0.25, height * 0.6, 'player');
        const playerScale = Math.min(width / 800, height / 600) * 0.32;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        this.tweens.add({
            targets: player,
            scale: playerScale * 1.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок согласно ТЗ
        this.add.text(width/2, height * 0.12, GAME_CONFIG.texts.scene5.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.05) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);
        
        // Описание согласно ТЗ
        this.add.text(width/2, height * 0.22, GAME_CONFIG.texts.scene5.description, {
            fontSize: Math.floor(Math.min(width, height) * 0.035) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            lineSpacing: 8,
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Призыв к действию согласно ТЗ
        this.createCallToAction(width, height);
        
        // Статистика доверия
        this.createTrustElements(width, height);
    }
    
    createCallToAction(width, height) {
        // Основной блок CTA
        const ctaX = width/2 + width * 0.1;
        const ctaY = height/2;
        
        // Фон CTA
        const ctaBg = this.add.rectangle(ctaX, ctaY, 350, 280, 0xffffff, 0.98);
        ctaBg.setStrokeStyle(4, 0x3498db);
        ctaBg.setScale(0);
        
        // Заголовок CTA
        const ctaTitle = this.add.text(ctaX, ctaY - 110, '🎯 БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ', {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#3498db',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        ctaTitle.setAlpha(0);
        
        // Преимущества
        const benefits = [
            '✅ Увеличение продаж до 150%',
            '✅ Экономия 30 000₽/месяц',
            '✅ Автоматизация 24/7',
            '✅ Окупаемость за 2-3 месяца'
        ];
        
        const benefitTexts = [];
        benefits.forEach((benefit, index) => {
            const text = this.add.text(ctaX - 120, ctaY - 60 + index * 30, benefit, {
                fontSize: Math.floor(Math.min(width, height) * 0.024) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#2c3e50'
            }).setOrigin(0, 0.5);
            text.setAlpha(0);
            benefitTexts.push(text);
        });
        
        // Кнопка "Оставить заявку" согласно ТЗ
        const formBtn = this.add.rectangle(ctaX, ctaY + 80, 280, 60, 0xe74c3c)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showLeadForm())
            .on('pointerover', () => {
                formBtn.setFillStyle(0xc0392b);
                this.tweens.add({ targets: formBtn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                formBtn.setFillStyle(0xe74c3c);
                this.tweens.add({ targets: formBtn, scale: 1, duration: 150 });
            });
        formBtn.setAlpha(0);
        
        const formBtnText = this.add.text(ctaX, ctaY + 80, '💼 ОСТАВИТЬ ЗАЯВКУ', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        formBtnText.setAlpha(0);
        
        // Дополнительная информация
        const additionalInfo = this.add.text(ctaX, ctaY + 125, '⏰ Ответим в течение 30 минут\n🔒 Ваши данные защищены', {
            fontSize: Math.floor(Math.min(width, height) * 0.02) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#7f8c8d',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        additionalInfo.setAlpha(0);
        
        // Анимация появления CTA
        this.tweens.add({
            targets: ctaBg,
            scale: 1,
            duration: 800,
            delay: 500,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: ctaTitle,
            alpha: 1,
            duration: 600,
            delay: 800
        });
        
        benefitTexts.forEach((text, index) => {
            this.tweens.add({
                targets: text,
                alpha: 1,
                x: text.x + 10,
                duration: 400,
                delay: 1200 + index * 200
            });
        });
        
        this.tweens.add({
            targets: [formBtn, formBtnText, additionalInfo],
            alpha: 1,
            duration: 600,
            delay: 2500
        });
        
        // Пульсация кнопки
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: formBtn,
                scale: { from: 1, to: 1.08 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createTrustElements(width, height) {
        // Элементы доверия слева
        const trustStats = [
            { number: '500+', label: 'Довольных клиентов' },
            { number: '24/7', label: 'Поддержка' },
            { number: '2-3 мес', label: 'Окупаемость' }
        ];
        
        trustStats.forEach((stat, index) => {
            this.time.delayedCall(1500 + index * 400, () => {
                const x = width * 0.2;
                const y = height * 0.4 + index * height * 0.1;
                
                const bg = this.add.rectangle(x, y, 160, 70, 0xffffff, 0.9);
                bg.setStrokeStyle(2, 0x3498db);
                bg.setScale(0);
                
                const number = this.add.text(x, y - 10, stat.number, {
                    fontSize: Math.floor(Math.min(width, height) * 0.04) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#3498db',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                number.setAlpha(0);
                
                const label = this.add.text(x, y + 20, stat.label, {
                    fontSize: Math.floor(Math.min(width, height) * 0.022) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#2c3e50'
                }).setOrigin(0.5);
                label.setAlpha(0);
                
                this.tweens.add({
                    targets: bg,
                    scale: 1,
                    duration: 400,
                    ease: 'Back.easeOut'
                });
                
                this.tweens.add({
                    targets: [number, label],
                    alpha: 1,
                    duration: 300,
                    delay: 200
                });
            });
        });
    }
    
    showLeadForm() {
        // Анимация затемнения игры согласно ТЗ
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Показываем HTML форму согласно ТЗ: "Форма: Имя, Телефон, Email"
            const formElement = document.getElementById('leadForm');
            formElement.style.display = 'block';
            formElement.style.opacity = '0';
            formElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
            
            // Анимация появления формы
            setTimeout(() => {
                formElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                formElement.style.opacity = '1';
                formElement.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 100);
            
            // Инициализируем обработку формы согласно ТЗ: "Отправка данных в Telegram-бота"
            if (window.initLeadForm) {
                window.initLeadForm();
            }
        });
    }
}
