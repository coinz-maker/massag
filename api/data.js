// api/data.js - Vercel Serverless Function
const mysql = require('mysql2/promise');

// Создаем пул подключений (для продакшена используйте переменные окружения)
function createPool() {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'your_database',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

// Валидация данных Telegram (важно для безопасности!)
function validateTelegramData(initData) {
  const crypto = require('crypto');
  const { searchParams } = new URL(`https://dummy.com?${initData}`);
  
  const hash = searchParams.get('hash');
  const params = [];
  
  searchParams.forEach((value, key) => {
    if (key !== 'hash') {
      params.push(`${key}=${value}`);
    }
  });
  
  params.sort();
  const dataCheckString = params.join('\n');
  
  const secretKey = crypto.createHmac('sha256', 'WebAppData')
    .update(process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN')
    .digest();
  
  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');
  
  return calculatedHash === hash;
}

// Основной handler для Vercel
module.exports = async (req, res) => {
  // Включаем CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Получаем данные из запроса
    const { initData, userId, action } = req.query;
    
    // Проверяем Telegram данные (важно для безопасности!)
    if (!validateTelegramData(initData)) {
      return res.status(401).json({ error: 'Невалидные данные Telegram' });
    }
    
    // Создаем подключение к БД
    const pool = createPool();
    
    // Обрабатываем разные действия
    switch (action) {
      case 'getUserData':
        const [userRows] = await pool.execute(
          'SELECT * FROM users WHERE telegram_id = ?',
          [userId]
        );
        
        if (userRows.length === 0) {
          // Если пользователя нет в БД, создаем запись
          await pool.execute(
            'INSERT INTO users1 (telegram_id, first_visit, last_visit) VALUES (?, NOW(), NOW())',
            [userId]
          );
          return res.json({ user: null, message: 'Новый пользователь создан' });
        }
        
        // Обновляем время последнего визита
        await pool.execute(
          'UPDATE users1 SET last_visit = NOW() WHERE telegram_id = ?',
          [userId]
        );
        
        return res.json({ user: userRows[0] });
        
      case 'getStats':
        const [statsRows] = await pool.execute(`
          SELECT COUNT(*) as total_users FROM users ORDER BY join_date DESC LIMIT 30;
		  `);
        
        return res.json({ stats: statsRows });
        
      case 'getMessages':
        const [messagesRows] = await pool.execute(`
			SELECT m.bb64url_wallet, u.username, u.first_name 
			FROM wallets m
			LEFT JOIN users u ON m.user_id = u.user_id
			WHERE m.user_id = ? OR ? IS NULL
			ORDER BY m.create_timestamp DESC
			LIMIT 1;
        `, [userId || null, userId || null]);


          //SELECT m.bb64url_wallet, u.username, u.first_name 
          //FROM wallets m
          //LEFT JOIN users u ON m.user_id = u.id
          //WHERE m.user_id = ? OR ? IS NULL
          //ORDER BY m.created_at DESC
          //LIMIT 50

			//SELECT m.bb64url_wallet, u.username, u.first_name 
			//FROM wallets m
			//LEFT JOIN users u ON m.user_id = u.user_id
			//WHERE m.user_id = 435021750 OR m.user_id IS NULL
			//WHERE m.user_id = ? OR ? IS NULL
			//ORDER BY m.create_timestamp DESC
			//LIMIT 50;


        return res.json({ messages: messagesRows });
        
      default:
        return res.json({ 
          message: 'API работает',
          endpoints: [
            '/api/data?action=getUserData&userId=123&initData=...',
            '/api/data?action=getStats',
            '/api/data?action=getMessages&userId=123'
          ]
        });
    }
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
