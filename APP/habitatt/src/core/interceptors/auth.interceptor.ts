import { inject } from '@angular/core';
import {HttpInterceptorFn,} from '@angular/common/http';
import { AuthService } from '../services/auth.service';
export const authInterceptor: HttpInterceptorFn = (request, next) => {
    const token = localStorage.getItem('access_token')?.trim();
    if (!token) { return next(request);}
    const requestAutenticado =request.clone({ setHeaders: {Authorization:`Bearer ${token}`,},});
        return next(requestAutenticado);
    };