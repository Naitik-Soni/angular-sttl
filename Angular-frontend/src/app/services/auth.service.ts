import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000'; 

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login-user`, credentials).pipe(
      tap((response) => {
        this.handleLogin(response), this.syncLocalCartToDatabase(response._id);
      }),
      catchError((error) => {
        if (error.status === 400) {
          console.error('Login failed:', error.error.message);
          alert('Invalid email or password. Please try again.');
        }
        return of(error);
      })
    );
  }

  signup(userData: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-user`, userData).pipe(
      tap((response) => this.handleLogin(response)),
      catchError((error) => of(error))
    );
  }

  private handleLogin(response: any): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response._id);
  }

  logout(): Observable<any> {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    return this.http.get<any>(`${this.apiUrl}/logout`);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  syncLocalCartToDatabase(userId: string): void {
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (localCart.length > 0) {
      const cartItems = localCart.map((item: any) => ({
        user: userId,
        product: item.productId,
        quantity: item.quantity,
      }));
      console.log(cartItems);
      this.http.post('http://localhost:8000/sync-cart', cartItems).subscribe(
        (response) => {
          console.log('Local cart synced to database:', response);
          localStorage.removeItem('cart');
        },
        (error) => {
          console.error('Error syncing local cart to database:', error);
        }
      );
    }
  }
}
