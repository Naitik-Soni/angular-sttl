import { Product } from './product.model';

export interface CartItem {
  userId : String;
  product: Product;
  quantity: number;
}
