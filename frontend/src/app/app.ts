import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // 👈 Solo dejamos el RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // 👈 Limpiamos el LoginComponent de aquí
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Polla Mundial 2026';
}
