import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../store/app.state';
import { loadCartItems, loadCartItemsSuccess, loadCartItemsFailure, removeCartItemSuccess, updateCartItemSuccess, removeCartItem } from '../store/cart/cart.actions';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from '../models/cartItem.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:8000/cart';

  constructor(private store: Store<AppState>,private http: HttpClient) {}

  loadCartItems(): void {
    const userId = localStorage.getItem('userId');

    if (userId) {
      // User is logged in, fetch cart items from the API
      this.http.get<any[]>(`${this.apiUrl}/${userId}`).subscribe(
        (cartItems) => {
          this.store.dispatch(loadCartItemsSuccess({ cartItems }));
        },
        (error) => {
          this.store.dispatch(loadCartItemsFailure({ error }));
        }
      );
    } else {
      // User is not logged in, fetch cart items from localStorage
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      this.store.dispatch(loadCartItemsSuccess({ cartItems: localCart }));
    }
  }

  // Update cart item quantity
  updateCartItem(item: CartItem): Observable<any> {
    if (!item.userId) {
      // Local storage operation
      let cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log(item);
      const existingItemIndex = cartItems.findIndex(i => i.product._id === item.product._id);
      if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity = item.quantity;
        localStorage.setItem('cart', JSON.stringify(cartItems));
        this.store.dispatch(updateCartItemSuccess({ cartItem: cartItems[existingItemIndex] }));
      }
      return new Observable(observer => {
        observer.next(cartItems);
        observer.complete();
      });
    } else {
      // API operation
      return this.http.put(`${this.apiUrl}/${item.product._id}`, item);
    }
  }

  // Remove cart item
  removeCartItem(productId: string): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      // Local storage operation
      let cartItems: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]');
      cartItems = cartItems.filter(i => i.product._id !== productId);
      localStorage.setItem('cart', JSON.stringify(cartItems));
      this.store.dispatch(removeCartItemSuccess({ productId }));
      return new Observable(observer => {
        observer.next(cartItems);
        observer.complete();
      });
    } else {
      // API operation
      console.log(userId,productId);
      return this.http.delete(`${this.apiUrl}/remove-from-cart`, { body: { userId, productId } });
    }
  }
}
