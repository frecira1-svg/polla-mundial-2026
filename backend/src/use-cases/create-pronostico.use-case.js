class GuardarPronosticoUseCase {
    constructor(pronosticoRepository, partidoRepository) {
        this.pronosticoRepository = pronosticoRepository;
        this.partidoRepository = partidoRepository; // Necesario para validar el estado del partido real
    }

    async execute(pronosticoData) {
        // 🎯 CORRECCIÓN: Desestructuramos usando las variables en camelCase estandarizadas
        const { idUsuario, idPartido, golesLocal, golesVisitante } = pronosticoData;

        // 1. Validar campos obligatorios en el Dominio
        if (idUsuario === undefined || idPartido === undefined || golesLocal === undefined || golesVisitante === undefined) {
            throw new Error('Faltan datos obligatorios para registrar el pronóstico.');
        }

        // 2. Buscar el partido en el repositorio para verificar su estado real
        const partido = await this.partidoRepository.getById(idPartido);
        if (!partido) {
            throw new Error('El partido especificado no existe en el fixture.');
        }

        // 3. Regla de Oro: No apostar ni modificar si el partido ya arrancó o finalizó
        if (partido.estado !== 'pendiente') {
            throw new Error('No se pueden registrar ni modificar pronósticos para partidos que ya iniciaron o finalizaron.');
        }

        // 4. Regla de tiempo estricta: Comparar la hora actual con la del partido
        const ahora = new Date();
        const fechaPartido = new Date(partido.fechaHora); // Usamos la propiedad mapeada en camelCase
        if (ahora >= fechaPartido) {
            throw new Error('El tiempo límite para guardar o modificar tu pronóstico en este partido ya expiró.');
        }

        // 🎯 CORRECCIÓN LOGÍSTICA: Quitamos el bloqueo del "duplicado" para permitir la re-apuesta.
        // Gracias al ON DUPLICATE KEY UPDATE de MySQL, si ya existe, se actualizará el marcador limpiamente.
       // ... Todo tu código de validaciones idéntico arriba ...

        console.log(`🤖 [Caso de Uso] Procesando pronóstico del usuario ${idUsuario} para el partido ${idPartido}...`);
        
        return await this.pronosticoRepository.guardarOActualizar({
            idUsuario,
            idPartido,
            golesLocal,
            golesVisitante
        });
    }
}

// 🎯 CORRECCIÓN CLAVE: Exportación directa de la clase para que el controlador pueda hacerle 'new'
module.exports = GuardarPronosticoUseCase;