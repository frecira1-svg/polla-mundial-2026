import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ESTA ES LA CLAVE: Asegúrate que tenga el 'export'
export interface Partido {
  id: number;
  equipo_local: string;
  equipo_visitante: string;
  estado: string;
  goles_local: number;
  goles_visitante: number;
  bandera_Visitante: string;
  bandera_Local: string;
}

@Injectable({ providedIn: 'root' })
export class PronosticoService {
  private apiUrl = 'http://localhost:3000/api/pronosticos';
  constructor(private http: HttpClient) { }

  // Firma con 4 argumentos
  guardarPronostico(idUsuario: number, idPartido: number, golesLocal: number, golesVisitante: number): Observable<any> {
    const body = { idUsuario, idPartido, golesLocal, golesVisitante };
    return this.http.post(`${this.apiUrl}`, body);
  }
}
