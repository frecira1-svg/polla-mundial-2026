class Pronostico {
    constructor({ id, idUsuario, idPartido, golesLocal, golesVisitante, fechaRegistro = new Date(), puntosGanados = 0 }) {
        this.id = id;
        this.idUsuario = idUsuario;
        this.idPartido = idPartido;
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        this.fechaRegistro = fechaRegistro;
        this.puntosGanados = puntosGanados; // Se calculará cuando el partido real termine
    }
}

module.exports = Pronostico;