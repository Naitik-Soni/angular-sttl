import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import * as CartActions from './cart.actions';
import { CartItem } from '../../models/cartItem.model';

@Injectable()
export class CartEffects {
  constructor(private actions$: Actions, private cartService: CartService) {}

  updateCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItem),
      mergeMap(action =>
        this.cartService.updateCartItem(action.cartItem).pipe(
          map(updatedCartItem => CartActions.updateCartItemSuccess({ cartItem: updatedCartItem })),
          catchError(error => of(CartActions.updateCartItemFailure({ error })))
        )
      )
    )
  );

  removeCartItem$ = createEffect(() => this.actions$.pipe(
    ofType(CartActions.removeCartItem),
    mergeMap(({ userId, productId }) => this.cartService.removeCartItem(productId)
      .pipe(
        map(response => CartActions.removeCartItemSuccess({ productId: response })),
        catchError(error => of(CartActions.removeCartItemFailure({ error })))
      ))
    )
  );

}
