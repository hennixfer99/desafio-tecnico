import { db } from "..";
import {
    ContainerCategoria,
    ContainerDTO,
    ContainerInterface,
    ContainerStatus,
} from "../interface/ContainerInterface";
import { ClienteService } from "./ClienteService";

export class ContainerService {
    private readonly clienteService: ClienteService;

    constructor() {
        this.clienteService = new ClienteService();
    }

    private validacaoNumero(number: string) {
        return /[A-Z]{4}\d{7}$/.test(number);
    }

    private validacaoTipo(tipo: number) {
        return tipo === 20 || tipo === 40;
    }

    private validacaoCategoria(categoria: keyof typeof ContainerCategoria) {
        return Object.values(ContainerCategoria).includes(categoria);
    }

    private validacaoStatus(status: keyof typeof ContainerStatus) {
        return Object.values(ContainerStatus).includes(status);
    }

    async create({
        categoria,
        cliente_id,
        numero,
        status,
        tipo,
    }: ContainerDTO): Promise<ContainerInterface> {
        if (!this.validacaoNumero(numero)) {
            throw new Error("O numero não é válido");
        }
        if (!this.validacaoTipo(tipo)) {
            throw new Error(`O tipo ${tipo} não é válido`);
        }
        if (!this.validacaoCategoria(categoria)) {
            throw new Error(`A categoria ${categoria} não é válida`);
        }
        if (!this.validacaoStatus(status)) {
            throw new Error(`O status ${status} não é válido`);
        }

        const acharCliente = await this.clienteService.getById(cliente_id);

        if (!acharCliente) {
            throw new Error(`O cliente ${cliente_id} não existe`);
        }

        const sql =
            "INSERT INTO container (numero, tipo, status, categoria, cliente_id) VALUES (?, ?, ?, ?, ?)";
        const containerCriado = await db.run(sql, [
            categoria,
            cliente_id,
            numero,
            status,
            tipo,
        ]);
        const container: ContainerInterface = {
            id: containerCriado.lastID,
            categoria,
            cliente_id,
            numero,
            status,
            tipo,
        };
        return container;
    }

    async get(): Promise<ContainerInterface[]> {
        const sql = "SELECT * FROM container";
        const container = await db.all<ContainerInterface>(sql);
        return container;
    }

    async getById(id: string) {
        const sql = "SELECT * FROM container WHERE id = (?)";
        const container = await db.get<ContainerInterface | undefined>(sql, id);
        return container;
    }

    async update(
        { tipo, status, categoria }: Partial<ContainerDTO>,
        id: string
    ): Promise<void> {
        const container = await this.getById(id);

        if (tipo && !this.validacaoTipo(tipo)) {
            throw new Error(`O tipo ${tipo} não é válido`);
        }
        if (categoria && !this.validacaoCategoria(categoria)) {
            throw new Error(`A categoria ${categoria} não é válida`);
        }
        if (status && !this.validacaoStatus(status)) {
            throw new Error(`O status ${status} não é válido`);
        }
        if (!container) {
            throw new Error(`O container ${id} não existe`);
        }

        const sql =
            "UPDATE container SET tipo = ?, status = ?, categoria = ? WHERE id = ?";

        const inputData = [
            tipo ?? container.tipo,
            status ?? container.status,
            categoria ?? container.categoria,
        ];

        await db.run(sql, inputData);
    }

    async delete(id: string) {
        const sql = "DELETE FROM container WHERE id = (?)";
        const container = await db.run(sql, id);
        if (container.changes === 0) {
            throw new Error("Não encontrado");
        }
    }
}
