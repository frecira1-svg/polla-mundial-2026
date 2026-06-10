import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './ranking.html'
})
export class RankingComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/ranking';

  // 🎯 UNIFICADO: Dejamos el nombre 'listaRanking' que espera el HTML
  public listaRanking: any[] = [];

  ngOnInit(): void {
    this.cargarRanking();
  }

  cargarRanking(): void {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.listaRanking = data;
        console.log('🏆 Ranking cargado con éxito desde el Servidor:', this.listaRanking);
      },
      error: (err) => {
        console.error('❌ Error al obtener el ranking del servidor:', err);

        // 🎯 MOCK CORREGIDO: Usamos 'puntosTotales' para que el HTML no se quede en blanco
        this.listaRanking = [
          { id: 1, nombre: 'Freddy Ciro', puntosTotales: 15 },
          { id: 2, nombre: 'Ana María', puntosTotales: 12 },
          { id: 3, nombre: 'Miguel Ciro', puntosTotales: 9 },
          { id: 4, nombre: 'Juan Pérez', puntosTotales: 3 }
        ];
      }
    });
  }
}
