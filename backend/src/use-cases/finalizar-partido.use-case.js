class FinalizarPartidoUseCase {
    constructor(partidoRepository, pronosticoRepository, rankingRepository) {
        this.partidoRepository = partidoRepository;
        this.pronosticoRepository = pronosticoRepository;
        this.rankingRepository = rankingRepository;
    }

    async execute(partidoId, golesLocalReal, golesVisitanteReal) {
        console.log(`🤖 [Caso de Uso] Finalizando partido ${partidoId}. Resultado: ${golesLocalReal}-${golesVisitanteReal}`);

        // 1. Actualizar el estado del partido a 'finalizado' con su resultado real
        await this.partidoRepository.actualizarResultado(partidoId, golesLocalReal, golesVisitanteReal);

        // 2. Traer todos los pronósticos que la gente hizo para ese partido
        const pronosticos = await this.pronosticoRepository.getByPartidoId(partidoId);

        // 3. Calcular puntos para cada usuario
        for (const pronostico of pronosticos) {
            let puntosGanados = 0;

            const coincidioMarcadorExacto = 
                pronostico.golesLocal === golesLocalReal && 
                pronostico.golesVisitante === golesVisitanteReal;

            if (coincidioMarcadorExacto) {
                puntosGanados = 3; // 🏆 ¡Marcador exacto!
            } else {
                // Verificar si adivinó la tendencia (Ganó Local, Gan