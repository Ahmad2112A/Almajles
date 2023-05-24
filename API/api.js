const express = require('express')
let app = express()
const port = 8160
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const graphqlHTTP = require("express-graphql").graphqlHTTP
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql')

app.use(cors());

let getUri = "https://getdoc-qfxsxjjz5q-ww.a.run.app"
let postUri = "https://postdoc-qfxsxjjz5q-ww.a.run.app"

const server = http.createServer(app);


////////////////////////////GraphQl/////////////////////////////////////////

const messageType = new GraphQLObjectType({
  name: "Message",
  fields:{
      username: {
          type: GraphQLString
      },
      message: {
          type: GraphQLString
      },
      sessionID: {
          type: GraphQLInt
      },
      timeStamp: {
          type: GraphQLFloat
      }
  }
})

const sessionType = new GraphQLObjectType({
  name: "session",
  fields:{
    sessionID: {
      type: GraphQLInt
    },
    messages: {
      type: new GraphQLList(messageType)
    },
  }
})





const queryType = new GraphQLObjectType({
  name: 'Query',
  description: "This is the query type",
  fields: {
      session:{
          type: sessionType,
          description: "These are the messages that will be requisted",
          args:{
            sessionID:{
              type: GraphQLInt
            }
          },
          resolve: (_,args)=>{
              console.log(args)
              return {sessionID:args.sessionID,messages:getChat(args.sessionID)}
          }
      }
  }
})

const mutationType = new GraphQLObjectType({
  name: "mutation",
  fields: {
  CreateMessage:{
        type: messageType,
        description: "These are the messages that will be requisted",
        args:{
          sessionID:{
            type: GraphQLInt
          },
          username:{
            type: GraphQLString
          },
          message:{
            type: GraphQLString
          },
          timeStamp:{
            type: GraphQLFloat
          }
        },
        resolve:(_,args)=>{
          console.log("mutation => "+ args.sessionID)
          postChat(args)
        }
    }
}
})

const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType

})

/*********************************************************************************** */

///////////////////////////WebSocker/////////////////////////////////////////
const io = new Server(server, {
  cors: {
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on("join_room", (sID) => {
    socket.join(sID);
    getChat(sID).then((data)=>{
      console.log(data)
      socket.emit("All-masseges",(JSON.stringify(data)))
    })
    
    

  });

  socket.on("send_message", (data) => {
    console.log(data)
    postChat(data).then(()=>{
      socket.to(data.sessionID.toString()).emit("receive_message", data);
      io.send(data)
    }).catch(console.dir)
  });
});

/************************************************************///





//////////////////////////////////RestAPi/////////////////////////////////////////
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


async function postChat(doc){
try {
    let response = await fetch(postUri, {
      method: "POST",
      body: JSON.stringify(doc),
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  } catch (error) {
    console.error("Error:", error);
  }  
}

async function getChat(sessionID){
    try {
        let uricashe = getUri +"?sessionID="+sessionID
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
/*********************************************************/


///////////////////////////////Change Links////////////////////////////////////////////
async function updateGetUri(link){
    getUri = link
}

async function updatePostUri(link){
  postUri = link
}
/* ********************************************************************* */

/////////////////////////////  API  /////////////////////////////////////////////////////////////////
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.put('/PostUri', async function(req,res){
    await updatePostUri(req.body.uri)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('post uri changed');
})

app.put('/getUri', async function(req,res){
    await updateGetUri(req.body.uri)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('get uri changed');
})

app.get('/Messages',async function(req, res){
    let documents
    documents= await getChat(parseInt(req.query.sessionID)).catch(console.dir)
    res.send(documents);
})

app.post('/Message',async function(req, res){
    await postChat(req.body).catch(console.dir)
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('Posted Successfully');

})
app.get('/', (req,res)=>{
  res.redirect("https://react-qfxsxjjz5q-ww.a.run.app/")
})



server.listen(port, () => {
  console.log("API is running on port : "+ port);
});

/***********************************************************************************/