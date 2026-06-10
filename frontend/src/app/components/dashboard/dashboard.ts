import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth'; //  Sin el .service porque tu archivo se llama auth.ts
import { NavbarComponent } from '../navbar/navbar'; // 👈 1. Importas

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent], // 👈 2. Lo registras aquí
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
 private authService: AuthService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/partidos';

  public partidos: any[] = [];
  public nombreUsuario: string = 'Invitado'; // Cambiamos el valor por defecto
  private usuarioId: number | null = null;    // Guardaremos el ID real aquí

  ngOnInit(): void {
    this.cargarUsuarioLogueado(); // Cargamos primero los datos del usuario
    this.cargarPartidos();
  }
// Método para extraer los datos reales del LocalStorage
  cargarUsuarioLogueado(): void {
    // 😎 Usamos "as any" al final para obligar a TypeScript a tratar la respuesta como válida
    const usuario = this.authService.getUsuarioActual() as any;

    if (usuario) {
      this.nombreUsuario = usuario.nombre;
      this.usuarioId = usuario.id;
      console.log(`👤 Usuario activo en el Dashboard: ${this.nombreUsuario} (ID: ${this.usuarioId})`);
    } else {
      console.warn('⚠️ No se encontró ningún usuario logueado en el LocalStorage.');
    }
  }

  cargarPartidos(): void {
  this.http.get<any>(this.apiUrl).subscribe({
    next: (data: any) => {
      const listaCruda = Array.isArray(data) ? data : (data.data || []);

      // 🎯 DICCIONARIO DE BANDERAS: Mapeamos el nombre del equipo con su código de país
      const codigosBanderas: { [key: string]: string } = {
        'México': 'mx',
        'Sudáfrica': 'za',
        'Colombia': 'co',
        'Brasil': 'br',
        'Argentina': 'ar',
        'Uruguay': 'uy',
        'Francia': 'fr',
        'España': 'es',
        'Alemania': 'de',
        'Inglaterra': 'gb' // Inglaterra usa gb o gb-eng en flagcdn
      };

      this.partidos = listaCruda.map((partido: any) => {
        const localNom = partido.equipoLocal || partido.equipo_local || 'Equipo Local';
        const visitanteNom = partido.equipoVisitante || partido.equipo_visitante || 'Equipo Visitante';

        return {
          id: partido.id,
          equipoLocal: localNom,
          equipoVisitante: visitanteNom,
          fechaHora: partido.fechaHora || partido.fecha_hora || new Date(),
          // 🚩 Generamos las URLs de las banderas dinámicamente
          banderaLocal: `https://flagcdn.com/w40/${codigosBanderas[localNom] || 'un'}.png`,
          banderaVisitante: `https://flagcdn.com/w40/${codigosBanderas[visitanteNom] || 'un'}.png`
        };
      });

      console.log('⚽ Partidos con banderas listas:', this.partidos);
    },
    error: (err: any) => {
      console.error('❌ Error al conectar con la API de partidos:', err);
      }
    });
  }
  guardarPronostico(partidoId: number, gLocal: string, gVisitante: string): void {
    // Validación de seguridad: si no hay usuario logueado, frenamos la operación
    if (!this.usuarioId) {
      alert('⚠️ Debes iniciar sesión para poder guardar pronósticos.');
      return;
    }

    // 🎯 AJUSTE: Renombramos las propiedades para que coincidan con el req.body del Backend
    const pronostico = {
  idUsuario: this.usuarioId, // 👈 Se envía la llave idUsuario para que el backend la lea correctamente
  idPartido: partidoId,
  golesLocal: gLocal === '' ? 0 : parseInt(gLocal),
  golesVisitante: gVisitante === '' ? 0 : parseInt(gVisitante)
};
    console.log('🚀 Enviando pronóstico estructurado al backend...', pronostico);

    const urlGuardar = 'http://localhost:3000/api/pronosticos';

    // Nota técnica: En el backend modificaremos el controlador para que reciba el idUsuario
    // directamente del JWT, pero por ahora se enviará este body estructurado.
    this.http.post<any>(urlGuardar, pronostico).subscribe({
      next: (response: any) => {
        console.log('✅ ¡GOOOL! Pronóstico guardado con éxito en la BD:', response);
        alert('⚽ ¡Pronóstico guardado correctamente!');
      },
      error: (err: any) => {
        console.error('❌ Error al procesar el pronóstico:', err);
        if (err.error && err.error.error) {
          console.log('📄 Motivo del rechazo del backend:', err.error.error);
          alert(`⚠️ Backend dice: ${err.error.error}`);
        } else {
          alert('⚠️ No se pudo guardar el pronóstico. Revisa la consola.');
        }
      }
    });
  }
}
