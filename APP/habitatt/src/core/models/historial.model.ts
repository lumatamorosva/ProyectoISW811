export interface Historial{
    id: number;
    appointmentId: number;
    estadoAnterior: string;
    estadoNuevo: string;
    motivo: string;
    fechaHora: string;
    usuarioId: number;
    
    nombreUsuario?: string;
}