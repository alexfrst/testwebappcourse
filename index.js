const express = require("express")
const app = express()
const PORTO = process.env.PORT||5000;
const bodyparser = require("body-parser")
const  MongoClient = require("mongodb").MongoClient;
const http = require('http').Server(app);
const io = require('socket.io')(http);

let memory = []
app.use("/app1",express.static('content'))
app.use(bodyparser.json())

let db = null;
let collection = null;
let collection2 = null;

const client = new MongoClient(process.env.mongouri);


async function GetCollection() {
        await client.connect();
        db = client.db('figures')
        collection = db.collection('figures10')
        collection2 = db.collection('figures15')
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




app.post("/app1/data",(req,res) => {
    console.log(req.body)
    if(req.body && req.body.length == 7){
        PostFigures(req.body);
    }else{
        res.status(400).send("An error occured make sure you send you data with the key data and that your array length matches 7")
    }
})

app.get("/app1/data",async (req,res) => {
    console.log(await QueryFigure())
    res.send({data:await QueryFigure()})
})

app.use("/app2",express.static('content2'))



const QueryFigure2 = async(user) => {
	console.log(user)
    const result = []
    const cursor = await collection2.find({user:user}).toArray()

    for(const line of cursor){
        result.push(line.fig)
    }
    return result
}

const PostFigures2 = async (figure, user) => {
    const doc = {"fig":figure,"user":user};
    const reulst = await collection2.insertOne(doc);
    console.log(reulst)
}




app.post("/app2/data",(req,res) => {
    console.log(req.body)
    if(req.body && req.body.data && req.body.user && req.body.data.length == 7 ){
        PostFigures2(req.body.data,req.body.user);
    }else{
        res.status(400).send("An error occured make sure you send you data with the key data and that your array length matches 7")
    }
})

app.post("/app2/data2",async (req,res) => {
    console.log(req.body)
    console.log(req.body.name)
    res.send({"data":await QueryFigure2(req.body.name)})
})

app.post("/app3/data",(req,res) => {
    console.log(req.body)
    if(req.body && req.body.data && req.body.user && req.body.data.length == 7 ){
        PostFigures2(req.body.data,req.body.user);
    }else{
        res.status(400).send("An error occured make sure you send you data with the key data and that your array length matches 7")
    }
})

app.post("/app3/data2",async (req,res) => {
    console.log(req.body)
    console.log(req.body.name)
    res.send({"data":await QueryFigure2(req.body.name)})
})

app.use(express.static('content3'))

io.on('connection', (socket) => {
    console.log("connected")
    socket.on('drawing', msg => {
        console.log(msg)

        io.emit('drawing', msg);
    });
});

http.listen(PORTO, () => {
    console.log(`server running at http://localhost:${port}/`);
});