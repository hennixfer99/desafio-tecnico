import { db } from "..";
import { ClienteDTO, ClienteInterface } from "../interface/ClienteInterface";

export class ClienteService {
    async create(clienteDTO: ClienteDTO): Promise<ClienteInterface> {
        const sql = "INSERT INTO cliente (nome) VALUES (?)";
        const clienteCriado = await db.run(sql, [clienteDTO.nome]);
        const cliente: ClienteInterface = {
            id: clienteCriado.lastID,
            nome: clienteDTO.nome,
        };
        return cliente;
    }

    async get(): Promise<ClienteInterface[]> {
        const sql = "SELECT * FROM cliente";
        const cliente = await db.all<ClienteInterface>(sql);
        return cliente;
    }

    async getById(id: string) {
        const sql = "SELECT * FROM cliente WHERE id = (?)";
        const cliente = await db.get<ClienteInterface | undefined>(sql, id);
        return cliente;
    }

    async update({nome}:ClienteDTO){
        if(!nome){
            throw new Error("Porfavor insira um nome")
        }
        const sql= "UPDATE cliente SET nome = ?"
        await db.run(sql, nome);

        return "O cliente foi atualizado"
    }

    async delete(id:string){
        const sql = "DELETE FROM cliente WHERE id = (?)";
        const cliente = await db.run(sql, id);
        if(cliente.changes === 0){
            throw new Error("Não encontrado")
        }
    }
}