import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="login-page">
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">Welcome Back</h1>
          <p class="login-subtitle">Sign in to continue</p>
          
          <form (ngSubmit)="onLogin()" class="login-form" data-testid="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="credentials.email" 
                name="email"
                placeholder="your@email.com"
                data-testid="login-email"
                required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password"
                [(ngModel)]="credentials.password" 
                name="password"
                placeholder="Enter your password"
                data-testid="login-password"
                required>
            </div>
            
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="loading"
              data-testid="login-submit">
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
            
            <p class="error-message" *ngIf="errorMessage" data-testid="login-error">
              {{ errorMessage }}
            </p>
          </form>
          
          <p class="signup-link">
            Don't have an account? 
            <a routerLink="/signup" data-testid="signup-link">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      padding: 24px;
    }

    .login-container {
      width: 100%;
      max-width: 480px;
    }

    .login-card {
      background: rgba(10, 10, 10, 0.95);
      border: 1px solid rgba(198, 168, 124, 0.3);
      padding: 48px;
      backdrop-filter: blur(10px);
    }

    .login-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      text-align: center;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }

    .login-subtitle {
      text-align: center;
      color: #A1A1AA;
      margin-bottom: 40px;
      font-size: 1rem;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group label {
      color: #C6A87C;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }

    .form-group input {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #C6A87C;
      background: rgba(255, 255, 255, 0.08);
    }

    .form-group input::placeholder {
      color: #666;
    }

    .btn-primary {
      width: 100%;
      margin-top: 8px;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .error-message {
      color: #EF4444;
      text-align: center;
      font-size: 0.875rem;
      padding: 12px;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      margin-top: 8px;
    }

    .signup-link {
      text-align: center;
      margin-top: 32px;
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .signup-link a {
      color: #C6A87C;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .signup-link a:hover {
      color: #E5CFA0;
    }

    @media (max-width: 768px) {
      .login-card {
        padding: 32px 24px;
      }

      .login-title {
        font-size: 2rem;
      }
    }
  `]
})
export class LoginComponent {
  credentials: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirect based on role
        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/products']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}
