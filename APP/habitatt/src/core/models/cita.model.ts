export interface Cita{
    id: number;
    fecha: Date;
    hora: string;
    descripcion: string;
    status: string;
    modalidad: string;

    clienteId: number;
    profesionalId: number;
    servicioId: number;

    nombreProfesional: string;
    nombreCliente: string;
    nombreServicio: string;
}

export interface createCitaDto{
    fecha: Date;
    hora: string;
    descripcion: string;
    status: string;
    modalidad: string;

    clienteId: number;
    profesionalId: number;
    servicioId: number;
}
export interface updateCitaDto{
    fecha: Date;
    hora: string;
    descripcion: string;
    status: string;
    modalidad: string;

    clienteId: number;
    profesionalId: number;
    servicioId: number;
}
export interface citaFormModel{
    fecha: Date;
    hora: string;
    descripcion: string;
    status: string;
    modalidad: string;

    clienteId: number;
    profesionalId: number;
    servicioId: number;

    nombreProfesional: string;
    nombreCliente: string;
    nombreServicio: string;
}