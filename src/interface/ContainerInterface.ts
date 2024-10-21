export interface ContainerDTO {
    cliente_id: string;
    numero: string;
    tipo: 20 | 40;
    status: keyof typeof ContainerStatus;
    categoria: keyof typeof ContainerCategoria;
}

export interface ContainerInterface extends ContainerDTO{
    id: number;
}

export enum ContainerCategoria {
    "IMPORTACAO",
    "EXPORTACAO"
}

export enum ContainerStatus {
    "CHEIO",
    "VAZIO"
}