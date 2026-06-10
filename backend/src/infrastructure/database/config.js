const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root', 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión al arrancar el servidor de manera limpia
pool.getConnection()
    .then(conn => {
        console.log('💾 [MySQL] ¡Conexión con la base de datos de la Polla establecida con éxito!');
        conn.release(); 
    })
    .catch(err => {
        console.error('❌ [MySQL ERROR]: No se pudo conectar a la base de datos:', err.message);
    });

// 🎯 EXPORTACIÓN LIMPIA Y ESTÁNDAR:
// Exportamos directamente el pool. Así cualquier archivo que haga:
// const pool = require('../database/config'); lo usará perfectamente.
module.exports = pool;