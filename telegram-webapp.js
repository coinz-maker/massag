// Инициализация Telegram Web App
class TelegramApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.initData = this.tg.initData || {};
        this.initDataUnsafe = this.tg.initDataUnsafe || {};
        
        this.init();
    }
    
    init() {
        console.log('Telegram Web App инициализирован');
        
        // Развернуть на весь экран
        this.tg.expand();
        
        // Настройка темы
        this.setupTheme();
        
        // Настройка кнопки "Назад"
        this.setupBackButton();
        
        // Показываем основную кнопку, если нужно
        this.tg.MainButton.setText('Сохранить');
        this.tg.MainButton.hide();
    }
    
    setupTheme() {
        // Применяем тему Telegram
        document.documentElement.style.setProperty('--bg-color', this.tg.backgroundColor);
        document.documentElement.style.setProperty('--text-color', this.tg.headerColor || this.tg.textColor);
        
        // Слушаем изменения темы
        this.tg.onEvent('themeChanged', this.updateTheme.bind(this));
        this.tg.onEvent('viewportChanged', this.updateViewport.bind(this));
    }
    
    updateTheme() {
        document.documentElement.style.setProperty('--bg-color', this.tg.backgroundColor);
        document.documentElement.style.setProperty('--text-color', this.tg.headerColor || this.tg.textColor);
    }
    
    updateViewport() {
        console.log('Viewport изменился:', this.tg.viewportHeight, this.tg.viewportStableHeight);
    }
    
    setupBackButton() {
        if (this.tg.BackButton.isVisible) {
            this.tg.BackButton.onClick(() => {
                window.history.back();
            });
        }
    }
    
    // Получить данные пользователя
    getUser() {
        return this.initDataUnsafe.user || null;
    }
    
    // Получить дополнительные данные
    getInitData() {
        return this.initData;
    }
    
    // Закрыть приложение
    close() {
        this.tg.close();
    }
    
    // Показать алерт
    showAlert(message) {
        this.tg.showAlert(message);
    }
    
    // Показать подтверждение
    showConfirm(message, callback) {
        this.tg.showConfirm(message, callback);
    }
}

// Создаем глобальный экземпляр
window.TelegramApp = new TelegramApp();