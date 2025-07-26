class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
        this.tweensCreated = 0; // Счетчик анимаций для отладки
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
        
        console.log('🎉 Scene4 (Успех) загружается...');
        
        // Проверяем, работаем ли мы в мобильном браузере или Telegram
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isTelegram = !!(window.Telegram && window.Telegram.WebApp);
        
        console.log(`📱 Mobile: ${isMobile}, Telegram: ${isTelegram}`);
        
        // Фон с простым оверлеем
        const bg = this.add.image(width/2, height/2, 'office-bg');
        const scale = Math.max(width / bg.width, height / bg.height);
        bg.setScale(scale);
        bg.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Простой успешный оверлей
        const successOverlay = this.add.rectangle(width/2, height/2, width, height, 0xf39c12, 0.15);
        
        // Персонаж с минимальной анимацией
        const player = this.add.image(width/2 - width * 0.2, height * 0.6, 'player');
        const playerScale = Math.min(width / 800, height / 600) * 0.35;
        player.setScale(playerScale);
        player.texture.source[0].scaleMode = Phaser.NEAREST;
        
        // Только простая анимация для персонажа (только если не мобильный)
        if (!isMobile && !isTelegram) {
            this.tweens.add({
                targets: player,
                y: player.y - 8,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            this.tweensCreated++;
        }
        
        // Заголовок согласно ТЗ
        const title = this.add.text(width/2, height * 0.12, GAME_CONFIG.texts.scene4.title, {
            fontSize: Math.floor(Math.min(width, height) * 0.06) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#e67e22',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Простое описание без сложных анимаций
        const description = this.add.text(width/2, height * 0.22, 
            'Благодаря чат-боту ваш бизнес:\n• Увеличил продажи на 150%\n• Снизил нагрузку на персонал\n• Автоматизировал воронку\n• Экономит 30 000₽/месяц', {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#2c3e50',
            align: 'center',
            lineSpacing: 8,
            stroke: '#ffffff',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Достижения отображаем сразу без анимации
        this.createAchievementsStatic(width, height);
        
        // Добавляем кнопку "Пропустить" для отладки в правом верхнем углу
        const skipBtn = this.add.rectangle(width * 0.9, height * 0.1, 80, 30, 0x95a5a6)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log('⏭️ Кнопка "Пропустить" нажата');
                this.tweens.killAll();
                this.time.removeAllEvents();
                this.scene.start('Scene5');
            });

        this.add.text(width * 0.9, height * 0.1, 'Пропустить', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Кнопка появляется быстро без задержки
        this.time.delayedCall(1500, () => {
            this.createFinalButton(width, height);
        });

        console.log(`🎬 Scene4 создана. Анимации: ${this.tweensCreated}`);
    }
    
    createAchievementsStatic(width, height) {
        // Статичные достижения без анимации для лучшей производительности
        const achievements = [
            { icon: '📈', text: 'Продажи +150%', color: '#27ae60' },
            { icon: '👥', text: 'Персонал -60%', color: '#3498db' },
            { icon: '⚙️', text: 'Автоматизация 100%', color: '#9b59b6' },
            { icon: '💰', text: 'Экономия 30 000₽', color: '#e67e22' }
        ];
        
        achievements.forEach((achievement, index) => {
            const x = width * 0.25 + (index * width * 0.16);
            const y = height * 0.4;
            
            // Простой фон
            const bg = this.add.circle(x, y, 35, 0xffffff, 0.9);
            bg.setStrokeStyle(3, achievement.color);
            
            // Иконка
            this.add.text(x, y - 8, achievement.icon, {
                fontSize: Math.floor(Math.min(width, height) * 0.04) + 'px'
            }).setOrigin(0.5);
            
            // Текст
            this.add.text(x, y + 15, achievement.text, {
                fontSize: Math.floor(Math.min(width, height) * 0.02) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: achievement.color,
                fontStyle: 'bold',
                align: 'center'
            }).setOrigin(0.5);
        });
    }
    
    createFinalButton(width, height) {
        console.log('🔘 Создаем финальную кнопку');
        
        // Простая кнопка без сложных анимаций
        const finalBtn = this.add.rectangle(width/2, height * 0.8, 320, 70, 0xe67e22)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                console.log('🚀 Нажата кнопка перехода к Scene5');
                
                // Останавливаем все анимации перед переходом
                this.tweens.killAll();
                this.time.removeAllEvents();
                
                // Переходим к форме лидов
                this.scene.start('Scene5');
            })
            .on('pointerover', () => {
                finalBtn.setFillStyle(0xd35400);
            })
            .on('pointerout', () => {
                finalBtn.setFillStyle(0xe67e22);
            });
            
        const btnText = this.add.text(width/2, height * 0.8, '🚀 Заказать такого бота!', {
            fontSize: Math.floor(Math.min(width, height) * 0.032) + 'px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Простое появление без сложной анимации
        finalBtn.setAlpha(0);
        btnText.setAlpha(0);
        
        this.tweens.add({
            targets: [finalBtn, btnText],
            alpha: 1,
            duration: 500,
            ease: 'Power2'
        });
        this.tweensCreated++;
        
        // Добавляем автоматический переход если кнопка не нажата
        this.time.delayedCall(10000, () => {
            console.log('⏰ Автоматический переход к Scene5 через 10 секунд');
            
            // Показываем подсказку
            const hint = this.add.text(width/2, height * 0.9, 'Нажмите кнопку выше ↑', {
                fontSize: Math.floor(Math.min(width, height) * 0.025) + 'px',
                fontFamily: 'Arial, sans-serif',
                fill: '#e74c3c',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Простое мигание
            this.tweens.add({
                targets: hint,
                alpha: { from: 1, to: 0.5 },
                duration: 800,
                yoyo: true,
                repeat: 3
            });
            this.tweensCreated++;
        });
        
        console.log('✅ Финальная кнопка создана');
    }
    
    // Метод для принудительной очистки при уходе со сцены
    shutdown() {
        console.log('🧹 Scene4 завершается, очищаем ресурсы');
        this.tweens.killAll();
        this.time.removeAllEvents();
    }
}
