const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const Blockchain = require("./blockchain");
//const PubSub = require("./publishsubscribe");
// require('dotenv').config();

const P2pServer= require('./p2p-server');
const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();
const blockchain = new Blockchain();
//const pubsub = new PubSub({ blockchain })
const p2pServer = new  P2pServer(blockchain);

// const DEFAULT_PORT = 3000;
// const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
// setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());
app.get("/blocks", (req, res) => {
  res.json(blockchain.chain);
});
// app.post("/mine", (req, res) => {
//   const { data } = req.body;
  

//   const block= blockchain.addBlock({ data });
//   //pubsub.broadcastChain();
//   console.log(`New block added: ${block.toString()}`);
//   res.redirect("/blocks");
// });
app.post("/mine", (req, res) => {
  console.log('above data');
  console.log(req.body.data);
  const  {data}  = req.body.data;
 

  const block= blockchain.addBlock({data:req.body.data});
  //pubsub.broadcastChain();
  p2pServer.syncChains();
  res.redirect("/blocks");
});
// const synChains = () => {
//   request(
//     { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
//     (error, reposnse, body) => {
//       if (!error && reposnse.statusCode === 200) {
//         const rootChain = JSON.parse(body);
//         console.log("Replace chain on sync with", rootChain);
//         blockchain.replaceChain(rootChain);
//       }
//     }
//   );
// };

// let PEER_PORT;
// const DEFAULT_PORT = 3000;

// if (process.env.GENERATE_PEER_PORT === "true") {
//   PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
// }
// const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(HTTP_PORT, () => {
  console.log(`listening to PORT:${HTTP_PORT}`);
 // synChains();
});
p2pServer.listen();
