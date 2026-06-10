const bcrypt = require('bcryptjs'); // 🎯 CORREGIDO: Usando la librería estandarizada bcryptjs

class LoginUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(credentials) {
        const { email, password } = credentials;

        // 1. Validar campos obligatorios en el Dominio
        if (!email || !password) {
            throw new Error('El correo y la contraseña son obligatorios.');
        }

        // 2. Buscar al usuario en la base de datos
        const usuario = await this.usuarioRepository.findByEmail(email);
        if (!usuario) {
            throw new Error('El correo electrónico no está registrado.');
        }

        // 3. Verificar si la contraseña coincide con el hash encriptado de la BD
        const passwordValido = await bcrypt.compare(password, usuario.password);
        if (!passwordValido) {
            throw new Error('La contraseña es incorrecta.');
        }

        // 4. 🎯 CORRECCIÓN: Devolvemos los datos seguros incluyendo los puntos acumulados
        // mapeados con el estándar camelCase que espera tu frontend.
        console.log(`🔑 [Caso de Uso] Login exitoso para el usuario: ${usuario.nombre} (ID: ${usuario.id})`);
        
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            puntosTotales: usuario.puntosTotales || 0, // 👈 Clave para el Dashboard de Angular
            mensaje: '¡Autenticación exitosa!'
        };
    }
}

module.exports = LoginUsuarioUseCase;