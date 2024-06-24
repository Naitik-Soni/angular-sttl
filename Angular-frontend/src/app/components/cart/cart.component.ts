import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CartItem } from '../../models/cartItem.model';
import { AppState } from '../../store/app.state';
import { getCartItems } from '../../store/cart/cart.selectors';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { removeCartItem, removeCartItemSuccess } from 'src/app/store/cart/cart.actions';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems$: Observable<CartItem[]>;

  constructor(private store: Store<AppState>, private cartService: CartService,private router: Router) {
    this.cartItems$ = this.store.select(getCartItems);
  }

  ngOnInit(): void {
    this.cartService.loadCartItems();
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    const updatedItem: CartItem = { ...item, quantity: newQuantity };
    this.cartService.updateCartItem(updatedItem).subscribe(updatedItems => {
      console.log('Cart item updated:', updatedItems);
    }, error => {
      console.error('Error updating cart item:', error);
    });
  }

  removeFromCart(productId: string): void {
    const userId = localStorage.getItem('userId');
    this.cartService.removeCartItem(productId).subscribe(updatedItems => {
      this.store.dispatch(removeCartItemSuccess({ productId }));
      console.log('Cart item removed:', updatedItems);
    }, error => {
      console.error('Error removing cart item:', error);
    });
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
