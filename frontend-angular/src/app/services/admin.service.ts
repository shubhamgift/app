import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { CustomRequest } from '../models/custom-request.model';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRequests: number;
  pendingOrders: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;
  private adminUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.adminUrl}/dashboard`);
  }

  // Products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.adminUrl}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.adminUrl}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/products/${id}`);
  }

  // Categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/categories`);
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.adminUrl}/categories`, category);
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.adminUrl}/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.adminUrl}/categories/${id}`);
  }

  // Orders
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.adminUrl}/orders`);
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.put<Order>(`${this.adminUrl}/orders/${id}/status`, { status });
  }

  // Custom Requests
  getAllCustomRequests(): Observable<CustomRequest[]> {
    return this.http.get<CustomRequest[]>(`${this.adminUrl}/custom-requests`);
  }

  updateCustomRequest(id: number, status: string, adminResponse: string): Observable<CustomRequest> {
    return this.http.put<CustomRequest>(`${this.adminUrl}/custom-requests/${id}`, {
      status,
      adminResponse
    });
  }
}
