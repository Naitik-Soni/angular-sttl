import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../../store/app.state';
import { CartItem } from '../../models/cartItem.model';
import { CartService } from '../../services/cart.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './confirmation-dialog.component'; 

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
[x: string]: any;
  checkoutForm!: FormGroup;
  showConfirmation = false;
  cartItems$: Observable<CartItem[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private cartService: CartService,
    private dialog: MatDialog
  ) {
    this.cartItems$ = this.store.select(state => state.cart.cartItems);
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      paymentDetails: ['', Validators.required]
    });
  }

  getTotal(): number {
    let total = 0;
    this.cartItems$.subscribe(items => {
      items.forEach(item => {
        total += item.product.price * item.quantity;
      });
    });
    return total;
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      const orderDetails: {
        name: string;
        address: string;
        paymentDetails: string;
        items: CartItem[];
      } = {
        name: this.checkoutForm.get('name')!.value,
        address: this.checkoutForm.get('address')!.value,
        paymentDetails: this.checkoutForm.get('paymentDetails')!.value,
        items: []
      };
      this.cartItems$.subscribe(items => {
        orderDetails.items = items;
      });

      console.log('Order submitted', orderDetails);

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: { message: 'Thank you for your order! Your order has been placed successfully.' }
      });
      this.checkoutForm.reset();
    }
  }
}
