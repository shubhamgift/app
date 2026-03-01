import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SignupRequest } from '../../models/user.model';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="signup-page">
      <div class="signup-container">
        <div class="signup-card">
          <h1 class="signup-title">Create Account</h1>
          <p class="signup-subtitle">Join us today</p>
          
          <form (ngSubmit)="onSignup()" class="signup-form" data-testid="signup-form">
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName"
                [(ngModel)]="signupData.fullName" 
                name="fullName"
                placeholder="John Doe"
                data-testid="signup-fullname"
                required>
            </div>

            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="signupData.email" 
                name="email"
                placeholder="your@email.com"
                data-testid="signup-email"
                required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                type="password" 
                id="password"
                [(ngModel)]="signupData.password" 
                name="password"
                placeholder="Minimum 6 characters"
                data-testid="signup-password"
                required>
            </div>

            <div class="form-group">
              <label for="phone">Phone (Optional)</label>
              <input 
                type="tel" 
                id="phone"
                [(ngModel)]="signupData.phone" 
                name="phone"
                placeholder="+1234567890"
                data-testid="signup-phone">
            </div>

            <div class="form-group">
              <label for="address">Address (Optional)</label>
              <textarea 
                id="address"
                [(ngModel)]="signupData.address" 
                name="address"
                placeholder="Your address"
                rows="3"
                data-testid="signup-address"></textarea>
            </div>
            
            <button 
              type="submit" 
              class="btn-primary"
              [disabled]="loading"
              data-testid="signup-submit">
              {{ loading ? 'Creating Account...' : 'Create Account' }}
            </button>
            
            <p class="error-message" *ngIf="errorMessage" data-testid="signup-error">
              {{ errorMessage }}
            </p>
          </form>
          
          <p class="login-link">
            Already have an account? 
            <a routerLink="/login" data-testid="login-link">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .signup-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
      padding: 24px;
    }

    .signup-container {
      width: 100%;
      max-width: 480px;
    }

    .signup-card {
      background: rgba(10, 10, 10, 0.95);
      border: 1px solid rgba(198, 168, 124, 0.3);
      padding: 48px;
      backdrop-filter: blur(10px);
    }

    .signup-title {
      font-family: 'Bodoni Moda', serif;
      font-size: 2.5rem;
      color: #C6A87C;
      text-align: center;
      margin-bottom: 8px;
      letter-spacing: 1px;
    }

    .signup-subtitle {
      text-align: center;
      color: #A1A1AA;
      margin-bottom: 40px;
      font-size: 1rem;
    }

    .signup-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .form-group input,
    .form-group textarea {
      padding: 14px 16px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #FAFAFA;
      font-size: 1rem;
      font-family: 'Montserrat', sans-serif;
      transition: all 0.3s;
      resize: vertical;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #C6A87C;
      background: rgba(255, 255, 255, 0.08);
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
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

    .login-link {
      text-align: center;
      margin-top: 32px;
      color: #A1A1AA;
      font-size: 0.875rem;
    }

    .login-link a {
      color: #C6A87C;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s;
    }

    .login-link a:hover {
      color: #E5CFA0;
    }

    @media (max-width: 768px) {
      .signup-card {
        padding: 32px 24px;
      }

      .signup-title {
        font-size: 2rem;
      }
    }
  `]
})
export class SignupComponent {
  signupData: SignupRequest = {
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: ''
  };
  
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSignup(): void {
    if (!this.signupData.email || !this.signupData.password || !this.signupData.fullName) {
      this.errorMessage = 'Please fill in all required fields';
      return;
    }

    if (this.signupData.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.signup(this.signupData).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Failed to create account. Email might already exist.';
      }
    });
  }
}
