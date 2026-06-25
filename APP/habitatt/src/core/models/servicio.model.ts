import { Categoria } from "../services/categoria.service";
import { Profesional } from "../services/profesional.service";

export interface Servicio{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;

    categoriaId: number;
    categoria?: Categoria;

    profesionalId: number;
    profesional?: Profesional;

    createdAt: string;
    updatedAt: string;
}

export interface Servicio{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;

    categoriaId: number;
    categoria?: Categoria;

    profesionalId: number;
    profesional?: Profesional;
}

export interface ServicioUpdateDto{
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    duracionMinutos: number;
    isActive: boolean;

    categoriaId: number;
    categoria?: Categoria;

    profesionalId: number;
    profesional?: Profesional;
}