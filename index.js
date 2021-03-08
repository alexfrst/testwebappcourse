const express = require("express")
const app = express()
const PORT = process.env.PORT||5000;
const bodyparser = require("body-parser")
const  MongoClient = require("mongodb").MongoClient;
let memory = []
app.use(express.static('content'))
app.use(bodyparser.json())

let db = null;
let collection = null;

const client = new MongoClient(process.env.mongorui);

async function GetCollection() {
        await client.connect();
        db = client.db('figures')
        collection = db.collection('figures10')
};
GetCollection()

const QueryFigure = async() => {
    const result = []
    const cursor = await collection.find().toArray()

    for(const line of cursor){
        result.push(line.fig)
    }
    return result
}

const PostFigures = async (figure) => {
    const doc = {fig:figure};
    const reulst = await collection.insertOne(doc);
    console.log(reulst)
}


app.get("/", ((req, res) => {
    console.log(req)
    res.status(200).send("Hello World  got to /app1 or /app2")
}))



app.post("app1/data",(req,res) => {
    console.log(req.body)
    if(req.body && req.body.length == 7){
        PostFigures(req.body);
    }else{
        res.status(400).send("An error occured make sure you send you data with the key data and that your array length matches 7")
    }
})

app.get("app1/data",async (req,res) => {
    console.log(await QueryFigure())
    res.send({data:await QueryFigure()})
})

app.listen(PORT, ()=>{
    console.log(`Running on ${PORT}`)
})