const MySqlPronosticoRepository = require('../repositories/mysql-pronostico.repository');
const MySqlPartidoRepository = require('../repositories/mysql-partido.repository'); 
const MySqlUsuarioRepository = require('../repositories/mysql-usuario.repository'); // 🎯 NUEVO: Para el caso de uso de puntos

// Casos de Uso
const GuardarPronosticoUseCase = require('../../use-cases/create-pronostico.use-case'); 
const CalcularPuntosUseCase = require('../../use-cases/calcular-puntos.use-case'); // 🎯 NUEVO

// Instanciamos los repositorios
const pronosticoRepo = new MySqlPronosticoRepository();
const partidoRepo = new MySqlPartidoRepository();
const usuarioRepo = new MySqlUsuarioRepository(); // 🎯 NUEVO

// Instanciamos los Casos de Uso inyectando sus dependencias
const useCase = new GuardarPronosticoUseCase(pronosticoRepo, partidoRepo); 
const calcularPuntosUseCase = new CalcularPuntosUseCase(pronosticoRepo, usuarioRepo); // 🎯 NUEVO

class PronosticoController {
    
    /**
     * ⚽ REGISTRAR O ACTUALIZAR PRONÓSTICO (Tu flujo original intacto)
     */
    async create(req, res) {
        console.log('📬 [POST /api/pronosticos] Petición entrante desde Angular. Body:', req.body);
        try {
            const { idUsuario, idPartido, golesLocal, golesVisitante } = req.body;

            // 1. Validación en la frontera (Controller) para evitar que viajen nulos o undefined
            if (idUsuario === undefined || idUsuario === null || idPartido === undefined || idPartido === null) {
                console.log('⚠️ [Validación Fallida]: idUsuario o idPartido ausentes en el JSON.');
                return res.status(400).json({ 
                    error: "Faltan los identificadores obligatorios (idUsuario o idPartido)" 
                });
            }

            // 2. Normalización de marcadores (Si en Angular dejan el input vacío "", se convierte a 0 de forma segura)
            const golesLocalFinal = (golesLocal === undefined || golesLocal === null || golesLocal === '') ? 0 : Number(golesLocal);
            const golesVisitanteFinal = (golesVisitante === undefined || golesVisitante === null || golesVisitante === '') ? 0 : Number(golesVisitante);

            // 3. Armamos el objeto con la estructura EXACTA que tu entidad y caso de uso manejan (camelCase)
            const pronosticoData = {
                idUsuario: Number(idUsuario),
                idPartido: Number(idPartido),
                golesLocal: golesLocalFinal,
                golesVisitante: golesVisitanteFinal
            };

            console.log('🔄 [Backend] Enviando entidad limpia al Caso de Uso:', pronosticoData);

            // 4. Ejecutamos el Caso de Uso de la Arquitectura Limpia
            const resultado = await useCase.execute(pronosticoData);

            if (resultado) {
                console.log('✅ [Backend] ¡Pronóstico procesado con éxito en el sistema!');
                return res.status(201).json({ 
                    message: "¡Pronóstico guardado con éxito!", 
                    data: pronosticoData 
                });
            }
            
            return res.status(400).json({ error: "La base de datos no pudo procesar la solicitud." });

        } catch (error) {
            console.error('❌ [PronosticoController Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * 🏁 FINALIZAR PARTIDO Y CALCULAR PUNTOS (La nueva función integrada)
     */
    async finalizarPartido(req, res) {
        console.log('🏁 [POST /api/pronosticos/finalizar] Petición para cerrar partido recibida en el controlador. Body:', req.body);
        try {
            const { partidoId, golesLocal, golesVisitante } = req.body;

            // 1. Validación estricta en la frontera
            if (partidoId === undefined || golesLocal === undefined || golesVisitante === undefined) {
                console.log('⚠️ [Validación Fallida - Finalizar]: Faltan datos para procesar los puntos.');
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios (partidoId, golesLocal, golesVisitante)" 
                });
            }

            console.log(`🔄 [Backend] Enviando datos al Caso de Uso de Puntos para el partido ID: ${partidoId}`);

            // 2. Ejecutamos el Caso de Uso de cálculo de puntos
            const resultadoProceso = await calcularPuntosUseCase.execute(
                Number(partidoId), 
                Number(golesLocal), 
                Number(golesVisitante)
            );

            console.log('✅ [Backend] ¡Cálculo de puntos finalizado de forma exitosa!');
            return res.status(200).json(resultadoProceso);

        } catch (error) {
            console.error('❌ [PronosticoController Error - Finalizar]:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

// Exportamos la instancia única que tu app.js llama con pronosticoController.create(req, res)
module.exports = new PronosticoController();