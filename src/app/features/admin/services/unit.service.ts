import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DonVi } from '../models/don-vi.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private baseUrl = environment.apiUrl + '/donvis';

  constructor(private http: HttpClient) {}

  getAll(): Observable<DonVi[]> {
    return this.http.get<DonVi[]>(this.baseUrl);
  }
}
