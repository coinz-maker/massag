// api.js - Работа с API
class TMA_API {
    constructor() {
        this.baseUrl = window.location.origin;
        this.apiUrl = `${this.baseUrl}/api/data`;
    }
    
    // Получаем initData из Telegram
    getInitData() {
        const tg = window.Telegram?.WebApp;
        return tg?.initData || '';
    }
    
    // Общая функция запроса
    async request(action, params = {}) {
        try {
            const initData = this.getInitData();
            
            const queryParams = new URLSearchParams({
                action,
                initData,
                ...params
            });
            
            const response = await fetch(`${this.apiUrl}?${queryParams}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
    
    // Получить данные пользователя
    async getUserData(userId) {
        return this.request('getUserData', { userId });
    }
    
    // Получить статистику
    async getStats() {
        return this.request('getStats');
    }
    
    // Получить сообщения
    async getMessages(userId = null) {
        const params = userId ? { userId } : {};
        return this.request('getMessages', params);
    }
    
    // Отправить сообщение (пример POST запроса)
    async sendMessage(message, userId) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'sendMessage',
                    initData: this.getInitData(),
                    message,
                    userId
                })
            });
            
            return await response.json();
        } catch (error) {
            console.error('Send message error:', error);
            throw error;
        }
    }
}

// Создаем глобальный экземпляр API
window.TMA_API = new TMA_API();
