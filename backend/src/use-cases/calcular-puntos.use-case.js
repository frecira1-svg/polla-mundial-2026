class CalcularPuntosUseCase {
    constructor(pronosticoRepository, usuarioRepository) {
        this.pronosticoRepository = pronosticoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    async execute(partidoId, golesLocalReal, golesVisitanteReal) {
        console.log(`🤖 [Caso de Uso] Procesando puntos del Partido ID: ${partidoId}. Real: ${golesLocalReal}-${golesVisitanteReal}`);

        // 1. Traer todos los pronósticos que hicieron los usuarios para este partido
        // Nota: Asegúrate de que tu mysql-pronostico.repository tenga un método similar para filtrar por partido
        const pronosticos = await this.pronosticoRepository.getByPartidoId(partidoId);
        
        if (!pronosticos || pronosticos.length === 0) {
            console.log('⚠️ No se encontraron pronósticos registrados para este partido.');
            return { message: "Proceso terminado. No hay apuestas para evaluar." };
        }

        // Determinar el resultado real (G = Ganó Local, V = Ganó Visitante, E = Empate)
        const resultadoReal = golesLocalReal > golesVisitanteReal ? 'G' : golesLocalReal < golesVisitanteReal ? 'V' : 'E';

        // 2. Evaluar cada pronóstico con las reglas (3 puntos exacto, 1 punto ganador/empate)
        for (const pronostico of pronosticos) {
            let puntosGanados = 0;

            const gLocalPronostico = Number(pronostico.golesLocal);
            const gVisitantePronostico = Number(pronostico.golesVisitante);
            const resultadoPronostico = gLocalPronostico > gVisitantePronostico ? 'G' : gLocalPronostico < gVisitantePronostico ? 'V' : 'E';

            // Marcador Exacto -> 3 Puntos
            if (gLocalPronostico === golesLocalReal && gVisitantePronostico === golesVisitanteReal) {
                puntosGanados = 3;
            } 
            // Acierto de Ganador o de Empate -> 1 Punto
            else if (resultadoPronostico === resultadoReal) {
                puntosGanados = 1;
            }

            // 3. Si acumuló puntos, se actualiza el registro en MySQL
            if (puntosGanados > 0) {
                console.log(`🎯 Usuario ID ${pronostico.idUsuario} sumó +${puntosGanados} puntos.`);
                await this.usuarioRepository.sumarPuntos(pronostico.idUsuario, puntosGanados);
            }
        }

        return { success: true, message: `¡Puntos calculados con éxito para ${pronosticos.length} pronósticos!` };
    }
}

module.exports = CalcularPuntosUseCase;