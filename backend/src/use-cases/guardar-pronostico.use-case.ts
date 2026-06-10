import { Pronostico } from '../domain/entities/pronostico.entity';
import { MySqlPronosticoRepository } from '../infrastructure/repositories/mysql-pronostico.repository';

export class GuardarPronosticoUseCase {
  constructor(private pronosticoRepository: MySqlPronosticoRepository) {}

  async execute(pronostico: Pronostico): Promise<boolean> {
    // Validación de reglas de negocio usando los nombres correctos
    if (pronostico.golesLocal < 0 || pronostico.golesVisitante < 0) {
      throw new Error("Los marcadores no pueden ser números negativos");
    }

    return await this.pronosticoRepository.guardarOActualizar(pronostico);
  }
}