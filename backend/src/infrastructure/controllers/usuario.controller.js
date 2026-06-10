const MySqlUsuarioRepository = require('../repositories/mysql-usuario.repository');
const RegisterUsuarioUseCase = require('../../use-cases/register-usuario.use-case');
const LoginUsuarioUseCase = require('../../use-cases/login-usuario.use-case'); 

const usuarioRepository = new MySqlUsuarioRepository();
const registerUsuarioUseCase = new RegisterUsuarioUseCase(usuarioRepository);
const loginUsuarioUseCase = new LoginUsuarioUseCase(usuarioRepository); 

class UsuarioController {
    
    async register(req, res) {
        console.log('📬 [POST /api/usuarios/registrar] Petición de registro. Body:', { ...req.body, password: '****' });
        try {
            const usuarioCreado = await registerUsuarioUseCase.execute(req.body);
            
            // 🎯 CORRECCIÓN SEGURA: Extraemos los datos para no devolver jamás la contraseña a Angular
            const respuestaLimpia = {
                id: usuarioCreado.id,
                nombre: usuarioCreado.nombre,
                email: usuarioCreado.email,
                puntosTotales: usuarioCreado.puntosTotales || 0
            };

            return res.status(201).json(respuestaLimpia);
        } catch (error) {
            console.error('❌ [UsuarioController Register Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    // 🔑 MÉTODO DE LOGIN
    async login(req, res) {
        console.log('📬 [POST /api/usuarios/login] Intento de login para:', req.body.email);
        try {
            const { email, password } = req.body;

            // Validación veloz en la frontera
            if (!email || !password) {
                return res.status(400).json({ error: "El email y la contraseña son requeridos." });
            }

            const resultado = await loginUsuarioUseCase.execute({ email, password });
            return res.status(200).json(resultado);
        } catch (error) {
            console.error('❌ [UsuarioController Login Error]:', error.message);
            return res.status(400).json({ error: error.message });
        }
    }

    // 🏆 MÉTODO PARA EL RANKING (Tabla de posiciones)
    async getRanking(req, res) {
        console.log('🔍 [GET /api/usuarios/ranking] Solicitando tabla de posiciones...');
        try {
            // El repositorio se encarga directamente de tirar el SELECT de los puntajes
            const ranking = await usuarioRepository.getRanking();
            return res.status(200).json(ranking);
        } catch (error) {
            console.error('❌ [UsuarioController Ranking Error]:', error.message);
            return res.status(500).json({ error: 'Error interno al cargar el ranking de la polla.' });
        }
    }
}

// Exportamos como instancia única que calza al 100% con tu app.js
module.exports = new UsuarioController();