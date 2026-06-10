import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PronosticoService } from '../../services/pronostico.service';
import { Partido } from '../../services/pronostico.service'; // Asegúrate de que la interfaz esté ahí
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-partidos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './partidos.html'
})
export class PartidosComponent implements OnInit {
  private pronosticoService = inject(PronosticoService);

  // Ajusta esto: si tienes un AuthService, obtén el ID de ahí
  private idUsuarioLogueado: number = 1;

  public listaPartidos: Partido[] = [];
  public loading: boolean = true;
  public pronosticosTemporales: { [key: number]: { goles_local: number, goles_visitante: number } } = {};

  ngOnInit(): void {
    this.cargarCalendario();
  }

  cargarCalendario(): void {
    // Si tu servicio tiene el método obtenerPartidos, úsalo aquí
    // @ts-ignore
    this.pronosticoService.obtenerPartidos().subscribe({
      next: (data: Partido[]) => {
        this.listaPartidos = data;
        this.listaPartidos.forEach(partido => {
          if (partido.estado === 'PENDIENTE') {
            this.pronosticosTemporales[partido.id] = { goles_local: 0, goles_visitante: 0 };
          }
        });
        this.loading = false;
      },
      error: (err: any) => { console.error(err); this.loading = false; }
    });
  }

  enviarApuesta(idPartido: number): void {
    const p = this.pronosticosTemporales[idPartido];

    // Se envían los 4 parámetros que exige tu servicio
    this.pronosticoService.guardarPronostico(
      this.idUsuarioLogueado,
      idPartido,
      p.goles_local,
      p.goles_visitante
    ).subscribe({
      next: (res: any) => {
        alert('🎯 ¡Pronóstico guardado!');
      },
      error: (err: any) => {
        console.error('Error al guardar:', err);
        alert('❌ Error al guardar el pronóstico');
      }
    });
  }
}
