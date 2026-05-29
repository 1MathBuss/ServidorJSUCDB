const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();

app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function conectarBanco() {

    await client.connect();

    db = client.db("crud_clientes");

    console.log("MongoDB conectado");
}

conectarBanco();


// ======================
// POST
// ======================
app.post("/clientes", async (req, res) => {

    const cliente = {
        nome: req.body.nome,
        sobreNome: req.body.sobreNome
    };

    await db.collection("clientes").insertOne(cliente);

    res.sendStatus(200);
});


// ======================
// GET
// ======================
app.get("/clientes", async (req, res) => {

    const clientes = await db
        .collection("clientes")
        .find()
        .toArray();

    res.json(clientes);
});


// ======================
// PUT
// ======================
app.put("/clientes", async (req, res) => {

    const { _id, nome, sobreNome } = req.body;

    await db.collection("clientes").updateOne(
        { _id: new ObjectId(_id) },
        {
            $set: {
                nome,
                sobreNome
            }
        }
    );

    const clienteAtualizado = await db
        .collection("clientes")
        .findOne({ _id: new ObjectId(_id) });

    res.json(clienteAtualizado);
});


// ======================
// DELETE
// ======================
app.delete("/clientes", async (req, res) => {

    const { _id } = req.body;

    await db.collection("clientes").deleteOne({
        _id: new ObjectId(_id)
    });

    res.sendStatus(200);
});


app.listen(process.env.PORT, () => {
    console.log("Servidor rodando");
});