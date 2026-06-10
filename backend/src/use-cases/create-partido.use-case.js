class CreatePartidoUseCase {
    constructor(partidoRepository) {
        this.partidoRepository = partidoRepository;
    }

    async execute(partidoData) {
        // 🎯 CORRECCIÓN: Validamos usando las propiedades estandarizadas en camelCase
        if (!partidoData.equipoLocal || !partidoData.equipoVisitante || !partidoData.fechaHora) {
            throw new Error('Faltan datos obligatorios para crear el partido (equipos o fecha).');
        }
        
        if (partidoData.equipoLocal.trim().toLowerCase() === partidoData.equipoVisitante.trim().toLowerCase()) {
            throw new Error('El equipo local y el visitante no pueden ser el mismo país.');
        }

        // Si todo está bien, se lo manda al repositorio (que ya sabe traducir de camelCase a la BD)
        return await this.partidoRepository.create(partidoData);
    }
}

module.exports = CreatePartidoUseCase;