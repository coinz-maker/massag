// Основная логика приложения
document.addEventListener('DOMContentLoaded', function() {
    const app = window.TelegramApp;
    const tg = app.tg;
    
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
                        <div class="info-value">42</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Последний визит</div>
                        <div class="info-value">Сегодня, 15:30</div>
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