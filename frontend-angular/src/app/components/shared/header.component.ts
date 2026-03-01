import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { AuthResponse } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="header-container">
        <div class="logo" routerLink="/" data-testid="logo">
          <span class="logo-icon">&#128142;</span>
          <span class="logo-text">Luxury Jewels</span>
        </div>

        <nav class="nav-menu" data-testid="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" data-testid="nav-home">Home</a>
          <a routerLink="/products" routerLinkActive="active" data-testid="nav-products">Products</a>
          
          <ng-container *ngIf="currentUser">
            <a routerLink="/orders" routerLinkActive="active" data-testid="nav-orders">Orders</a>
            <a routerLink="/custom-request" routerLinkActive="active" data-testid="nav-custom">Custom</a>
            <a routerLink="/my-requests" routerLinkActive="active" data-testid="nav-my-requests">My Requests</a>
            <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active" data-testid="nav-admin">Admin</a>
          </ng-container>
        </nav>

        <div class="header-actions">
          <!-- Cart Button -->
          <a routerLink="/cart" class="cart-btn" data-testid="cart-btn">
            <span class="cart-icon">&#128722;</span>
            <span *ngIf="cartCount > 0" class="cart-badge" data-testid="cart-count">{{ cartCount }}</span>
          </a>

          <ng-container *ngIf="currentUser; else notLoggedIn">
            <div class="user-menu">
              <span class="user-name" data-testid="user-name">{{ currentUser.fullName }}</span>
              <button class="btn-logout" (click)="logout()" data-testid="logout-btn">Logout</button>
            </div>
          </ng-container>
          
          <ng-template #notLoggedIn>
            <a routerLink="/login" class="btn-outline" data-testid="login-btn">Login</a>
            <a routerLink="/signup" class="btn-primary" data-testid="signup-btn">Sign Up</a>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: rgba(10, 10, 10, 0.95);
      border-bottom: 1px solid rgba(198, 168, 124, 0.2);
      position: sticky;
      top: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .header-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 48px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: transform 0.3s;
    }

    .logo:hover {
      transform: translateY(-2px);
    }

    .logo-icon {
      font-size: 1.5rem;
    }

    .logo-text {
      font-family: 'Bodoni Moda', serif;
      font-size: 1.5rem;
      color: #C6A87C;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .nav-menu {
      display: flex;
      gap: 32px;
      flex: 1;
    }

    .nav-menu a {
      color: #FAFAFA;
      text-decoration: none;
      font-size: 0.9375rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: color 0.3s;
      position: relative;
      padding-bottom: 4px;
    }

    .nav-menu a::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 1px;
      background: #C6A87C;
      transition: width 0.3s;
    }

    .nav-menu a:hover,
    .nav-menu a.active {
      color: #C6A87C;
    }

    .nav-menu a:hover::after,
    .nav-menu a.active::after {
      width: 100%;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-name {
      color: #C6A87C;
      font-size: 0.9375rem;
      font-weight: 500;
    }

    .btn-logout {
      background: transparent;
      border: 1px solid #C6A87C;
      color: #C6A87C;
      padding: 8px 20px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 0.875rem;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: #C6A87C;
      color: #000;
    }

    .btn-outline,
    .btn-primary {
      padding: 10px 24px;
      font-size: 0.875rem;
      text-decoration: none;
      display: inline-block;
    }

    @media (max-width: 968px) {
      .header-container {
        flex-direction: column;
        gap: 24px;
        padding: 16px 24px;
      }

      .nav-menu {
        flex-direction: column;
        gap: 16px;
        text-align: center;
        width: 100%;
      }

      .header-actions {
        width: 100%;
        justify-content: center;
      }

      .user-menu {
        flex-direction: column;
        width: 100%;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: AuthResponse | null = null;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = user?.role === 'ADMIN';
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
