class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
    }

    preload() {
        // Используем офисный фон
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Создаем элементы для визуализации автоматизации
        this.load.image('automation-panel', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="240" height="160" xmlns="http://www.w3.org/2000/svg">
                <rect width="240" height="160" fill="#f8f9fa" stroke="#27ae60" stroke-width="3" rx="15"/>
                <rect x="10" y="10" width="220" height="30" fill="#27ae60" rx="5"/>
                <text x="120" y="30" font-family="Arial" font-size="16" text-anchor="middle" fill="#fff">🤖 Автоматизация</text>
                
                <circle cx="60" cy="70" r="20" fill="#e8f5e8" stroke="#27ae60" stroke-width="2"/>
                <text x="60" y="76" font-family="Arial" font-size="24" text-anchor="middle" fill="#27ae60">24</text>
                <text x="60" y="95" font-family="Arial" font-size="10" text-anchor="middle" fill="#666">часа</text>
                
                <circle cx="120" cy="70" r="20" fill="#e8f5e8" stroke="#27ae60" stroke-width="2"/>
                <text x="120" y="76" font-family="Arial" font-size="16" text-anchor="middle" fill="#27ae60">CRM</text>
                <text x="120" y="95" font-family="Arial" font-size="10" text-anchor="middle" fill="#666">интеграция</text>
                
                <circle cx="180" cy="70" r="20" fill="#e8f5e8" stroke="#27ae60" stroke-width="2"/>
                <text x="180" y="76" font-family="Arial" font-size="20" text-anchor="middle" fill="#27ae60">+30%</text>
                <text x="180" y="95" font-family="Arial" font-size="10" text-anchor="middle" fill="#666">заявки</text>
                
                <rect x="15" y="110" width="210" height="40" fill="#e8f5e8" rx="8"/>
                <text x="120" y="125" font-family="Arial" font-size="12" text-anchor="middle" fill="#27ae60">✅ Автоответы работают</text>
                <text x="120" y="140" font-family="Arial" font-size="12" text-anchor="middle" fill="#27ae60">✅ Лиды поступают в CRM</text>
            </svg>
        `));
        
        this.load.image('customer-happy', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="22" fill="#fff" stroke="#27ae60" stroke-width="2"/>
                <circle cx="18" cy="20" r="2" fill="#333"/>
                <circle cx="32" cy="20" r="2" fill="#333"/>
                <path d="M 16 30 Q 25 38 34 30" stroke="#27ae60" stroke-width="2" fill="none"/>
                <text x="25" y="45" font-family="Arial" font-size="8" text-anchor="middle" fill="#27ae60">😊</text>
            </svg>
        `));
        
        this.load.image('growth-arrow', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
            <svg width="60" height="40" xmlns="http://www.w3.org/2000/svg">
                <path d="M 10 35 L 45 5" stroke="#27ae60" stroke-width="3" fill="none"/>
                <polygon points="45,5 40,10 50,10" fill="#27ae60"/>
                <polygon points="45,5 40,15 50,15" fill="#27ae60"/>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с позитивным оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        
        // Позитивный зеленый оверлей показывает, что все хорошо
        const positiveOverlay = this.add.rectangle(width/2, height/2, width, height, 0x27ae60, 0.15);
        
        // Персонаж теперь выглядит довольным и расслабленным
        const player = this.add.image(width/2 - width * 0.2, height * 0.7, 'player');
        const playerScale = Math.min(width / 600, height / 800) * 0.25;
        player.setScale(playerScale);
        
        // Анимация довольства персонажа
        this.tweens.add({
            targets: player,
            scale: playerScale * 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Заголовок
        this.add.text(width/2, height * 0.08, GAME_CONFIG.texts.scene3.title, {
            fontSize: Math.min(width, height) * 0.05 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold',
            stroke: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Описание результатов
        this.add.text(width/2, height * 0.16, GAME_CONFIG.texts.scene3.description, {
            fontSize: Math.min(width, height) * 0.03 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            align: 'center',
            lineSpacing: 8,
            stroke: '#fff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Панель автоматизации
        this.createAutomationPanel(width, height);
        
        // Анимация довольных клиентов
        this.createHappyCustomers(width, height);
        
        // Анимация роста показателей
        this.createGrowthAnimation(width, height);
        
        // График роста
        this.createGrowthChart(width, height);
        
        // Кнопка для перехода появляется через 4 секунды
        this.time.delayedCall(4000, () => {
            this.createContinueButton(width, height);
        });
    }
    
    createAutomationPanel(width, height) {
        const panel = this.add.image(width/2 + width * 0.15, height * 0.4, 'automation-panel');
        const panelScale = Math.min(width, height) / 1000;
        panel.setScale(0);
        
        // Анимация появления панели
        this.tweens.add({
            targets: panel,
            scale: panelScale,
            duration: 1000,
            ease: 'Back.easeOut',
            delay: 500
        });
        
        // Добавляем мигающие индикаторы активности
        this.time.delayedCall(1500, () => {
            for (let i = 0; i < 3; i++) {
                const indicator = this.add.circle(
                    panel.x - 80 + i * 80, 
                    panel.y - 30, 
                    4, 
                    0x00ff88
                );
                
                this.tweens.add({
                    targets: indicator,
                    alpha: { from: 0.3, to: 1 },
                    duration: 800,
                    delay: i * 300,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }
    
    createHappyCustomers(width, height) {
        // Создаем довольных клиентов вокруг экрана
        for (let i = 0; i < 6; i++) {
            this.time.delayedCall(1000 + i * 400, () => {
                const x = Phaser.Math.Between(50, width - 50);
                const y = Phaser.Math.Between(height * 0.3, height * 0.6);
                
                const customer = this.add.image(x, y, 'customer-happy');
                customer.setScale(0);
                customer.setAlpha(0);
                
                // Анимация появления
                this.tweens.add({
                    targets: customer,
                    scale: 0.8,
                    alpha: 1,
                    duration: 500,
                    ease: 'Back.easeOut'
                });
                
                // Плавающая анимация
                this.tweens.add({
                    targets: customer,
                    y: y - 10,
                    duration: 2000,
                    delay: 500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                // Автоисчезновение и появление новых
                this.time.delayedCall(8000, () => {
                    this.tweens.add({
                        targets: customer,
                        alpha: 0,
                        scale: 0,
                        duration: 500,
                        onComplete: () => customer.destroy()
                    });
                });
            });
        }
    }
    
    createGrowthAnimation(width, height) {
        // Анимированные счетчики результатов
        const counters = [
            { x: width * 0.2, y: height * 0.75, from: 0, to: 50, label: 'Заявки в день', color: '#27ae60' },
            { x: width * 0.5, y: height * 0.75, from: 30, to: 80, label: 'Конверсия %', color: '#3498db' },
            { x: width * 0.8, y: height * 0.75, from: 0, to: 24, label: 'Часов работы', color: '#e74c3c' }
        ];
        
        counters.forEach((counter, index) => {
            // Фон для счетчика
            const counterBg = this.add.rectangle(counter.x, counter.y, 120, 80, 0xffffff, 0.9);
            counterBg.setStrokeStyle(2, counter.color);
            counterBg.setAlpha(0);
            
            const numberText = this.add.text(counter.x, counter.y - 10, counter.from.toString(), {
                fontSize: Math.min(width, height) * 0.04 + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: counter.color,
                fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0);
            
            const labelText = this.add.text(counter.x, counter.y + 20, counter.label, {
                fontSize: Math.min(width, height) * 0.02 + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#666'
            }).setOrigin(0.5).setAlpha(0);
            
            // Анимация появления
            this.tweens.add({
                targets: [counterBg, numberText, labelText],
                alpha: 1,
                duration: 500,
                delay: 2000 + index * 300,
                ease: 'Power2'
            });
            
            // Анимация счетчика
            this.tweens.add({
                targets: { value: counter.from },
                value: counter.to,
                duration: 2000,
                delay: 2500 + index * 300,
                ease: 'Power2',
                onUpdate: (tween) => {
                    const current = Math.floor(tween.getValue());
                    numberText.setText(current.toString());
                }
            });
            
            // Стрелка роста
            if (index < 2) { // Только для первых двух счетчиков
                this.time.delayedCall(3000 + index * 300, () => {
                    const arrow = this.add.image(counter.x + 50, counter.y - 30, 'growth-arrow');
                    arrow.setScale(0);
                    
                    this.tweens.add({
                        targets: arrow,
                        scale: 0.8,
                        duration: 400,
                        ease: 'Back.easeOut'
                    });
                });
            }
        });
    }
    
    createGrowthChart(width, height) {
        // Простой анимированный график в правом нижнем углу
        const chartX = width * 0.85;
        const chartY = height * 0.55;
        const chartWidth = 100;
        const chartHeight = 40;
        
        // Фон графика
        const chartBg = this.add.rectangle(chartX, chartY, chartWidth + 20, chartHeight + 20, 0xffffff, 0.9);
        chartBg.setStrokeStyle(2, 0x27ae60);
        chartBg.setAlpha(0);
        
        // Заголовок графика
        const chartTitle = this.add.text(chartX, chartY - chartHeight/2 - 15, '📈 Рост продаж', {
            fontSize: Math.min(width, height) * 0.02 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);
        
        this.tweens.add({
            targets: [chartBg, chartTitle],
            alpha: 1,
            duration: 600,
            delay: 3500
        });
        
        // Оси графика
        this.time.delayedCall(4000, () => {
            const graphics = this.add.graphics();
            graphics.lineStyle(2, 0x666666);
            
            // Ось X
            graphics.moveTo(chartX - chartWidth/2, chartY + chartHeight/2);
            graphics.lineTo(chartX + chartWidth/2, chartY + chartHeight/2);
            
            // Ось Y  
            graphics.moveTo(chartX - chartWidth/2, chartY + chartHeight/2);
            graphics.lineTo(chartX - chartWidth/2, chartY - chartHeight/2);
            
            graphics.stroke();
            
            // Линия роста
            graphics.lineStyle(3, 0x27ae60);
            const points = [
                [chartX - chartWidth/2, chartY + chartHeight/2],
                [chartX - chartWidth/4, chartY + chartHeight/4],
                [chartX, chartY],
                [chartX + chartWidth/4, chartY - chartHeight/4],
                [chartX + chartWidth/2, chartY - chartHeight/2]
            ];
            
            // Анимированное рисование линии
            let currentPoint = 0;
            const drawLine = this.time.addEvent({
                delay: 200,
                repeat: 3,
                callback: () => {
                    if (currentPoint < points.length - 1) {
                        graphics.moveTo(points[currentPoint][0], points[currentPoint][1]);
                        graphics.lineTo(points[currentPoint + 1][0], points[currentPoint + 1][1]);
                        graphics.stroke();
                        currentPoint++;
                    }
                }
            });
        });
    }
    
    createContinueButton(width, height) {
        const continueBtn = this.add.rectangle(width/2, height * 0.92, 250, 50, 0x007acc)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.scene.start('Scene4'))
            .on('pointerover', () => {
                continueBtn.setFillStyle(0x005fa3);
                this.tweens.add({ targets: continueBtn, scale: 1.05, duration: 150 });
            })
            .on('pointerout', () => {
                continueBtn.setFillStyle(0x007acc);
                this.tweens.add({ targets: continueBtn, scale: 1, duration: 150 });
            });
            
        const continueText = this.add.text(width/2, height * 0.92, 'Посмотреть итоги успеха', {
            fontSize: Math.min(width, height) * 0.025 + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Эффект появления кнопки
        continueBtn.setAlpha(0).setScale(0.8);
        continueText.setAlpha(0).setScale(0.8);
        
        this.tweens.add({
            targets: [continueBtn, continueText],
            alpha: 1,
            scale: 1,
            duration: 600,
            ease: 'Back.easeOut'
        });
        
        // Пульсация для привлечения внимания
        this.time.delayedCall(1000, () => {
            this.tweens.add({
                targets: continueBtn,
                scale: { from: 1, to: 1.08 },
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
