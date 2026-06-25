import { Service } from '@angular/core';
import {usuario} from '../models/usuario.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
    private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;
//localhost:3000/usuarios
  listar() {
    return this.http.get<ApiPaginatedResponse<usuario>>(this.apiUrl);
  }

  obtenerPorId(id: number) {
    return this.http.get<ApiResponse<usuario>>(`${this.apiUrl}/${id}`);
  }

  getImageUrl(imageName: string): string {
    return `${environment.imageUrl}/${imageName}`;
  }

}
