class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
    }

    preload() {
        // Используем офисный фон и персонажа
        this.load.image('office-bg', 'assets/bg/office.png');
        this.load.image('player', 'assets/characters/player.png');
        
        // Настройки для четких изображений
        this.load.on('filecomplete', (key, type, data) => {
            if (type === 'image') {
                const texture = this.textures.get(key);
                if (texture.source[0].image) {
                    const img = texture.source[0].image;
                    img.style.imageRendering = 'crisp-edges';
                }
            }
        });
    }

    create() {
        const { width, height } = this.scale;
        
        // Фон офиса с позитивным оверлеем (теперь всё в порядке)
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scaleX = width / bg.width;
        const scaleY = height / bg.height;
        const scale = Math.max(scaleX, scaleY);
        bg.setScale(scale);
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Позитивный зеленый оверлей показывает успех автоматизации
        const positiveOverlay = this.add.rectangle(width/2, height/2, width, height, 0x27ae60, 0.15);
        
        // Персонаж теперь доволен - автоматизация работает
        const player = this.add.image(width/2 - width * 0.2, height * 0.65, 'player');
        const playerScale = Math.min(width / 800, height / 600) * 0.32;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Довольная анимация персонажа
        this.tweens.add({
            targets: player,
            scale: playerScale * 1.05,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Заголовок согласно ТЗ
        const title = this.add.text(width/2, height * 0.08, GAME_CONFIG.texts.scene3.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.055) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Описание результатов согласно ТЗ
        this.add.text(width/2, height * 0.18, GAME_CONFIG.texts.scene3.description, {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            align: 'center',
            lineSpacing: 10,
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Показываем автоматизацию согласно ТЗ: "Менеджер получает уведомления, видно: меньше хаоса, больше порядка"
        this.createAutomationVisualization(width, height);
        
        // График заявок растёт согласно ТЗ
        this.createGrowthChart(width, height);
        
        // Анимированные счетчики результатов
        this.createResultCounters(width, height);
        
        // Кнопка перехода согласно ТЗ
        this.time.delayedCall(4000, () => {
            this.createContinueButton(width, height);
        });
    }
    
    createAutomationVisualization(width, height) {
        // Панель автоматизации справа
        const panelX = width/2 + width * 0.15;
        const panelY = height * 0.4;
        
        // Фон панели
        const panelBg = this.add.rectangle(panelX, panelY, 280, 200, 0xffffff, 0.95);
        panelBg.setStrokeStyle(4, 0x27ae60);
        panelBg.setScale(0);
        
        const panelTitle = this.add.text(panelX, panelY - 80, '🤖 Система автоматизации', {
            fontSize: Math.floor(Math.min(width, height) * 0.028) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        panelTitle.setAlpha(0);
        
        // Анимация появления панели
        this.tweens.add({
            targets: panelBg,
            scale: 1,
            duration: 800,
            delay: 500,
            ease: 'Back.easeOut'
        });
        
        this.tweens.add({
            targets: panelTitle,
            alpha: 1,
            duration: 600,
            delay: 800
        });
        
        // Индикаторы работы системы
        const indicators = [
            { text: '✅ 24/7 Автоответы', color: '#27ae60', y: -40 },
            { text: '✅ CRM интеграция', color: '#3498db', y: -10 },
            { text: '✅ Сбор контактов', color: '#9b59b6', y: 20 },
            { text: '✅ Больше порядка', color: '#e67e22', y: 50 }
        ];
        
        indicators.forEach((indicator, index) => {
            this.time.delayedCall(1200 + index * 300, () => {
                const text = this.add.text(panelX, panelY + indicator.y, indicator.text, {
                    fontSize: Math.floor(Math.min(width, height) * 0.024) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: indicator.color,
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                
                text.setAlpha(0);
                this.tweens.add({
                    targets: text,
                    alpha: 1,
                    x: text.x + 10,
                    duration: 400,
                    ease: 'Power2'
                });
            });
        });
    }
    
    createGrowthChart(width, height) {
        // График роста заявок согласно ТЗ в правом нижнем углу
        const chartX = width * 0.8;
        const chartY = height * 0.7;
        const chartWidth = 150;
        const chartHeight = 60;
        
        // Фон графика
        const chartBg = this.add.rectangle(chartX, chartY, chartWidth + 20, chartHeight + 20, 0xffffff, 0.9);
        chartBg.setStrokeStyle(3, 0x27ae60);
        chartBg.setAlpha(0);
        
        const chartTitle = this.add.text(chartX, chartY - chartHeight/2 - 20, '📈 График заявок', {
            fontSize: Math.floor(Math.min(width, height) * 0.024) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#27ae60',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        chartTitle.setAlpha(0);
        
        this.tweens.add({
            targets: [chartBg, chartTitle],
            alpha: 1,
            duration: 600,
            delay: 2500
        });
        
        // Рисуем график роста
        this.time.delayedCall(3000, () => {
            const graphics = this.add.graphics();
            graphics.lineStyle(3, 0x95a5a6);
            
            // Оси графика
            graphics.moveTo(chartX - chartWidth/2, chartY + chartHeight/2);
            graphics.lineTo(chartX + chartWidth/2, chartY + chartHeight/2);
            graphics.moveTo(chartX - chartWidth/2, chartY + chartHeight/2);
            graphics.lineTo(chartX - chartWidth/2, chartY - chartHeight/2);
            graphics.stroke();
            
            // Линия роста (растущий тренд)
            graphics.lineStyle(4, 0x27ae60);
            const points = [
                [chartX - chartWidth/2, chartY + chartHeight/2],
                [chartX - chartWidth/4, chartY + chartHeight/4],
                [chartX, chartY],
                [chartX + chartWidth/4, chartY - chartHeight/4],
                [chartX + chartWidth/2, chartY - chartHeight/2]
            ];
            
            // Анимированное рисование линии роста
            let currentPoint = 0;
            const drawLine = this.time.addEvent({
                delay: 150,
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
    
    createResultCounters(width, height) {
        // Счетчики результатов внизу экрана
        const counters = [
            { x: width * 0.25, from: 10, to: 65, label: 'Заявки в день', color: '#27ae60' },
            { x: width * 0.5, from: 30, to: 85, label: 'Конверсия %', color: '#3498db' },
            { x: width * 0.75, from: 8, to: 24, label: 'Часов работы', color: '#e67e22' }
        ];
        
        counters.forEach((counter, index) => {
            this.time.delayedCall(2000 + index * 400, () => {
                const y = height * 0.8;
                
                // Фон счетчика
                const counterBg = this.add.rectangle(counter.x, y, 140, 80, 0xffffff, 0.9);
                counterBg.setStrokeStyle(3, counter.color);
                counterBg.setAlpha(0);
                
                const numberText = this.add.text(counter.x, y - 15, counter.from.toString(), {
                    fontSize: Math.floor(Math.min(width, height) * 0.045) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: counter.color,
                    fontStyle: 'bold'
                }).setOrigin(0.5);
                numberText.setAlpha(0);
                
                const labelText = this.add.text(counter.x, y + 20, counter.label, {
                    fontSize: Math.floor(Math.min(width, height) * 0.022) + 'px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#2c3e50'
                }).setOrigin(0.5);
                labelText.setAlpha(0);
                
                // Анимация появления
                this.tweens.add({
                    targets: [counterBg, numberText, labelText],
                    alpha: 1,
                    duration: 500,
                    ease: 'Power2'
                });
                
                // Анимация счетчика
                this.tweens.add({
                    targets: { value: counter.from },
                    value: counter.to,
                    duration: 2000,
                    delay: 300,
                    ease: 'Power2',
                    onUpdate: (tween) => {
                        const current = Math.floor(tween.getValue());
                        numberText.setText(current.toString());
                    }
                });
            });
        });
    }
    
    createContinueButton(width, height) {
        const continueBtn = this.add.rectangle(width/2, height * 0.94, 280, 50, 0x007acc)
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
            
        const continueText = this.add.text(width/2, height * 0.94, 'Посмотреть результаты', {
            fontSize: Math.floor(Math.min(width, height) * 0.026) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Анимация появления кнопки
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
                duration: 1200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
}
