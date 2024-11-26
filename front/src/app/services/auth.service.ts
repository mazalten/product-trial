import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080'; // URL du backend

  constructor(private http: HttpClient) {}

  // Créer un compte utilisateur
  createAccount(accountData: { username: string; firstname: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/account`, accountData);
  }

  // Connexion utilisateur
  login(credentials: { email: string; password: string }): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/token`, credentials);
  }

  // Stocker le token dans le localStorage
  storeToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  register(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/account`, payload);
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('jwtToken');
  }
}
