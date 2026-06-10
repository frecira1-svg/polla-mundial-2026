// 🎯 CORRECCIÓN: Importamos la conexión del pool estandarizado
const pool = require('../database/config'); 
const Usuario = require('../../domain/entities/usuario.entity'); // Ajusta la ruta a tu carpeta entities

class MySqlUsuarioRepository {
    
    async create(usuarioData) {
        const query = `
            INSERT INTO usuarios (nombre, email, password, puntos_totales) 
            VALUES (?, ?, ?, ?)
        `;
        
        // 🎯 CORRECCIÓN: Leemos la propiedad en camelCase (como viene del Caso de Uso/Angular)
        const values = [
            usuarioData.nombre, 
            usuarioData.email, 
            usuarioData.password, 
            usuarioData.puntosTotales || 0
        ];

        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [result] = await pool.execute(query, values);
            
            // Retornamos la entidad de Dominio mapeada correctamente
            return new Usuario({
                id: result.insertId,
                nombre: usuarioData.nombre,
                email: usuarioData.email,
                password: usuarioData.password,
                puntosTotales: usuarioData.puntosTotales || 0
            });
        } catch (error) {
            throw new Error(`[MySQL Error]: No se pudo registrar el usuario: ${error.message}`);
        }
    }

    // 🏆 Método para el Ranking (Tabla de posiciones)
    async getRanking() {
        const query = 'SELECT id, nombre, puntos_totales FROM usuarios ORDER BY puntos_totales DESC';
        
        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [rows] = await pool.execute(query); 
            
            // 🎯 CORRECCIÓN: Convertimos las filas a camelCase para que Angular arme la tabla de posiciones feliz
            return rows.map(row => ({
                id: row.id,
                nombre: row.nombre,
                puntosTotales: row.puntos_totales
            }));
        } catch (error) {
            throw new Error(`[MySQL Error]: Error al obtener el ranking: ${error.message}`);
        }
    }

    async findByEmail(email) {
        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [rows] = await pool.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
            if (rows.length === 0) return null;
            
            const row = rows[0];
            // 🎯 CORRECCIÓN: Mapeamos la respuesta snake_case de MySQL al molde camelCase de tu dominio
            return new Usuario({
                id: row.id,
                nombre: row.nombre,
                email: row.email,
                password: row.password,
                puntosTotales: row.puntos_totales
            });
        } catch (error) {
            throw new Error(`[MySQL Error]: Error al buscar email: ${error.message}`);
        }
    }

    /**
     * 🎯 NUEVO MÉTODO: Suma puntos de forma acumulativa usando tu columna 'puntos_totales'
     */
    async sumarPuntos(idUsuario, puntos) {
        console.log(`💾 [MySQL Repo Usuarios] Sumando +${puntos} puntos al usuario ID: ${idUsuario}`);
        const query = 'UPDATE usuarios SET puntos_totales = puntos_totales + ? WHERE id = ?';
        
        try {
            const [result] = await pool.execute(query, [puntos, idUsuario]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`[MySQL Error]: Error al sumar puntos al usuario: ${error.message}`);
        }
    }
}

module.exports = MySqlUsuarioRepository;