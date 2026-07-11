import {Role} from '../models/role.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class RoleService {
    private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rols`;
  listar() {
    return this.http.get<ApiPaginatedResponse<Role>>(this.apiUrl);
  }

}