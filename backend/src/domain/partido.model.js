class Partido {
    constructor({ id, equipoLocal, equipoVisitante, fechaHora, golesLocal = null, golesVisitante = null, estado = 'pendiente' }) {
        this.id = id;
        this.equipoLocal = equipoLocal;
        this.equipoVisitante = equipoVisitante;
        this.fechaHora = fechaHora;
        this.golesLocal = golesLocal;
        this.golesVisitante = golesVisitante;
        this.estado = estado; // 'pendiente', 'jugando', 'finalizado'
    }
}

module.exports = Partido;