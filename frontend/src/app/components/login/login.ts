import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // 👈 Agregamos RouterModule
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule // 👈 ¡Obligatorio para que la redirección e itinerarios funcionen en componentes Standalone!
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  successMessage = '';

  // Inyectamos el router y tu servicio de autenticación personalizado
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
  this.errorMessage = '';
  this.successMessage = '';

  const credenciales = { email: this.email, password: this.password };

  this.authService.login(credenciales).subscribe({
    next: (res) => {
      console.log('✅ Servidor respondió con éxito:', res);

      // 🛡️ CONTROL DE SEGURIDAD INTERNO:
      // Tu servidor puede devolver el usuario en 'res.usuario' o directo en 'res'.
      // Con esto nos aseguramos de capturarlo como sea que venga:
      const usuarioData = res?.usuario || res;

      const nombreUsuario = usuarioData?.nombre || 'Participante';
      const idUsuario = usuarioData?.id || '';

      // Mostramos el banner verde en la tarjeta de login
      this.successMessage = `¡Bienvenido de nuevo, ${nombreUsuario}!`;

      // 💾 Guardamos en el LocalStorage para que el Navbar y el Dashboard no se queden vacíos
      localStorage.setItem('usuarioNombre', nombreUsuario);
      if (idUsuario) {
        localStorage.setItem('usuarioId', idUsuario.toString());
      }

      // Limpiamos los campos del formulario
      this.email = '';
      this.password = '';

      // 🚀 Hacemos la magia del salto al Dashboard
      setTimeout(() => {
        console.log('✈️ Redirigiendo al Dashboard...');
        this.router.navigate(['/dashboard']);
      }, 1200);
    },
    error: (err) => {
      console.error('❌ Error en la petición de Login:', err);
      this.errorMessage = err.error?.error || 'Ocurrió un error al intentar iniciar sesión.';
    }
  });
}
}
