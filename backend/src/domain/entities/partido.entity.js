class Partido {
    // 🎯 CORRECCIÓN: El constructor ahora recibe y asigna las propiedades en camelCase
    constructor({ id, equipoLocal, equipoVisitante, fechaHora, golesLocal, golesVisitante, estado }) {
        this.id = id;
        this.equipoLocal = equipoLocal;
        this.equipoVisitante = equipoVisitante;
        this.fechaHora = fechaHora;
        this.golesLocal = golesLocal || null;
        this.golesVisitante = golesVisitante || null;
        this.estado = estado || 'pendiente'; // pendiente, finalizado
    }
}

module.exports = Partido;