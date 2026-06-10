const bcrypt = require('bcryptjs');

class RegisterUsuarioUseCase {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    async execute(usuarioData) {
        // 1. Validaciones básicas de negocio (Campos obligatorios)
        if (!usuarioData.nombre || !usuarioData.email || !usuarioData.password) {
            throw new Error('Faltan campos obligatorios (nombre, email o password).');
        }

        if (!usuarioData.email.includes('@')) {
            throw new Error('El formato del correo electrónico no es válido.');
        }

        // 2. Verificar si el correo ya existe en el sistema
        const usuarioExistente = await this.usuarioRepository.findByEmail(usuarioData.email);
        if (usuarioExistente) {
            throw new Error('Este correo electrónico ya se encuentra registrado.');
        }

        // 3. Encriptar la contraseña de forma segura (10 rondas)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuarioData.password, salt);

        // 4. 🎯 CORRECCIÓN: Estructuramos el objeto explícitamente asegurando el camelCase
        // y definiendo el estado inicial de puntos en el Dominio.
        const nuevoUsuarioData = {
            nombre: usuarioData.nombre.trim(),
            email: usuarioData.email.trim().toLowerCase(),
            password: hashedPassword,
            puntosTotales: 0 // Todo jugador del Mundial arranca con 0 puntos
        };

        console.log(`🤖 [Caso de Uso] Registrando nuevo jugador en el sistema: ${nuevoUsuarioData.nombre}`);

        return await this.usuarioRepository.create(nuevoUsuarioData);
    }
}

module.exports = RegisterUsuarioUseCase;