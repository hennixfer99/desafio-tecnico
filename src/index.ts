import express from "express"
import { AsyncDatabase } from "promised-sqlite3"


const app = express()

app.use(express.json())

export let db: AsyncDatabase;(async() => {

    db = await AsyncDatabase.open("./db.sqlite")


    await db.run(`
        CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY,
        nome VARCHAR(55)
        )
        `)
    
    await db.run(`
        CREATE TABLE IF NOT EXISTS container (
        id INTEGER PRIMARY KEY,
        numero VARCHAR(11),
        tipo INTEGER,
        status VARCHAR(5),
        categoria VARCHAR(20),
        cliente_id INTEGER,
        FOREIGN KEY (cliente_id) REFERENCES cliente(id)
        )
        `);
    
    await db.run(`
        CREATE TABLE IF NOT EXISTS movimentacao (
        id INTEGER PRIMARY KEY,
        tipo VARCHAR(64),
        data_inicio DATE,
        hora_inicio DATETIME,
        data_fim DATE,
        hora_fim DATETIME,
        container_id INTEGER,
        FOREIGN KEY (container_id) REFERENCES container(id)
        )
        `);

})();

app.listen(3001, () => {
    console.log('O servidor esta rodando')
})