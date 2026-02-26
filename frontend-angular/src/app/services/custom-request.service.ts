import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CustomRequest } from '../models/custom-request.model';

@Injectable({
  providedIn: 'root'
})
export class CustomRequestService {
  private apiUrl = `${environment.apiUrl}/custom-requests`;

  constructor(private http: HttpClient) {}

  createRequest(request: CustomRequest): Observable<CustomRequest> {
    return this.http.post<CustomRequest>(this.apiUrl, request);
  }

  getMyRequests(): Observable<CustomRequest[]> {
    return this.http.get<CustomRequest[]>(`${this.apiUrl}/my-requests`);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${this.apiUrl}/upload-image`, formData);
  }

  // Admin methods
  getAllRequests(): Observable<CustomRequest[]> {
    return this.http.get<CustomRequest[]>(`${environment.apiUrl}/admin/custom-requests`);
  }

  updateRequest(id: number, status: string, adminResponse?: string): Observable<CustomRequest> {
    return this.http.put<CustomRequest>(`${environment.apiUrl}/admin/custom-requests/${id}`, {
      status,
      adminResponse
    });
  }

  deleteRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/admin/custom-requests/${id}`);
  }
}
