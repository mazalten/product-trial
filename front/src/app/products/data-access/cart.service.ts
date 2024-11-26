import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from './product.model';
import { Cart } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = 'http://localhost:8080'; // URL du backend

  private cart: Cart = { products: [] };
  private cartSubject = new BehaviorSubject<Cart>(this.cart);  // Subject pour notifier les changements du panier

  constructor(private http: HttpClient) {
    const storedCart = localStorage.getItem('cart');
    this.cart = storedCart ? JSON.parse(storedCart) : { products: [] };

    // Récupérer le panier du backend si l'utilisateur est connecté
    this.syncCartWithBackend();
    this.cartSubject.next(this.cart);  // Initialiser le cartSubject avec l'état actuel
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken');  // Récupérer le token JWT de localStorage
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Synchroniser le panier avec le backend (s'il existe un panier côté serveur)
  private syncCartWithBackend() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.http.get<Cart>(`${this.apiUrl}/api/cart`, { headers: this.getAuthHeaders() }).subscribe({
        next: (cart) => {
          this.cart = cart;
          this.updateLocalStorage();
          this.cartSubject.next(this.cart);
        },
        error: (err) => {
          console.log('Erreur lors de la récupération du panier depuis le backend', err);
        },
      });
    }
  }

  // Ajouter un produit au panier (localStorage + backend)
  addToCart(product: Product) {
    const existingProduct = this.cart.products.find((p) => p.id === product.id);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      this.cart.products.push({ ...product, quantity: 1 });
    }

    this.updateLocalStorage();
    this.cartSubject.next(this.cart);  // Notifier les abonnés du changement

    // Sauvegarder les changements côté backend
    this.updateCartOnBackend();
  }

  // Mettre à jour le panier côté backend
  private updateCartOnBackend() {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.http.post(`${this.apiUrl}/api/cart/update`, this.cart, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          console.log('Panier mis à jour avec succès sur le backend');
        },
        error: (err) => {
          console.log('Erreur lors de la mise à jour du panier sur le backend', err);
        },
      });
    }
  }

  // Récupérer la somme des quantités
  getTotalQuantity(): number {
    return this.cart.products.reduce((total, product) => total + product.quantity, 0);
  }

  // Méthode pour s'abonner aux changements du panier
  getCartObservable() {
    return this.cartSubject.asObservable();
  }

  // Récupérer le panier local
  getCart() {
    return this.cart;
  }

  // Sauvegarder le panier dans localStorage
  private updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Supprimer un produit du panier (localStorage + backend)
  removeFromCart(productId: number): void {
    this.cart.products = this.cart.products.filter((product) => product.id !== productId);
    this.updateLocalStorage();
    this.cartSubject.next(this.cart);  // Notifier les abonnés du changement

    // Supprimer du panier côté backend
    this.removeFromCartBackend(productId);
  }

  // Supprimer un produit du panier côté backend
  private removeFromCartBackend(productId: number) {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      this.http.delete(`${this.apiUrl}/api/cart/remove/${productId}`, { headers: this.getAuthHeaders() }).subscribe({
        next: () => {
          console.log('Produit supprimé du panier sur le backend');
        },
        error: (err) => {
          console.log('Erreur lors de la suppression du produit du panier sur le backend', err);
        },
      });
    }
  }
}
