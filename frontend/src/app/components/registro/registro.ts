import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html'
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  private registerUrl = 'http://localhost:3000/api/usuarios/registrar';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const nuevoUsuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password
    };

    console.log('🚀 Enviando datos de registro al backend...', nuevoUsuario);

    this.http.post<any>(this.registerUrl, nuevoUsuario).subscribe({
      next: (res) => {
        console.log('✅ Usuario registrado con éxito:', res);
        this.successMessage = '¡Registro exitoso! Redirigiendo al login...';

        // Limpiamos los campos
        this.nombre = '';
        this.email = '';
        this.password = '';

        // Esperamos 1.5 segundos y lo mandamos a loguearse
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        console.error('❌ Error en el registro:', err);
        this.errorMessage = err.error?.error || 'No se pudo crear la cuenta. Intenta con otro correo.';
      }
    });
  }
}
