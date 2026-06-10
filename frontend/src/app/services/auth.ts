import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { }

  login(credenciales: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credenciales).pipe(
      tap(res => {
        // Guardamos los datos directos que nos devuelve el backend si viene el ID
        if (res && res.id) {
          localStorage.setItem('usuario_polla', JSON.stringify(res));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuario_polla');
  }

  // Extra: Método para obtener los datos del usuario logueado en cualquier componente
  getUsuarioActual(): any {
    const usuario = localStorage.getItem('usuario_polla');
    return usuario ? JSON.parse(usuario) : null;
  }
}
