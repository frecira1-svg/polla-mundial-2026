require('dotenv').config(); // 🎯 Carga las variables de entorno (.env en la raíz)
const express = require('express');
const cors = require('cors');

// 📂 Rutas relativas corregidas (ya estamos dentro de 'src')
const partidoController = require('./infrastructure/controllers/partido.controller');
const usuarioController = require('./infrastructure/controllers/usuario.controller');
const pronosticoController = require('./infrastructure/controllers/pronostico.controller');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚡ Middlewares Globales
app.use(cors());
app.use(express.json());

// ─── ⚽ RUTAS DE LOS PARTIDOS ─────────────────────────────────────────
app.post('/api/partidos', (req, res) => partidoController.create(req, res));
app.get('/api/partidos', (req, res) => partidoController.getAll(req, res));
app.post('/api/partidos/resultado', (req, res) => partidoController.updateResultado(req, res));

// ─── 👥 RUTAS DE USUARIOS Y AUTENTICACIÓN ──────────────────────────────
app.post('/api/usuarios/registrar', (req, res) => usuarioController.register(req, res));
app.post('/api/usuarios/login', (req, res) => usuarioController.login(req, res)); 
app.get('/api/usuarios/ranking', (req, res) => usuarioController.getRanking(req, res));

// 🎯 ALIAS: Atrapa la petición directa que hace Angular para el ranking
app.get('/api/ranking', (req, res) => usuarioController.getRanking(req, res));

// ─── 🏆 RUTAS DE PRONÓSTICOS (APUESTAS) ────────────────────────────────
app.post('/api/pronosticos', (req, res) => pronosticoController.create(req, res));

// 🎯 LÍNEA NUEVA BLINDADA: Llama al controlador aislando errores de ejecución
app.post('/api/pronosticos/finalizar', async (req, res) => {
    try {
        await pronosticoController.finalizarPartido(req, res);
    } catch (error) {
        console.error('💥 Error crítico al ejecutar finalizarPartido:', error);
        res.status(500).json({ error: 'Error interno en el controlador', detalle: error.message });
    }
});

// 🛠️ ENDPOINT DE DIAGNÓSTICO DIRECTO (SALVAVIDAS)
app.post('/api/test-puente', (req, res) => {
    console.log('🔥 [Backend] ¡Petición de diagnóstico recibida con éxito!');
    return res.status(200).json({ status: "OK", message: "El servidor de Node está escuchando y actualizado." });
});

// ─── ARRANCAR EL MOTOR DEL SERVIDOR ────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n==================================================================`);
    console.log(` 🚀 [Backend] Servidor de la Polla Mundial ejecutándose con éxito `);
    console.log(` 🌐 URL local: http://localhost:${PORT}                           `);
    console.log(`==================================================================\n`);
});

module.exports = app;