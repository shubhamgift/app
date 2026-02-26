import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  
  // Public routes - To be implemented
  // { path: 'home', component: HomeComponent },
  // { path: 'products', component: ProductsComponent },
  // { path: 'products/:id', component: ProductDetailComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  
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
