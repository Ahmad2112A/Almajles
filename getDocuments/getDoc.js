const express = require('express')
let app = express()
const port = 8080

let serverUri = "https://db-server-qfxsxjjz5q-ww.a.run.app"

let bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

async function getDocuments(sessionID){
    try {

        let uricashe = serverUri +"?sessionID="+sessionID
        console.log(uricashe)
        let response = await fetch(uricashe, {
          method: "Get",
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          } 
        });
        let result = await response.json()
        console.log(result)
        return result
      } catch (error) {
        console.error("Error:", error);
      }  
}


async function updateLink(link){
    serverUri = link
  }

  app.get('/',async function(req, res){
    let documents
    documents= await getDocuments(parseInt(req.query.sessionID)).catch(console.dir)
    res.send(documents);

})

app.put('/uri', async function(req,res){
    await updateLink(req.body.uri)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('uri changed');
   })

app.listen(port, function(){
    console.log(`lostening on port ${port}`)
})