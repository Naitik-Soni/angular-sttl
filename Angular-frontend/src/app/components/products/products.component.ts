import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  isLoggedIn: boolean = false;
  userId: string | null = null;

  constructor(private router: Router, private productService: ProductService, private http: HttpClient) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.products = data;
    });

    this.userId = localStorage.getItem('userId');
    this.isLoggedIn = !!this.userId;
  }

  viewProductDetail(productId: any): void {
    console.log(productId);
    this.router.navigate(['/product-detail', productId]);
  }

  addToCart(product: Product): void {
    if (this.isLoggedIn && this.userId) {
      const cartItem = {
        user: this.userId,
        product: product._id,
        quantity: 1
      };

      this.http.post('http://localhost:8000/cart', cartItem).subscribe(response => {
        console.log('Product added to cart:', response);
      }, error => {
        console.error('Error adding product to cart:', error);
      });
    } else {
      let cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = cart.findIndex((item: any) => item.productId === product._id);

      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push({
          product : product,
          productId: product._id,
          quantity: 1
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Product added to local cart:', product);
    }
  }
}
