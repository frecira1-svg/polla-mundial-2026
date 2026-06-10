import { Partido } from './partido';

describe('Partido Model', () => {
  it('debería crear una instancia válida', () => {
    // Si es una clase, la instanciamos
    const partido: Partido = {
      id: 1,
      equipo_local: 'Equipo A',
      equipo_visitante: 'Equipo B',
      estado: 'PENDIENTE',
      goles_local: 0,
      goles_visitante: 0
    };

    expect(partido.id).toBe(1);
    expect(partido.estado).toBe('PENDIENTE');
  });
});
