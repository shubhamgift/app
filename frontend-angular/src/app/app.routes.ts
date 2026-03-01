import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrderHistoryComponent } from './components/orders/order-history.component';
import { CustomRequestComponent } from './components/custom-request/custom-request.component';
import { MyRequestsComponent } from './components/custom-request/my-requests.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin/admin-products.component';
import { AdminOrdersComponent } from './components/admin/admin-orders.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories.component';
import { AdminRequestsComponent } from './components/admin/admin-requests.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  
  // Shopping cart (public access)
  { path: 'cart', component: CartComponent },
  
  // Protected user routes
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderHistoryComponent, canActivate: [authGuard] },
  { path: 'custom-request', component: CustomRequestComponent, canActivate: [authGuard] },
  { path: 'my-requests', component: MyRequestsComponent, canActivate: [authGuard] },
  
  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/products/new', component: AdminProductsComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [authGuard, adminGuard] },
  { path: 'admin/requests', component: AdminRequestsComponent, canActivate: [authGuard, adminGuard] },
  
  // Wildcard route
  { path: '**', redirectTo: '/home' }
];
