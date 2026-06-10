const MySqlPartidoRepository = require('../repositories/mysql-partido.repository');
const CreatePartidoUseCase = require('../../use-cases/create-partido.use-case');

// Instanciamos el repositorio y el caso de uso de forma limpia
const partidoRepository = new MySqlPartidoRepository();
const createPartidoUseCase = new CreatePartidoUseCase(partidoRepository);

class PartidoController {
    
    async create(req, res) {
        console.log('📬 [POST /api/partidos] Petición entrante. Body:', req.body);
        try {
            // Pasamos los datos al caso de uso (ya estandarizados en camelCase desde Angular)
            const nuevoPartido = await createPartidoUseCase.execute(req.body);
            return res.status(201).json(nuevoPartido);
        } catch (error) {
            console.error('❌ [Controlador Error en create]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    async getAll(req, res) {
        console.log('🔍 [GET /api/partidos] Consultando fixture de partidos...');
        try {
            const partidos = await partidoRepository.getAll();
            // Retornamos el listado (el repositorio se encargará de entregarlos en formato camelCase)
            return res.status(200).json(partidos);
        } catch (error) {
            console.error('❌ [Controlador Error en getAll]:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    // ⚙️ MÉTODO: Para que el Admin registre los goles reales oficiales
    async updateResultado(req, res) {
        console.log('📢 [POST /api/partidos/resultado] Actualizando marcador oficial. Body:', req.body);
        
        // 🎯 CORRECCIÓN: Desestructuramos usando camelCase, que es como viaja desde Angular
        const { idPartido, golesLocalReal, golesVisitanteReal } = req.body;

        // Validación estricta en la frontera (Controlador) para evitar nulos en MySQL
        if (idPartido === undefined || idPartido === null || 
            golesLocalReal === undefined || golesLocalReal === null || 
            golesVisitanteReal === undefined || golesVisitanteReal === null) {
            console.log('⚠️ [Validación Fallida]: Faltan campos obligatorios para cerrar el partido.');
            return res.status(400).json({ error: 'Faltan datos obligatorios para registrar el resultado (idPartido, golesLocalReal o golesVisitanteReal).' });
        }

        try {
            // Le delegamos al repositorio la tarea de tirar el UPDATE pasándole los parámetros limpios
            await partidoRepository.updateResultadoReal(Number(idPartido), Number(golesLocalReal), Number(golesVisitanteReal));
            
            return res.status(200).json({
                mensaje: '¡Resultado oficial publicado con éxito! Partido finalizado y puntos calculados.',
                idPartido: Number(idPartido),
                golesLocalReal: Number(golesLocalReal),
                golesVisitanteReal: Number(golesVisitanteReal)
            });
        } catch (error) {
            console.error('❌ [Controlador Error al actualizar resultado]:', error.message);
            return res.status(500).json({ error: 'Error interno del servidor al actualizar el partido real.' });
        }
    }
}

module.exports = new PartidoController();