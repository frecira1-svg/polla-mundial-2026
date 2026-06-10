// 🎯 CORRECCIÓN: Importamos la conexión desestructurada del pool unificado
const pool = require('../database/config'); 
const Pronostico = require('../../domain/entities/pronostico.entity'); // Ajusta la ruta a tu carpeta entities

class MySqlPronosticoRepository {
    
    async guardarOActualizar(pronosticoData) {
        // 🎯 COLUMNAS REALES: Usamos exactamente lo que extrajimos de tu tabla en MySQL Workbench
        const query = `
            INSERT INTO pronosticos (usuario_id, partido_id, goles_local_pronostico, goles_visitante_pronostico)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                goles_local_pronostico = VALUES(goles_local_pronostico), 
                goles_visitante_pronostico = VALUES(goles_visitante_pronostico)
        `;
        
        // Mapeamos los datos que vienen limpios desde el Caso de Uso (Clean Architecture)
        const values = [
            pronosticoData.idUsuario, 
            pronosticoData.idPartido, 
            pronosticoData.golesLocal, 
            pronosticoData.golesVisitante
        ];

        try {
            // Ejecutamos con el pool unificado que reparamos
            const [result] = await pool.execute(query, values);
            
            return new Pronostico({
                id: result.insertId || null,
                idUsuario: pronosticoData.idUsuario,
                idPartido: pronosticoData.idPartido,
                golesLocal: pronosticoData.golesLocal,
                golesVisitante: pronosticoData.golesVisitante
            });
        } catch (error) {
            console.error("❌ Error en MySQL al ejecutar guardarOActualizar:", error);
            throw new Error(`[MySQL Error]: No se pudo procesar el pronóstico en la base de datos: ${error.message}`);
        }
    }

    /**
     * 🎯 NUEVO MÉTODO: Trae todos los pronósticos de un partido mapeando las columnas reales
     */
    async getByPartidoId(idPartido) {
        console.log(`💾 [MySQL Repo Pronósticos] Buscando todas las apuestas para el partido ID: ${idPartido}`);
        
        // Seleccionamos las columnas de tu BD y les ponemos un ALIAS en camelCase
        const query = `
            SELECT 
                id, 
                usuario_id AS idUsuario, 
                partido_id AS idPartido, 
                goles_local_pronostico AS golesLocal, 
                goles_visitante_pronostico AS golesVisitante 
            FROM pronosticos 
            WHERE partido_id = ?
        `;

        try {
            const [rows] = await pool.execute(query, [idPartido]);
            return rows;
        } catch (error) {
            console.error("❌ Error en MySQL al ejecutar getByPartidoId:", error);
            throw new Error(`[MySQL Error]: No se pudieron obtener los pronósticos del partido: ${error.message}`);
        }
    }
}

module.exports = MySqlPronosticoRepository;