import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { CartState } from './cart.reducer';

export const selectCart = (state: AppState) => state.cart;

export const getCartItems = createSelector(
  selectCart,
  (state: CartState) => state.cartItems
);
