const express = require("express")
const app = express()
const PORT = process.env.PORT||5000;
const bodyparser = require("body-parser")
const  MongoClient = require("mongodb").MongoClient;
let memory = []
app.use("/app2",express.static('content'))
app.use(bodyparser.json())

let db = null;
let collection = null;

const client = new MongoClient(process.env.mongouri);

async function GetCollection() {
        await client.connect();
        db = client.db('figures')
        collection = db.collection('figures15')
};
GetCollection()

const QueryFigure = async(user) => {
    const result = []
    const cursor = await collection.find({user:user}).toArray()

    for(const line of cursor){
        result.push(line.fig)
    }
    return result
}

const PostFigures = async (figure, user) => {
    const doc = {fig:figure,user:user};
    const reulst = await collection.insertOne(doc);
    console.log(reulst)
}




app.post("/app2/data",(req,res) => {
    console.log(req.body.data)
    if(req.body && req.body.data && req.body.user && req.body.data.length == 7 ){
        PostFigures(req.body.data,req.body.user);
    }else{
        res.status(400).send("An error occured make sure you send you data with the key data and that your array length matches 7")
    }
})

app.post("/app2/data2",async (req,res) => {
    console.log(req.body)
    res.send({data:await QueryFigure(req.body.name)})
})

app.listen(PORT, ()=>{
    console.log(`Running on ${PORT}`)
})