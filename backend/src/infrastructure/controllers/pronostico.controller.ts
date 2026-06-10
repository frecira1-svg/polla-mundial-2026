const { MySqlPronosticoRepository } = require('../repositories/mysql-pronostico.repository');
const { GuardarPronosticoUseCase } = require('../../use-cases/guardar-pronostico.use-case');

const repository = new MySqlPronosticoRepository();
const useCase = new GuardarPronosticoUseCase(repository);

class PronosticoController {
    
    async create(req, res) {
        try {
            console.log('📦 [Backend] Datos crudos desde Angular:', req.body);

            const { idUsuario, idPartido, golesLocal, golesVisitante } = req.body;

            // 1. Validaciones previas en la frontera
            if (idUsuario === undefined || idUsuario === null || idPartido === undefined || idPartido === null) {
                return res.status(400).json({ 
                    error: "Faltan los identificadores obligatorios (idUsuario o idPartido)" 
                });
            }

            // 2. Normalizamos los goles por si vienen vacíos de la interfaz
            const golesLocalFinal = (golesLocal === undefined || golesLocal === null || golesLocal === '') ? 0 : Number(golesLocal);
            const golesVisitanteFinal = (golesVisitante === undefined || golesVisitante === null || golesVisitante === '') ? 0 : Number(golesVisitante);

            // 3. 🎯 CORRECCIÓN: Estructura exacta que tu repositorio lee en values (idUsuario, idPartido)
            const nuevoPronostico = {
                idUsuario: Number(idUsuario),
                idPartido: Number(idPartido),
                golesLocal: golesLocalFinal,
                golesVisitante: golesVisitanteFinal
            };

            console.log('🔄 [Backend] Entidad estructurada para el Caso de Uso:', nuevoPronostico);

            // 4. Ejecutamos el Caso de Uso
            const resultado = await useCase.execute(nuevoPronostico);

            if (resultado) {
                return res.status(200).json({ 
                    message: "¡Pronóstico procesado con éxito!", 
                    data: nuevoPronostico 
                });
            }
            
            return res.status(400).json({ error: "El repositorio no pudo guardar o actualizar el pronóstico" });

        } catch (error) {
            console.error('❌ [Controlador Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }
}

// Lo exportamos como una instancia para que tu app.js lo llame directamente sin romperse
module.exports = new PronosticoController();