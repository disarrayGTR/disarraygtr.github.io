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
        this.add.text(width/2, height * 0.08, 'Хотите такую игру под свой бизнес?', {
            fontSize: Math.floor(Math.min(width, height) * 0.05) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5);

        // Подзаголовок
        this.add.text(width/2, height * 0.15, 'Закажите чат-бота для своего бизнеса!', {
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

        // Резервная кнопка для тестирования (если основная не работает)
        this.time.delayedCall(3000, () => {
            const testBtn = this.add.rectangle(width * 0.9, height * 0.1, 120, 40, 0xff6b35)
                .setInteractive({ useHandCursor: true })
                .on('pointerdown', () => {
                    console.log('🔧 Тестовая кнопка нажата!');
                    this.showLeadForm();
                });

            this.add.text(width * 0.9, height * 0.1, 'ТЕСТ ФОРМЫ', {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        });

        // Автоматический переход к форме через 15 секунд, если пользователь не нажал кнопку
        this.time.delayedCall(15000, () => {
            console.log('⏰ Автоматический переход к форме через 15 секунд');
            const hint = this.add.text(width/2, height * 0.95, 'Нажмите на кнопку выше для заказа ↑', {
                fontSize: Math.floor(Math.min(width, height) * 0.025) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#e74c3c',
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5);

            // Мигание подсказки
            this.tweens.add({
                targets: hint,
                alpha: { from: 1, to: 0.3 },
                duration: 600,
                yoyo: true,
                repeat: -1
            });
        });
    }
    
    createCallToAction(width, height) {
        // Центральный блок CTA
        const ctaX = width/2;
        const ctaY = height * 0.45;

        // Фон CTA
        const ctaBg = this.add.rectangle(ctaX, ctaY, Math.min(width * 0.9, 400), 300, 0xffffff, 0.98);
        ctaBg.setStrokeStyle(4, 0xe74c3c);
        ctaBg.setScale(0);

        // Заголовок CTA
        const ctaTitle = this.add.text(ctaX, ctaY - 120, '🎯 БЕСПЛАТНАЯ КОНСУЛЬТАЦИЯ', {
            fontSize: Math.floor(Math.min(width, height) * 0.035) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#e74c3c',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        ctaTitle.setAlpha(0);

        // Основное предложение
        const mainOffer = this.add.text(ctaX, ctaY - 80, 'Узнайте, как автоматизация\nповысит ваши продажи на 150%', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            align: 'center',
            lineSpacing: 5
        }).setOrigin(0.5);
        mainOffer.setAlpha(0);

        // Преимущества в более компактном виде
        const benefits = [
            '✅ Экономия 30 000₽/месяц на персонале',
            '✅ Автоматизация работы 24/7',
            '✅ Быстрая окупаемость за 2-3 месяца'
        ];

        const benefitTexts = [];
        benefits.forEach((benefit, index) => {
            const text = this.add.text(ctaX, ctaY - 30 + index * 25, benefit, {
                fontSize: Math.floor(Math.min(width, height) * 0.024) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#27ae60',
                align: 'center'
            }).setOrigin(0.5);
            text.setAlpha(0);
            benefitTexts.push(text);
        });

        // БОЛЬШАЯ заметная кнопка "Оставить заявку" согласно ТЗ
        const formBtn = this.add.rectangle(ctaX, ctaY + 80, 320, 70, 0xe74c3c)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log('🎯 Кнопка "Оставить заявку" нажата!');
                this.showLeadForm();
            })
            .on('pointerover', () => {
                formBtn.setFillStyle(0xc0392b);
                this.tweens.add({ targets: formBtn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                formBtn.setFillStyle(0xe74c3c);
                this.tweens.add({ targets: formBtn, scale: 1, duration: 150 });
            });
        formBtn.setAlpha(0);

        const formBtnText = this.add.text(ctaX, ctaY + 80, '📝 ОСТАВИТЬ ЗАЯВКУ', {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        formBtnText.setAlpha(0);

        // Дополнительная информация
        const additionalInfo = this.add.text(ctaX, ctaY + 125, '⏰ Ответим в течение 30 минут • 🔒 Данные защищены', {
            fontSize: Math.floor(Math.min(width, height) * 0.02) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#7f8c8d',
            align: 'center'
        }).setOrigin(0.5);
        additionalInfo.setAlpha(0);

        // Анимация появления CTA
        this.tweens.add({
            targets: ctaBg,
            scale: 1,
            duration: 800,
            delay: 300,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: ctaTitle,
            alpha: 1,
            duration: 600,
            delay: 600
        });

        this.tweens.add({
            targets: mainOffer,
            alpha: 1,
            duration: 600,
            delay: 900
        });

        benefitTexts.forEach((text, index) => {
            this.tweens.add({
                targets: text,
                alpha: 1,
                duration: 400,
                delay: 1200 + index * 200
            });
        });

        this.tweens.add({
            targets: [formBtn, formBtnText],
            alpha: 1,
            scale: { from: 0.9, to: 1 },
            duration: 600,
            delay: 2000,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: additionalInfo,
            alpha: 1,
            duration: 400,
            delay: 2300
        });

        // Привлекающая пульсация кнопки
        this.time.delayedCall(2500, () => {
            this.tweens.add({
                targets: formBtn,
                scale: { from: 1, to: 1.1 },
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Дополнительное мерцание для привлечения внимания
        this.time.delayedCall(3000, () => {
            const shimmer = this.add.rectangle(ctaX, ctaY + 80, 320, 70, 0xffffff, 0.4);
            shimmer.setAlpha(0);

            this.tweens.add({
                targets: shimmer,
                alpha: { from: 0, to: 0.6 },
                duration: 800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createTrustElements(width, height) {
        // Простая строка доверия внизу экрана
        const trustLine = this.add.text(width/2, height * 0.9,
            '⭐ 500+ довольных клиентов • 📞 24/7 поддержка • ⚡ Окупаемость 2-3 месяца', {
            fontSize: Math.floor(Math.min(width, height) * 0.022) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#7f8c8d',
            align: 'center'
        }).setOrigin(0.5);

        trustLine.setAlpha(0);

        this.tweens.add({
            targets: trustLine,
            alpha: 0.8,
            duration: 600,
            delay: 1000
        });
    }
    
    showLeadForm() {
        console.log('🎯 Переход к форме лидов...');

        // Анимация затемнения игры согласно ТЗ
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            console.log('📋 Показываем форму лидов согласно ТЗ');

            // Показываем HTML форму согласно ТЗ: "Форма: Имя, Телефон, Email"
            const formElement = document.getElementById('leadForm');

            if (!formElement) {
                console.error('❌ Форма не найдена! Проверьте HTML.');
                return;
            }

            console.log('✅ Форма найдена, отображаем...');

            // Показываем форму
            formElement.style.display = 'block';
            formElement.style.opacity = '0';
            formElement.style.transform = 'translate(-50%, -50%) scale(0.9)';
            formElement.style.zIndex = '2000';

            // Анимация появления формы
            setTimeout(() => {
                formElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                formElement.style.opacity = '1';
                formElement.style.transform = 'translate(-50%, -50%) scale(1)';
                console.log('🎨 Форма анимирована и показана');
            }, 100);

            // Инициализируем обработку формы согласно ТЗ: "Отправка данных в Telegram-бота"
            if (window.initLeadForm) {
                console.log('🔧 Инициализируем обработку формы');
                window.initLeadForm();
            } else {
                console.warn('⚠️ Функция initLeadForm не найдена');
            }
        });
    }
}
