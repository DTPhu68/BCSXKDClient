import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LookupService {
  private readonly baseUrl = `${environment.apiUrl}/lookups`;

  constructor(private http: HttpClient) {}
  getKhoiLookup() {
    return this.http.get<{ khoiId: number; khoiName: string; searchName: string }[]>(
      `${this.baseUrl}/khois`
    );
  }
}
