# Настройка интеграций для сбора лидов

Проект настроен для работы с Google Apps Script для автоматической обработки лидов.

## ✅ Текущая настройка

Ваш Google Apps Script уже настроен и интегрирован:
- **Deployment ID:** `AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw`
- **Webhook URL:** `https://script.google.com/macros/s/AKfycbxwep6ng0s2AQF-MbQ1PwwTly82gOowqG_y665sft4EZTvGhAzrrD5XXjrr8zXf1k_iiw/exec`
- **Google Sheets:** [Таблица лидов](https://docs.google.com/spreadsheets/d/1QdvmycbM8TDtU6e3FB0rG-eTmZLtOc4NZNxYTrRFn0I/edit?gid=0#gid=0)

## 🔧 Как это работает

1. **Пользователь заполняет форму** в игре (Scene5)
2. **Данные отправляются** на Google Apps Script webhook
3. **Google Apps Script:**
   - Сохраняет лид в Google Sheets
   - Отправляет уведомление в Telegram
   - Возвращает статус обработки

## 📊 Мониторинг лидов

### Google Sheets:
- Автоматически сохраняются все лиды
- Колонки: Дата, Время, Имя, Телефон, Email, Источник, Реферер, Устройство, ID лида

### Telegram уведомления:
- Мгновенные уведомления о новых лидах
- Кнопки быстрых действий (звонок, email)
- Хештеги: #лид #автоматизация #игра

## 🎮 Структура проекта

```
├── index.html              # Главная страница игры
├── main.js                 # Основная логика игры (Phaser.js)
├── config.js               # Конфигурация игры
├── telegram-bot.js         # Telegram WebApp интеграция
├── scenes/                 # Сцены игры
│   ├── Scene1.js          # Проблема
│   ├── Scene2.js          # Решение 
│   ├── Scene3.js          # Выбор
│   ├── Scene4.js          # Поздравления
│   └── Scene5.js          # ��ризыв к действию + форма
├── forms/
│   └── leadForm.js        # Обработчик формы лидов
├── config/
│   └── integrations.js    # Конфигурация интеграций
├── sw.js                  # Service Worker для PWA
└── debug.js               # Отладочные функции
```

## 🛠️ Дополнительные настройки

### Изменение Chat ID для Telegram уведомлений:

1. Получите ваш Chat ID у бота [@userinfobot](https://t.me/userinfobot)
2. Обновите конфигурацию в Google Apps Script:
   ```javascript
   const CONFIG = {
     telegram: {
       chatId: 'ВАШ_CHAT_ID' // Замените на ваш ID
     }
   };
   ```

### Настройка дополнительных полей в Google Sheets:

Отредактируйте функцию `saveToSheets` в Google Apps Script для добавления новых колонок.

## 🚀 Развертывание

### GitHub Pages (рекомендуется):
1. Репозиторий уже готов для статического хостинга
2. Включите GitHub Pages в настройках репозитория
3. Игра будет доступна по URL: `https://username.github.io/repository-name`

### Netlify:
1. Подключите GitHub репозиторий к Netlify
2. Автоматическое развертывание при каждом коммите
3. Бесплатный SSL и CDN

## 🔍 Устранение проблем

### Форма не отправляет данные:
1. Откройте консоль браузера (F12)
2. Проверьте наличие ошибок при отправке
3. Убедитесь что Google Apps Script доступен

### Нет уведомлений в Telegram:
1. Проверьте Chat ID в Google Apps Script
2. Убедитесь что бот не заблокирован
3. Проверите логи выполнения в Google Apps Script

### Данные не появляются в Google Sheets:
1. Проверьте права доступа к таблице
2. Убедитесь что лист называется "Лиды"
3. Проверьте логи Google Apps Script на ошибки

## 📱 Telegram Bot команды

Бот поддерживает команды:
- `/start` - Запуск игры
- `/help` - Справка
- `/info` - Информация о боте

Игра запускается через Inline кнопку "🎮 Играть" или прямую ссылку на WebView.

## 🔐 Безопасность

- Все запросы обрабатываются через HTTPS
- Google Apps Script проверяет валидность данных
- Конфиденциальные данные (токены) хранятся только в Google Apps Script
- Локальное резервное сохранение в браузере при недоступности сервера
