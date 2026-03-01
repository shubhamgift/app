import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  
  // Protected user routes - To be implemented
  // { path: 'orders', component: OrdersComponent, canActivate: [authGuard] },
  // { path: 'orders/:id', component: OrderDetailComponent, canActivate: [authGuard] },
  // { path: 'custom-request', component: CustomRequestFormComponent, canActivate: [authGuard] },
  // { path: 'my-requests', component: MyRequestsComponent, canActivate: [authGuard] },
  
  // Admin routes - To be implemented
  // { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard, adminGuard] },
  // { path: 'admin/products', component: AdminProductsComponent, canActivate: [authGuard, adminGuard] },
  // { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [authGuard, adminGuard] },
  // { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [authGuard, adminGuard] },
  // { path: 'admin/requests', component: AdminRequestsComponent, canActivate: [authGuard, adminGuard] },
  
  // Wildcard route
  { path: '**', redirectTo: '/home' }
];
