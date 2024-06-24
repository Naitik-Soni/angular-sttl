import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(private authService: AuthService,private router:Router) {}

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log('Logout successful:', response);
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Logout failed:', error);
      }
    );
  }
}
