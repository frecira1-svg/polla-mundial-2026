class Pronostico {
    constructor({ id, usuario_id, partido_id, goles_local, goles_visitante, fecha_pronostico, puntos_ganados }) {
        this.id = id;
        this.usuario_id = usuario_id;
        this.partido_id = partido_id;
        this.goles_local = goles_local;
        this.goles_visitante = goles_visitante;
        this.fecha_pronostico = fecha_pronostico || new Date();
        this.puntos_ganados = puntos_ganados || 0;
    }
}

module.exports = Pronostico; // 🎯 Cambiado a CommonJS para que funcione con tus require