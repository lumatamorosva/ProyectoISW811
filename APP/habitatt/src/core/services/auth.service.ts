import { computed, inject, Injectable, signal, } from '@angular/core'
import { HttpClient, HttpErrorResponse, } from '@angular/common/http'
import { Router } from '@angular/router'
import { catchError, finalize, map, Observable, of, shareReplay, switchMap, tap, throwError, } from 'rxjs'
import { environment } from '../../environments/environment.development'
import { ApiResponse } from '../models/api-response.model'
import { LoginRequest, LoginResult, RegisterRequest, usuario, } from '../models/usuario.model'
import { Role } from '../models/role.model'

@Injectable({ providedIn: 'root',}) export class AuthService {
    private readonly http = inject(HttpClient)
    private readonly router = inject(Router)
    private readonly apiUrl = `${environment.apiUrl}/usuario`
    private readonly tokenKey = 'access_token'
    private readonly _token = signal<string | null>( this.leerTokenAlmacenado() )
    private readonly _usuario = signal<usuario | null>(null)
    private readonly _cargandoSesion = signal(false)
    private readonly _sesionInicializada = signal(false)
    private solicitudPerfilActual: Observable<usuario | null> | null = null
    readonly token = this._token.asReadonly()
    readonly usuario = this._usuario.asReadonly()
    readonly cargandoSesion = this._cargandoSesion.asReadonly()
    readonly sesionInicializada =  this._sesionInicializada.asReadonly()
    readonly autenticado = computed(() => this._token() !== null && this._usuario() !== null)
    readonly rol = computed(() => this._usuario()?.role)
    readonly esAdmin = computed(() => { const rol = this.rol()
        return rol !== null && rol === Role.ADMIN })
    login( credenciales: LoginRequest ): Observable<usuario> {
        this._cargandoSesion.set(true)
        return this.http.post<ApiResponse<LoginResult>>( `${this.apiUrl}/login`,credenciales)
            .pipe(map((response) => {
                    const resultado = response.data
                    if (!resultado?.token) {throw new Error('El API no devolvió el token de autenticación')}
                    return resultado
                }),
                tap(({ token }) => {this.guardarToken(token)
                }),
                switchMap(() => this.obtenerPerfil()),
                tap((usuario) => {
                    this._usuario.set(usuario)
                    this._sesionInicializada.set(true)
                }),
                catchError((error: unknown) => {this.limpiarSesion()
                    return throwError(() => this.obtenerErrorAutenticacion(error))
                }),
                finalize(() => {this._cargandoSesion.set(false)
                })
            )
    }
    obtenerPerfil(): Observable<usuario> {
        return this.http
            .get<ApiResponse<usuario>>(`${this.apiUrl}/perfil`)
            .pipe(map((response) => {const usuario = response.data
                    if (!usuario) {
                        throw new Error('El API no devolvió la información del perfil')}
                    return usuario
                })
            )
    }
    inicializarSesion(): Observable<usuario | null> {
        if (this._sesionInicializada()) {return of(this._usuario())}
        const token = this._token()
        if (!token) {
            this._usuario.set(null)
            this._sesionInicializada.set(true)
            return of(null)
        }
        return this.cargarPerfil()
    }
    cargarPerfil(): Observable<usuario | null> {
        if (this.solicitudPerfilActual) {return this.solicitudPerfilActual}
        const token = this._token()
        if (!token) {
            this._usuario.set(null)
            this._sesionInicializada.set(true)
            return of(null)
        }
        this._cargandoSesion.set(true)
        this.solicitudPerfilActual =this.obtenerPerfil().pipe(tap((usuario) => {this._usuario.set(usuario)}),
                map((usuario): usuario | null =>usuario),
                catchError(() => {this.limpiarSesion()
                    return of(null)
                }),
                finalize(() => {
                    this._cargandoSesion.set(false)
                    this._sesionInicializada.set(true)
                    this.solicitudPerfilActual = null
                }),
                shareReplay({bufferSize: 1,refCount: false, })
            )
        return this.solicitudPerfilActual
    }   
    registrar(datos: RegisterRequest): Observable<usuario> {return this.http.post<ApiResponse<usuario>>(`${this.apiUrl}/register`,datos)
            .pipe( map((response) => {
                    const usuario = response.data
                    if (!usuario) {throw new Error('El API no devolvió el usuario registrado')}
                    return usuario
                })
            )
    }
    logout(redirigir = true): void {
        this.limpiarSesion()
        if (redirigir) {void this.router.navigate(['/login'])}
    }
    tieneRol(rolesPermitidos: Role[]): boolean {
        const rolActual = this.rol() as Role
        return ( rolActual !== null &&rolesPermitidos.includes(rolActual))
    }
    obtenerToken(): string | null { return this._token()}
    private guardarToken(token: string): void {
        const tokenLimpio = token.trim()
        if (!tokenLimpio) {throw new Error('El token recibido no es válido')
        }
        localStorage.setItem(this.tokenKey,tokenLimpio)
        this._token.set(tokenLimpio)
    }

    private leerTokenAlmacenado(): string | null {
        const token =localStorage.getItem(this.tokenKey)
        if (!token) {return null}
        const tokenLimpio = token.trim()
        return tokenLimpio.length > 0 ? tokenLimpio : null
    }
    private limpiarSesion(): void {
        localStorage.removeItem(this.tokenKey)
        this._token.set(null)
        this._usuario.set(null)
        this._cargandoSesion.set(false)
        this._sesionInicializada.set(true)
        this.solicitudPerfilActual = null
    }
    private obtenerErrorAutenticacion(error: unknown): Error {
        if (!(error instanceof HttpErrorResponse)) {return error instanceof Error? error: new Error('No fue posible iniciar sesión')}
        if (error.status === 0) { return new Error('No fue posible conectarse con el servidor')}
        if (error.status === 400) {return new Error(error.error?.message ??'Los datos enviados no son válidos')}
        if (error.status === 401) {return new Error(error.error?.message ??'Correo o contraseña incorrectos' ) }
        if (error.status === 403) {return new Error(error.error?.message ??'No tiene permisos para realizar esta acción' ) }
        if (error.status === 404) {return new Error( error.error?.message ??'No fue posible obtener el perfil del usuario')}
        return new Error( error.error?.message ??'Ocurrió un error durante la autenticación')
    }
}