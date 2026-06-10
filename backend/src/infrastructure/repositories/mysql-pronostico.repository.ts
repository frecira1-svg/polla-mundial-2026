const PronosticoController = require('../../controllers/pronostico.controller');
// 🎯 IMPORTACIONES DE ARQUITECTURA LIMPIA
const MySqlPronosticoRepository = require('../repositories/mysql-pronostico.repository');
const MySqlPartidoRepository = require('../repositories/mysql-partido.repository'); // Para validar el partido en create
const MySqlUsuarioRepository = require('../repositories/mysql-usuario.repository'); // Para sumar los puntos

const GuardarPronosticoUseCase = require('../../use-cases/guardar-pronostico.use-case');
const CalcularPuntosUseCase = require('../../use-cases/calcular-puntos.use-case');

// Instanciamos los repositorios
const pronosticoRepository = new MySqlPronosticoRepository();
const partidoRepository = new MySqlPartidoRepository();
const usuarioRepository = new MySqlUsuarioRepository();

// Instanciamos los Casos de Uso inyectando sus dependencias requeridas
const guardarUseCase = new GuardarPronosticoUseCase(pronosticoRepository, partidoRepository);
const calcularPuntosUseCase = new CalcularPuntosUseCase(pronosticoRepository, usuarioRepository);

class PronosticoController {

    /**
     * ⚽ REGISTRAR O ACTUALIZAR PRONÓSTICO (FLUJO EXISTENTE)
     */
    async create(req, res) {
        try {
            // 1. Log de control en la terminal para verificar la llegada desde Angular
            console.log('📦 [Backend] Datos crudos recibidos:', req.body);

            const { idUsuario, idPartido, golesLocal, golesVisitante } = req.body;

            // 2. Validación estricta de IDs esenciales
            if (idUsuario === undefined || idUsuario === null || idPartido === undefined || idPartido === null) {
                console.log('⚠️ [Validación Fallida]: idUsuario o idPartido vienen nulos o ausentes.');
                return res.status(400).json({ 
                    error: "Faltan los identificadores obligatorios (idUsuario o idPartido)" 
                });
            }

            // 3. Normalización de marcadores (si vienen vacíos "" desde el input de Angular, se vuelven 0)
            const golesLocalFinal = (golesLocal === undefined || golesLocal === null || golesLocal === '') ? 0 : Number(golesLocal);
            const golesVisitanteFinal = (golesVisitante === undefined || golesVisitante === null || golesVisitante === '') ? 0 : Number(golesVisitante);

            // 4. Construcción de la Entidad EXACTAMENTE como la mapea tu repositorio
            const pronosticoData = {
                idUsuario: Number(idUsuario),
                idPartido: Number(idPartido),
                golesLocal: golesLocalFinal,
                golesVisitante: golesVisitanteFinal
            };

            console.log('🔄 [Backend] Enviando entidad limpia al Caso de Uso:', pronosticoData);

            // 5. Ejecución del flujo a través de la Arquitectura Limpia
            const resultado = await guardarUseCase.execute(pronosticoData);

            if (resultado) {
                console.log('✅ [Backend] ¡Pronóstico guardado/actualizado con éxito en MySQL!');
                return res.status(200).json({ 
                    message: "¡Pronóstico procesado con éxito!", 
                    data: pronosticoData 
                });
            }
            
            return res.status(400).json({ error: "La base de datos no confirmó filas afectadas." });

        } catch (error) {
            console.error('❌ [Controlador Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    /**
     * 🏁 FINALIZAR PARTIDO Y CALCULAR PUNTOS (NUEVO FLUJO)
     */
    async finalizarPartido(req, res) {
        console.log('🏁 [POST /api/pronosticos/finalizar] Petición entrante para cerrar partido y calcular puntos.');
        try {
            const { partidoId, golesLocal, golesVisitante } = req.body;

            // 1. Validación de campos requeridos para el cálculo
            if (partidoId === undefined || golesLocal === undefined || golesVisitante === undefined) {
                console.log('⚠️ [Validación Fallida]: Faltan datos para finalizar el partido.');
                return res.status(400).json({ 
                    error: "Faltan datos obligatorios (partidoId, golesLocal, golesVisitante)" 
                });
            }

            // 2. Ejecutamos el motor de puntos en el Caso de Uso de la Arquitectura Limpia
            const resultadoProceso = await calcularPuntosUseCase.execute(
                Number(partidoId), 
                Number(golesLocal), 
                Number(golesVisitante)
            );

            console.log('✅ [Backend] Proceso de puntos completado de forma exitosa.');
            return res.status(200).json(resultadoProceso);

        } catch (error) {
            console.error('❌ [Controlador Error - Finalizar]:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

// 🎯 EXPORTACIÓN: Instancia única para las rutas
module.exports = new PronosticoController();