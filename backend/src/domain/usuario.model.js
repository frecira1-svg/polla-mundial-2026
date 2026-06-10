class Usuario {
    constructor({ id, nombre, email, password, puntosTotales = 0 }) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password; // Aquí viajará encriptada
        this.puntosTotales = puntosTotales;
    }
}

module.exports = Usuario;