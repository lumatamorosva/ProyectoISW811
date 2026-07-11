import {categoria, CategoriaUpdateDto} from '../models/categoria.model'
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { ApiPaginatedResponse, ApiResponse } from '../models/api-response.model';


@Injectable({ providedIn: 'root' })
export class CategoriaService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}/categorias`;
    //localhost:3000/categorias
    listar() {return this.http.get<ApiPaginatedResponse<categoria>>(this.apiUrl);}
    obtenerPorId(id: number) {return this.http.get<ApiResponse<categoria>>(`${this.apiUrl}/${id}`);}
  
    actualizar(id: number, data: Partial<CategoriaUpdateDto>) {
          return this.http.put<ApiResponse<categoria>>(`${this.apiUrl}/${id}`, data);
   }
}
