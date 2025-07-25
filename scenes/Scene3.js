class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
    }

    preload() {
        // Создаем графику для автоматизации
        this.load.image('automation-bg', 'data:image/svg+xml;base64,' + btoa(`
            <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                <rect width="800" height="600" fill="#f0fff0"/>
                <rect x="50" y="100" width="200" height="120" fill="#e8f5e8" stroke="#28a745" stroke-width="2" rx="10"/>
                <rect x="300" y="100" width="200" height="120" fill="#e8f5e8" stroke="#28a745" stroke-width="2" rx="10"/>
                <rect x="550" y="100" width="200" height="120" fill="#e8f5e8" stroke="#28a745" stroke-width="2" rx="10"/>
                <text x="150" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#28a745">24/7</text>
                <text x="400" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#28a745">CRM</text>
                <text x="650" y="140" font-family="Arial" font-size="14" text-anchor="middle" fill="#28a745">+30%</text>
            </svg>
        `));
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон
        this.add.image(width/2, height/2, 'automation-bg').setDisplaySize(width, height);

        // Добавляем текстовые метки для блоков автоматизации
        const labelStyle = {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#28a745'
        };

        this.add.text(150 * (width/800), 160 * (height/600), 'Ответы', labelStyle).setOrigin(0.5);
        this.add.text(400 * (width/800), 160 * (height/600), 'Интеграция', labelStyle).setOrigin(0.5);
        this.add.text(650 * (width/800), 160 * (height/600), 'Заявки', labelStyle).setOrigin(0.5);

        // Заголовок
        this.add.text(width/2, 60, GAME_CONFIG.texts.scene3.title, {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#28a745',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Описание результатов
        this.add.text(width/2, 300, GAME_CONFIG.texts.scene3.description, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#333',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        // Анимация роста
        this.createGrowthAnimation();
        
        // График роста
        this.createGrowthChart(width, height);
        
        // Кнопка для перехода
        this.time.delayedCall(4000, () => {
            this.createContinueButton(width, height);
        });
    }
    
    createGrowthAnimation() {
        // Ани��ированные счетчики
        const counters = [
            { x: 150, y: 380, from: 0, to: 50, label: 'Заявки в день' },
            { x: 400, y: 380, from: 30, to: 80, label: 'Конверсия %' },
            { x: 650, y: 380, from: 0, to: 24, label: 'Часов работы' }
        ];
        
        counters.forEach((counter, index) => {
            const numberText = this.add.text(counter.x, counter.y, counter.from.toString(), {
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                fill: '#28a745',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            const labelText = this.add.text(counter.x, counter.y + 30, counter.label, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#666'
            }).setOrigin(0.5);
            
            // Анимация счетчика
            this.tweens.add({
                targets: { value: counter.from },
                value: counter.to,
                duration: 2000,
                delay: index * 500,
                ease: 'Power2',
                onUpdate: (tween) => {
                    const current = Math.floor(tween.getValue());
                    numberText.setText(current.toString());
                }
            });
        });
    }
    
    createGrowthChart(width, height) {
        // Простой график роста
        const chartX = width/2;
        const chartY = height - 100;
        const chartWidth = 200;
        const chartHeight = 60;
        
        // Оси
        this.add.line(chartX, chartY, -chartWidth/2, 0, chartWidth/2, 0, 0x666666, 2);
        this.add.line(chartX, chartY, -chartWidth/2, 0, -chartWidth/2, -chartHeight, 0x666666, 2);
        
        // Линия роста
        const points = [];
        for (let i = 0; i <= 10; i++) {
            const x = chartX - chartWidth/2 + (i * chartWidth/10);
            const y = chartY - (i * i * chartHeight/100); // Квадратичный рост
            points.push(x, y);
        }
        
        // Анимированное рисование линии
        const graphics = this.add.graphics();
        graphics.lineStyle(3, 0x28a745);
        
        let currentPoint = 0;
        const drawLine = this.time.addEvent({
            delay: 100,
            repeat: 9,
            callback: () => {
                if (currentPoint < points.length - 2) {
                    graphics.lineBetween(points[currentPoint], points[currentPoint + 1], 
                                      points[currentPoint + 2], points[currentPoint + 3]);
                    currentPoint += 2;
                }
            }
        });
        
        this.add.text(chartX, chartY + 20, 'Рост продаж', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#666'
        }).setOrigin(0.5);
    }
    
    createContinueButton(width, height) {
        const continueBtn = this.add.rectangle(width/2, height - 40, 200, 50, 0x007acc)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('Scene4'))
            .on('pointerover', () => continueBtn.setFillStyle(0x005fa3))
            .on('pointerout', () => continueBtn.setFillStyle(0x007acc));
            
        this.add.text(width/2, height - 40, 'Посмотреть результаты', {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fff'
        }).setOrigin(0.5);
        
        // Эффект появления кнопки
        continueBtn.setAlpha(0);
        this.tweens.add({
            targets: continueBtn,
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
    }
}
