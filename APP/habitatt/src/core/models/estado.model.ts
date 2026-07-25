export interface Estado{
    value: string;
    label: string;
}

export enum Status {
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    RESCHEDULED = 'RESCHEDULED',
    PENDING = 'PENDING',
}