export interface MovimentacaoDTO {
    container_id: string;
    tipo: keyof typeof MovimentacaoTipo;
    data_inicio: Date;
    hora_inicio: string;
    data_fim: Date;
    hora_fim: string;
}

export interface MovimentacaoInterface extends MovimentacaoDTO {
    id: number;
}

export enum MovimentacaoTipo {
    "EMBARQUE",
    "DESCARGA",
    "GATE_IN",
    "GATE_OUT",
    "REPOSICIONAMENTO",
    "PESAGEM",
    "SCANNER",
}
