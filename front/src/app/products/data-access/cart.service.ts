import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.model';
import { Cart } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = { products: [] };
  private cartSubject = new BehaviorSubject<Cart>(this.cart);  // Subject pour les changements du panier

  constructor() {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : { products: [] };
    this.cartSubject.next(this.cart);  // Initialiser le cartSubject avec l'état actuel
  }

  // Méthode pour ajouter un produit au panier
  addToCart(product: Product) {
    const existingProduct = this.cart.products.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.products.push({ ...product, quantity: 1 });
    }

    this.updateLocalStorage();
    this.cartSubject.next(this.cart);  // Notifier les abonnés du changement
  }

  // Récupérer la somme des quantités
  getTotalQuantity(): number {
    return this.cart.products.reduce((total, product) => total + product.quantity, 0);
  }

  // Méthode pour s'abonner aux changements du panier
  getCartObservable() {
    return this.cartSubject.asObservable();
  }

  getCart() {
    return this.cart;
  }

  // Sauvegarder le panier dans localStorage
  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  removeFromCart(productId: number): void {
    this.cart.products = this.cart.products.filter((product) => product.id !== productId);
    this.updateLocalStorage();
  }
}
