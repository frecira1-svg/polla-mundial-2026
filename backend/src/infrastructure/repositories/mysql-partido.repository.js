// 🎯 CORRECCIÓN: Importamos el pool unificado
const pool = require('../database/config'); 
const Partido = require('../../domain/entities/partido.entity'); // Ajusta la ruta a tu carpeta entities

class MySqlPartidoRepository {
    
    async create(partidoData) {
        const query = `
            INSERT INTO partidos (equipo_local, equipo_visitante, fecha_hora, estado) 
            VALUES (?, ?, ?, ?)
        `;
        
        // 🎯 Leemos en camelCase (como viene desde el Caso de Uso/Angular)
        const values = [
            partidoData.equipoLocal, 
            partidoData.equipoVisitante, 
            partidoData.fechaHora, 
            partidoData.estado || 'pendiente'
        ];

        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [result] = await pool.execute(query, values);
            
            // Retornamos la entidad de Dominio totalmente limpia
            return new Partido({
                id: result.insertId,
                equipoLocal: partidoData.equipoLocal,
                equipoVisitante: partidoData.equipoVisitante,
                fechaHora: partidoData.fechaHora,
                golesLocal: null,
                golesVisitante: null,
                estado: partidoData.estado || 'pendiente'
            });
        } catch (error) {
            throw new Error(`[MySQL Error]: No se pudo crear el partido: ${error.message}`);
        }
    }

    async getAll() {
        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [rows] = await pool.execute('SELECT * FROM partidos ORDER BY fecha_hora ASC');
            
            // 🎯 Traducimos las columnas snake_case de MySQL al formato camelCase de la entidad
            return rows.map(row => new Partido({
                id: row.id,
                equipoLocal: row.equipo_local,
                equipoVisitante: row.equipo_visitante,
                fechaHora: row.fecha_hora,
                golesLocal: row.goles_local,
                golesVisitante: row.goles_visitante,
                estado: row.estado
            }));
        } catch (error) {
            throw new Error(`[MySQL Error]: Error al listar partidos: ${error.message}`);
        }
    }

    async getById(id) {
        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [rows] = await pool.execute('SELECT * FROM partidos WHERE id = ?', [id]);
            if (rows.length === 0) return null;
            
            const row = rows[0];
            // 🎯 Traducimos la fila única al molde de la entidad
            return new Partido({
                id: row.id,
                equipoLocal: row.equipo_local,
                equipoVisitante: row.equipo_visitante,
                fechaHora: row.fecha_hora,
                golesLocal: row.goles_local,
                golesVisitante: row.goles_visitante,
                estado: row.estado
            });
        } catch (error) {
            throw new Error(`[MySQL Error]: Error al buscar partido: ${error.message}`);
        }
    }

    // ⚙️ MÉTODO ACTUALIZAR: Recibe los IDs limpios numéricos desde el controlador
    async updateResultadoReal(partidoId, golesLocal, golesVisitante) {
        const query = `
            UPDATE partidos 
            SET goles_local = ?, goles_visitante = ?, estado = 'finalizado'
            WHERE id = ?
        `;
        try {
            // 🎯 CORREGIDO: Cambiado connection por pool
            const [result] = await pool.execute(query, [golesLocal, golesVisitante, partidoId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`[MySQL Error]: No se pudo actualizar el resultado oficial: ${error.message}`);
        }
    }
}

module.exports = MySqlPartidoRepository;