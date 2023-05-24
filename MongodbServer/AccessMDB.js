const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require('express')
let app = express()
const port = 8090

let uri = "mongodb+srv://Ahmad2112:u0kqEsSocQsYc4Cc@cluster0.kgmhvzd.mongodb.net"

const client = new MongoClient(uri,  {
  serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
  }
}
);

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

async function getDocuments(sessionID){
  await client.connect();
  console.log(sessionID)
  var dbo = client.db("Chat");

  let result = await  dbo.collection("Masseges").find({"sessionID":sessionID},{ projection: { _id: 0} }).toArray()
  console.log(result)
  return result

}

async function creatDocument(doc){
  let ts = Date.now();
  console.log(typeof doc)
  doc["timeStamp"] = ts
  console.log(doc)
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    
    var dbo = client.db("Chat");
    await dbo.collection("Masseges").insertOne(doc)
    
    } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    }
}

async function updateLink(link){
  uri = link
}


app.get('/',async function(req, res){
    let documents
    documents= await getDocuments(parseInt(req.query.sessionID)).catch(console.dir)
    res.send(documents);

})

app.post('/',async function(req, res){
    await creatDocument(req.body).catch(console.dir)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Hello World!');

})

app.put('/uri', async function(req,res){
  await updateLink(req.body.uri)
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('uri changed');
 })

app.listen(port, function(){
    console.log(`lostening on port ${port}`)
})