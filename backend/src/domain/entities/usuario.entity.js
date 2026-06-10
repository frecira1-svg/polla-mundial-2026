class Usuario {
    constructor({ id, nombre, email, password, rol, puntos }) {
        this.id = id;
        this.nombre = nombre;
        this.email = email;
        this.password = password;
        this.rol = rol || 'usuario'; // usuario, administrador
        this.puntos = puntos || 0;
    }
}

module.exports = Usuario;