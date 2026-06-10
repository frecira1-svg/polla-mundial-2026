class ObtenerRankingUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute() {
        // Aquí podrías meter reglas de negocio si hiciera falta
        return await this.usuarioRepository.getRanking();
    }
}

module.exports = ObtenerRankingUseCase;