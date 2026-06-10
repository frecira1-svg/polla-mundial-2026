import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin.html'
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);

  private apiPartidos = `${environment.apiUrl}/partidos`;
  private apiActualizar = `${environment.apiUrl}/partidos/resultado`;

  public partidos: any[] = [];

  ngOnInit(): void {
    this.cargarPartidos();
  }

  cargarPartidos(): void {
    this.http.get<any[]>(this.apiPartidos).subscribe({
      next: (data) => {
        this.partidos = data;
        console.log('⚙️ Admin: Partidos cargados para edición:', this.partidos);
      },
      error: (err) => console.error('❌ Error al cargar partidos en Admin:', err)
    });
  }

  guardarResultadoReal(partidoId: number, gLocal: string, gVisitante: string): void {
    const resultadoDefinitivo = {
      partido_id: partidoId,
      goles_local_real: gLocal === '' ? 0 : parseInt(gLocal),
      goles_visitante_real: gVisitante === '' ? 0 : parseInt(gVisitante)
    };

    console.log('📢 Enviando resultado oficial al backend...', resultadoDefinitivo);

    this.http.post<any>(this.apiActualizar, resultadoDefinitivo).subscribe({
      next: (response) => {
        console.log('✅ Resultado real guardado con éxito:', response);
        alert('🏆 ¡Resultado oficial publicado con éxito! Se recalcularán los puntos.');
        this.cargarPartidos();
      },
      error: (err) => {
        console.error('❌ Error al publicar resultado real:', err);
        alert('⚠️ No se pudo guardar el resultado oficial.');
      }
    });
  }
}
