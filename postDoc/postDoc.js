const express = require('express')
let app = express()
const port = 8070

let serverUri = "https://db-server-qfxsxjjz5q-ww.a.run.app"

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

async function creatDocument(doc){
    console.log(doc)
    try {
        let response = await fetch(serverUri, {
          method: "POST",
          body: JSON.stringify(doc),
          headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        return 
      } catch (error) {
        console.error("Error:", error);
      }  
  }

async function updateLink(link){
    serverUri = link
}

app.post('/',async function(req, res){
    await creatDocument(req.body).catch(console.dir)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Posted');

})

app.put('/uri', async function(req,res){
    await updateLink(req.body.uri)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('uri changed');
})

app.listen(port, function(){
    console.log(`lostening on port ${port}`)
})