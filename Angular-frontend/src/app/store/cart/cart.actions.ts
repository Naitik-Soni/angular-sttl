import { createAction, props } from '@ngrx/store';
import { CartItem } from '../../models/cartItem.model';
import { Product } from '../../models/product.model';

export const loadCartItems = createAction('[Cart] Load Cart Items');

export const loadCartItemsSuccess = createAction(
  '[Cart] Load Cart Items Success',
  props<{ cartItems: any[] }>()
);

export const loadCartItemsFailure = createAction(
  '[Cart] Load Cart Items Failure',
  props<{ error: any }>()
);

export const addCartItem = createAction(
  '[Cart] Add Cart Item',
  props<{ item: CartItem }>()
);

export const removeCartItem = createAction(
  '[Cart] Remove Cart Item',
  props<{ userId: string; productId: string }>()
);

export const removeCartItemSuccess = createAction(
  '[Cart] Remove Cart Item Success',
  props<{ productId: string }>()
);

export const removeCartItemFailure = createAction(
  '[Cart] Remove Cart Item Failure',
  props<{ error: any }>()
);

export const updateCartItem = createAction('[Cart] Update Cart Item', props<{ cartItem: CartItem }>());
export const updateCartItemSuccess = createAction('[Cart] Update Cart Item Success', props<{ cartItem: CartItem }>());
export const updateCartItemFailure = createAction('[Cart] Update Cart Item Failure', props<{ error: any }>());

