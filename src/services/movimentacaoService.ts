import { db } from "..";
import { ContainerInterface } from "../interface/ContainerInterface";
import { MovimentacaoDTO, MovimentacaoInterface, MovimentacaoTipo } from "../interface/MovimentacaoInterface";
import { ContainerService } from "./ContainerService";

export class MovimentacaoService {
    private readonly containerService: ContainerService;

    constructor() {
        this.containerService = new ContainerService();
    }

    private validacaoTipo(tipo: keyof typeof MovimentacaoTipo) {
        return Object.values(MovimentacaoTipo).includes(tipo);
    }

    async create({
        data_fim,
        tipo,
        container_id,
        data_inicio,
        hora_inicio,
        hora_fim,
    }: MovimentacaoDTO): Promise<MovimentacaoInterface> {
        if (!this.validacaoTipo(tipo)) {
            throw new Error(`O tipo ${tipo} não é válido`);
        }

        const sqlVerify = "SELECT * FROM container WHERE id = (?)"
        const container = await db.get<ContainerInterface | undefined>(sqlVerify, container_id);
        if(!container){
            throw new Error(`O container ${container_id} não é válido`);
        }

        if (!data_fim) {
            const sql = `
            INSERT INTO movimentacao 
            (container_id, tipo, data_inicio, hora_inicio) 
            VALUES 
            (?, ?, DATE(), TIME());
            `;
            const { lastID } = await db.run(sql, [container_id, tipo]);
            const movimentacao: MovimentacaoInterface = {
                id: lastID,
                container_id,
                data_inicio,
                hora_inicio,
                data_fim,
                hora_fim,
                tipo,
            };
            return movimentacao;
        }
        const sql = `
            INSERT INTO movimentacao 
            (container_id, tipo, data_inicio, hora_inicio, data_fim) 
            VALUES 
            (?, ?, DATE(), TIME(), ?);
            `;
        const { lastID } = await db.run(sql, [container_id, tipo]);
        const movimentacao: MovimentacaoInterface = {
            id: lastID,
            container_id,
            data_inicio,
            hora_inicio,
            data_fim,
            hora_fim,
            tipo,
        };
        return movimentacao;
    }

    async get(): Promise<MovimentacaoInterface[]> {
        const sql = "SELECT * FROM movimentacao";
        const movimentacao = await db.all<MovimentacaoInterface>(sql);
        if(movimentacao.length === 0){
            throw new Error("Sem movimentações até o momento")
        }
        return movimentacao;
    }

    async getById(id: string) {
        const sql = "SELECT * FROM movimentacao WHERE id = (?)";
        const movimentacao = await db.get<MovimentacaoInterface | undefined>(
            sql,
            id
        );
        return movimentacao;
    }

    async update(
        { tipo, data_fim }: Partial<MovimentacaoDTO>,
        id: string
    ): Promise<void> {
        const movimentacao = await this.getById(id);

        if (!movimentacao) {
            throw new Error(`A movimentacao ${id} não existe`);
        }

        if (tipo && !this.validacaoTipo(tipo)) {
            throw new Error(`O tipo ${tipo} não é válido`);
        }
       
        if(!data_fim){
            const sql =
                "UPDATE movimentacao SET tipo = ? WHERE id = ?";

            const inputData = [tipo ?? movimentacao.tipo];

            await db.run(sql, inputData);
        }
        const sql =
            "UPDATE movimentacao SET tipo = ?, data_fim = DATE(), hora_fim = TIME() WHERE id = ?";

        const inputData = [tipo ?? movimentacao.tipo];

        await db.run(sql, inputData);

    }

    async delete(id: string) {
        const sql = "DELETE FROM movimentacao WHERE id = (?)";
        const movimentacao = await db.run(sql, id);
        if (movimentacao.changes === 0) {
            throw new Error("Não encontrado");
        }
    }
}
