class Scene5 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene5' });
    }

    preload() {
        // Используем офисный фон для финальной сцены
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Элементы для финальной презентации
        this.load.image('cta-background', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="ctaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#fff;stop-opacity:0.98" />
                        <stop offset="100%" style="stop-color:#f8f9fa;stop-opacity:0.95" />
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.2"/>
                    </filter>
                </defs>
                <rect width="400" height="300" fill="url(#ctaGrad)" filter="url(#shadow)" rx="20"/>
                <rect x="10" y="10" width="380" height="280" fill="none" stroke="#007acc" stroke-width="3" rx="15"/>
            </svg>
        `));
        
        this.load.image('benefit-icon', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="#27ae60"/>
                <path d="M 6 10 L 9 13 L 15 7" stroke="#fff" stroke-width="2" fill="none"/>
            </svg>
        `));
        
        this.load.image('floating-icon', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="#007acc" opacity="0.8"/>
                <text x="20" y="26" font-family="Arial" font-size="20" text-anchor="middle" fill="#fff">💰</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с финальным профессиональным оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Профессиональный синий оверлей
        const finalOverlay = this.add.rectangle(width/2, height/2, width, height, 0x007acc, 0.1);
        
        // Персонаж в успешной позе
        const player = this.add.image(width/2 - width * 0.25, height * 0.65, 'player');
        const playerScale = Math.min(width / 600, height / 800) * 0.28;
        player.setScale(playerScale);
        
        // Уверенная анимация персонажа
        this.tweens.add({
            targets: player,
            scale: playerScale * 1.02,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Заголовок
        const title = this.add.text(width/2, height * 0.1, GAME_CONFIG.texts.scene5.title, {
            fontSize: Math.min(width, height) * 0.05 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Подзаголовок
        this.add.text(width/2, height * 0.16, GAME_CONFIG.texts.scene5.description, {
            fontSize: Math.min(width, height) * 0.035 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#34495e',
            align: 'center',
            lineSpacing: 8,
            stroke: '#fff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Создаем призыв к действию
        this.createCallToAction(width, height);
        
        // Анимация фона с плавающими элементами
        this.createBackgroundAnimation();
        
        // Добавляем элементы доверия
        this.createTrustElements(width, height);
    }
    
    createCallToAction(width, height) {
        // Основной контейнер CTA
        const ctaContainer = this.add.container(width/2 + width * 0.1, height/2 + height * 0.05);
        
        // Фон дл�� CTA
        const ctaBg = this.add.image(0, 0, 'cta-background');
        const ctaScale = Math.min(width / 1000, height / 800);
        ctaBg.setScale(ctaScale);
        ctaContainer.add(ctaBg);
        
        // Заголовок CTA с эмодзи
        const ctaTitle = this.add.text(0, -height * 0.1, '🎯 ПОЛУЧИТЕ БЕСПЛАТНУЮ КОНСУЛЬТАЦИЮ!', {
            fontSize: Math.min(width, height) * 0.028 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#007acc',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        ctaContainer.add(ctaTitle);
        
        // Подзаголовок
        const ctaSubtitle = this.add.text(0, -height * 0.07, 'Узнайте, как автоматизация поможет именно вашему бизнесу', {
            fontSize: Math.min(width, height) * 0.02 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#666',
            align: 'center'
        }).setOrigin(0.5);
        ctaContainer.add(ctaSubtitle);
        
        // Список преимуществ с улучшенным дизайном
        const benefits = [
            '✅ Увеличение продаж до 150%',
            '✅ Экономия на персонале 30 000₽/мес',
            '✅ Автоматизация работы 24/7',
            '✅ Быстрая окупаемость за 2-3 месяца'
        ];
        
        benefits.forEach((benefit, index) => {
            const benefitContainer = this.add.container(-width * 0.1, -height * 0.03 + index * height * 0.025);
            ctaContainer.add(benefitContainer);
            
            // Иконка галочки
            const checkIcon = this.add.image(-10, 0, 'benefit-icon');
            checkIcon.setScale(0.8);
            benefitContainer.add(checkIcon);
            
            // Текст преимущества
            const benefitText = this.add.text(15, 0, benefit.substring(2), {
                fontSize: Math.min(width, height) * 0.022 + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#2c3e50'
            }).setOrigin(0, 0.5);
            benefitContainer.add(benefitText);
            
            // Анимация появления каждого преимущества
            benefitContainer.setAlpha(0);
            this.tweens.add({
                targets: benefitContainer,
                alpha: 1,
                x: benefitContainer.x + 10,
                duration: 400,
                delay: 1000 + index * 200,
                ease: 'Power2'
            });
        });
        
        // Кнопка "Оставить заявку" с улучшенным дизайном
        const formBtn = this.add.rectangle(0, height * 0.08, 240, 60, 0xe67e22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.showLeadForm())
            .on('pointerover', () => {
                formBtn.setFillStyle(0xd35400);
                this.tweens.add({ targets: formBtn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                formBtn.setFillStyle(0xe67e22);
                this.tweens.add({ targets: formBtn, scale: 1, duration: 150 });
            });
        ctaContainer.add(formBtn);
        
        const formBtnText = this.add.text(0, height * 0.08, '💼 ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ', {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        ctaContainer.add(formBtnText);
        
        // Дополнительная информация под кнопкой
        const additionalInfo = this.add.text(0, height * 0.12, '⏰ Ответим в течение 30 минут\n🔒 Ваши данные защищены', {
            fontSize: Math.min(width, height) * 0.018 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#666',
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5);
        ctaContainer.add(additionalInfo);
        
        // Анимация появления CTA контейнера
        ctaContainer.setAlpha(0).setScale(0.9);
        this.tweens.add({
            targets: ctaContainer,
            alpha: 1,
            scale: 1,
            duration: 800,
            delay: 500,
            ease: 'Back.easeOut'
        });
        
        // Пульсация кнопки для привлечения внимания
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
        
        // Мерцающий эффект на кнопке
        this.time.delayedCall(3500, () => {
            const shimmer = this.add.rectangle(0, height * 0.08, 240, 60, 0xffffff, 0.3);
            ctaContainer.add(shimmer);
            shimmer.setAlpha(0);
            
            this.tweens.add({
                targets: shimmer,
                alpha: { from: 0, to: 0.4 },
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createBackgroundAnimation() {
        const { width, height } = this.scale;
        
        // Плавающие иконки успеха и денег
        const icons = ['💰', '📈', '🤖', '⚡', '🎯', '💪', '🚀', '⭐'];
        
        icons.forEach((icon, index) => {
            this.time.delayedCall(index * 700, () => {
                const x = Phaser.Math.Between(50, width - 50);
                const y = Phaser.Math.Between(50, height - 50);
                
                const iconElement = this.add.image(x, y, 'floating-icon');
                iconElement.setScale(0.6);
                iconElement.setAlpha(0.4);
                
                // Замещаем содержимое иконки
                const iconText = this.add.text(x, y, icon, {
                    fontSize: '20px'
                }).setOrigin(0.5);
                iconText.setAlpha(0.6);
                
                // Плавающая анимация
                this.tweens.add({
                    targets: [iconElement, iconText],
                    y: y + Phaser.Math.Between(-40, 40),
                    duration: Phaser.Math.Between(3000, 5000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                this.tweens.add({
                    targets: [iconElement, iconText],
                    alpha: { from: 0.6, to: 0.2 },
                    duration: Phaser.Math.Between(2000, 4000),
                    yoyo: true,
                    repeat: -1
                });
                
                // Медленное вращение
                this.tweens.add({
                    targets: [iconElement, iconText],
                    rotation: Phaser.Math.PI * 2,
                    duration: 20000,
                    repeat: -1,
                    ease: 'Linear'
                });
            });
        });
    }
    
    createTrustElements(width, height) {
        // Элементы доверия в левой части экрана
        const trustContainer = this.add.container(width * 0.2, height * 0.4);
        
        // Статистика доверия
        const trustStats = [
            { number: '500+', label: 'Довольных клиентов' },
            { number: '24/7', label: 'Поддержка' },
            { number: '2-3 мес', label: 'Окупаемост��' }
        ];
        
        trustStats.forEach((stat, index) => {
            this.time.delayedCall(2000 + index * 500, () => {
                const statContainer = this.add.container(0, index * height * 0.08);
                trustContainer.add(statContainer);
                
                // Число
                const number = this.add.text(0, 0, stat.number, {
                    fontSize: Math.min(width, height) * 0.035 + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#007acc',
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                statContainer.add(number);
                
                // Описание
                const label = this.add.text(0, height * 0.03, stat.label, {
                    fontSize: Math.min(width, height) * 0.02 + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#666'
                }).setOrigin(0.5);
                statContainer.add(label);
                
                // Анимация появления
                statContainer.setAlpha(0).setScale(0.8);
                this.tweens.add({
                    targets: statContainer,
                    alpha: 1,
                    scale: 1,
                    duration: 500,
                    ease: 'Back.easeOut'
                });
            });
        });
    }
    
    showLeadForm() {
        // Анимация затемнения игры
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Показываем HTML форму с улучшенной анимацией
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
            
            // Инициализируем обработку формы
            if (window.initLeadForm) {
                window.initLeadForm();
            }
        });
    }
}
