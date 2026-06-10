const MySqlUsuarioRepository = require('../repositories/mysql-usuario.repository');
const LoginUsuarioUseCase = require('../../use-cases/login-usuario.use-case');

// Instanciamos las dependencias de manera limpia
const usuarioRepository = new MySqlUsuarioRepository();
const loginUsuarioUseCase = new LoginUsuarioUseCase(usuarioRepository);

class AuthController {

    async login(req, res) {
        try {
            const { email, password } = req.body;

            console.log('📬 [Backend] Intento de login para:', email);

            // Validación previa en la frontera (Controller) para proteger el Caso de Uso
            if (!email || !password) {
                console.log('⚠️ [Validación Fallida]: Email o contraseña ausentes.');
                return res.status(400).json({ 
                    error: "El email y la contraseña son campos obligatorios." 
                });
            }

            // Ejecutamos el caso de uso pasando los datos limpios
            const resultado = await loginUsuarioUseCase.execute({ email, password });
            
            // Si tiene éxito, devolvemos los datos del usuario logueado (en formato camelCase)
            console.log('✅ [Backend] Login exitoso para:', email);
            return res.status(200).json(resultado);

        } catch (error) {
            console.error('❌ [AuthController Error]:', error.message);
            // Retornamos 401 si es un fallo de credenciales o 400 según corresponda
            return res.status(400).json({ error: error.message });
        }
    }
}

// Exportamos la instancia única (Singleton) para que calce con tu app.js
module.exports = new AuthController();