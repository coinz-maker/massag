// Основная логика приложения
document.addEventListener('DOMContentLoaded', function() {
    const app = window.TelegramApp;
    const tg = app.tg;
    //===========================
    // Получаем API
    const api = window.TMA_API;
    const app = window.TelegramApp;
    const user = app.getUser();
    
    // Новая функция для загрузки данных из БД
    async function loadRealDatabaseData() {
        if (!user) {
            console.warn('Пользователь не авторизован');
            return;
        }
        
        const dbDataEl = document.getElementById('db-data');
        
        try {
            // Показываем загрузку
            dbDataEl.innerHTML = `
                <div class="loader" style="margin: 20px auto; width: 40px; height: 40px;"></div>
                <p style="text-align: center;">Загрузка данных из базы...</p>
            `;
            
            // Загружаем данные пользователя из БД
            const userData = await api.getUserData(user.id);
            
            // Загружаем статистику
            const stats = await api.getStats();
            
            // Загружаем сообщения пользователя
            const messages = await api.getMessages(user.id);
            
            // Отображаем данные
            dbDataEl.innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Ваш ID в БД</div>
                        <div class="info-value">${userData.user?.id || 'Новый пользователь'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Регистрация</div>
                        <div class="info-value">${userData.user?.created_at ? new Date(userData.user.created_at).toLocaleDateString('ru-RU') : 'Сегодня'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Последний визит</div>
                        <div class="info-value">${userData.user?.last_visit ? new Date(userData.user.last_visit).toLocaleString('ru-RU') : 'Сейчас'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Всего пользователей</div>
                        <div class="info-value">${stats.stats?.[0]?.total_users || 0}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Активных за неделю</div>
                        <div class="info-value">${stats.stats?.[0]?.active_users || 0}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Ваших сообщений</div>
                        <div class="info-value">${messages.messages?.length || 0}</div>
                    </div>
                </div>
                
                ${messages.messages?.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h4>Последние сообщения:</h4>
                    <div style="max-height: 200px; overflow-y: auto; margin-top: 10px;">
                        ${messages.messages.slice(0, 5).map(msg => `
                            <div style="padding: 8px; margin: 5px 0; background: rgba(0,0,0,0.05); border-radius: 6px;">
                                <strong>${msg.created_at.split('T')[0]}:</strong> ${msg.text.substring(0, 50)}...
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            `;
            
            app.showAlert('Данные успешно загружены из базы!');
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            dbDataEl.innerHTML = `
                <div style="color: #ff4757; text-align: center; padding: 20px;">
                    <p>Ошибка загрузки данных</p>
                    <p style="font-size: 0.9rem;">${error.message}</p>
                    <p style="font-size: 0.8rem; margin-top: 10px;">Проверьте настройки API и базы данных</p>
                </div>
            `;
        }
    }
    
    // Обновляем обработчик кнопки
    loadDataBtn.addEventListener('click', loadRealDatabaseData);
    //===========================
    // Элементы DOM
    const userInfoEl = document.getElementById('user-info');
    const welcomeTextEl = document.getElementById('welcome-text');
    const tgInfoEl = document.getElementById('tg-info');
    const loadDataBtn = document.getElementById('load-data-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const expandBtn = document.getElementById('expand-btn');
    const closeBtn = document.getElementById('close-btn');
    const appTitleEl = document.getElementById('app-title');
    
    // Загружаем данные пользователя
    function loadUserData() {
        const user = app.getUser();
        
        if (user) {
            // Обновляем приветствие
            const firstName = user.first_name || 'Пользователь';
            const lastName = user.last_name || '';
            const fullName = `${firstName} ${lastName}`.trim();
            
            welcomeTextEl.textContent = `Привет, ${firstName}!`;
            appTitleEl.textContent = `Привет, ${firstName}!`;
            
            // Показываем информацию пользователя
            userInfoEl.innerHTML = `
                <div class="user-avatar">
                    ${firstName.charAt(0)}${lastName.charAt(0) || firstName.charAt(1) || ''}
                </div>
                <div>
                    <strong>${fullName}</strong>
                    <div style="font-size: 0.9rem; color: #666;">ID: ${user.id}</div>
                </div>
            `;
            
            // Показываем данные из Telegram
            tgInfoEl.innerHTML = `
                <div class="info-item">
                    <div class="info-label">Имя</div>
                    <div class="info-value">${user.first_name || 'Не указано'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Фамилия</div>
                    <div class="info-value">${user.last_name || 'Не указано'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Username</div>
                    <div class="info-value">@${user.username || 'Не указан'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Язык</div>
                    <div class="info-value">${user.language_code || 'Не указан'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Платформа</div>
                    <div class="info-value">${tg.platform}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Версия</div>
                    <div class="info-value">${tg.version}</div>
                </div>
            `;
        } else {
            welcomeTextEl.textContent = 'Данные пользователя не доступны';
            userInfoEl.innerHTML = '<span style="color: #666;">Гость</span>';
        }
    }
    
    // Загрузка данных из базы (заглушка)
    function loadDatabaseData() {
        const dbDataEl = document.getElementById('db-data');
        dbDataEl.innerHTML = `
            <div class="loader" style="margin: 20px auto;"></div>
            <p style="text-align: center;">Загрузка данных из MySQL...</p>
        `;
        
        // Симуляция загрузки
        setTimeout(() => {
            dbDataEl.innerHTML = `
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Записей в БД</div>
                        <div class="info-value">43</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Последний визит</div>
                        <div class="info-value">Сегодня, 15:40</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Статус</div>
                        <div class="info-value" style="color: #4cd964;">Активен</div>
                    </div>
                </div>
            `;
            app.showAlert('Данные успешно загружены!');
        }, 1500);
    }
    
    // Обработчики событий
    loadDataBtn.addEventListener('click', loadDatabaseData);
    
    themeToggleBtn.addEventListener('click', () => {
        // Переключение темы (имитация)
        const isDark = document.documentElement.style.getPropertyValue('--bg-color') === '#1a1a1a';
        if (isDark) {
            document.documentElement.style.setProperty('--bg-color', '#ffffff');
            document.documentElement.style.setProperty('--text-color', '#000000');
        } else {
            document.documentElement.style.setProperty('--bg-color', '#1a1a1a');
            document.documentElement.style.setProperty('--text-color', '#ffffff');
        }
    });
    
    expandBtn.addEventListener('click', () => {
        tg.expand();
        app.showAlert('Приложение развернуто на весь экран!');
    });
    
    closeBtn.addEventListener('click', () => {
        app.showConfirm('Закрыть приложение?', (confirmed) => {
            if (confirmed) {
                app.close();
            }
        });
    });
    
    // Инициализация
    loadUserData();
    
    // События Telegram
    tg.onEvent('viewportChanged', (event) => {
        console.log('Viewport changed:', event);
    });
    
    tg.onEvent('themeChanged', () => {
        console.log('Theme changed');
        app.updateTheme();
    });
    
    // Показываем, что приложение готово
    setTimeout(() => {
        tg.ready();
    }, 500);
    
    // Простые уведомления
    setTimeout(() => {
        app.showAlert('Приложение успешно загружено!');
    }, 1000);

});

