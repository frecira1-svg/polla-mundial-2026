import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  nombreUsuario = 'Participante';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const guardado = localStorage.getItem('usuarioNombre');
    if (guardado) {
      this.nombreUsuario = guardado;
    }
  }

  onLogout(): void {
    console.log('🔄 Cerrando sesión...');
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
