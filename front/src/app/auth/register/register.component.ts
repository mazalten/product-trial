import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, ButtonModule, InputTextModule, CommonModule, CardModule, ToastModule],
})
export class RegisterComponent {
  username: string = '';
  firstname: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    const accountPayload = {
      username: this.username,
      firstname: this.firstname,
      email: this.email,
      password: this.password,
    };

    this.authService.register(accountPayload).subscribe({
      next: (response) => {
        this.successMessage = 'Account created successfully!';
        this.errorMessage = null;

        // Optionally redirect to login page after registration
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.successMessage = null;
        this.errorMessage = 'Error creating account. Please try again.';
      },
    });
  }
}
