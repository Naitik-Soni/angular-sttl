import { createReducer, on } from '@ngrx/store';
import { CartItem } from '../../models/cartItem.model';
import { addCartItem, removeCartItem,loadCartItems, loadCartItemsSuccess, loadCartItemsFailure, removeCartItemSuccess,updateCartItemSuccess, updateCartItemFailure, removeCartItemFailure } from './cart.actions';

export interface CartState {
  cartItems: CartItem[];
  error:any;
}

export const initialState: CartState = {
  cartItems: [],
  error: null
};

export const cartReducer = createReducer(
  initialState,
  on(loadCartItems, state => ({ ...state })),
  on(addCartItem, (state, { item }) => ({
    ...state,
    cartItems: [...state.cartItems, item]
  })),
  on(loadCartItemsSuccess, (state, { cartItems }) => ({ ...state, cartItems })),
  on(loadCartItemsFailure, (state, { error }) => ({ ...state, error })),
  on(removeCartItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(removeCartItemSuccess, (state, { productId }) => ({
    ...state,
    cartItems: state.cartItems.filter(item => item.product._id !== productId),
    loading: false,
    error: null
  })),

  on(removeCartItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error
  })),
  on(updateCartItemSuccess, (state, { cartItem }) => ({
    ...state,
    cartItems: state.cartItems.map(item =>
      item.product._id === cartItem.product._id ? cartItem : item
    ),
    error: null
  })),
  on(updateCartItemFailure, (state, { error }) => ({
    ...state,
    error
  }))
);
