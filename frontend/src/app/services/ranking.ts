import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartidoService, Ranking } from '../../services/partido'; // ✅ Importamos el servicio y la interfaz

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.html',
  styleUrls: ['./ranking.css']
})
export class RankingComponent implements OnInit {
  // 💉 Inyectamos de forma moderna tu servicio de partidos/ranking
  private partidoService = inject(PartidoService);

  // 🏆 Array tipado con nuestra interfaz para almacenar las posiciones
  public listaRanking: Ranking[] = [];

  ngOnInit(): void {
    this.cargarTablaPosiciones();
  }

  // 📡 Método para conectar con el servicio y traer los datos del backend
  cargarTablaPosiciones(): void {
    this.partidoService.obtenerRanking().subscribe({
      next: (data: Ranking[]) => {
        this.listaRanking = data;
        console.log('🏆 Tabla de posiciones cargada con éxito:', this.listaRanking);
      },
      error: (error) => {
        console.error('❌ Error al consultar el ranking en el backend:', error);
      }
    });
  }
}
