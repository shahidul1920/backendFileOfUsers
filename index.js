const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require("express");
const cors = require('cors')
const app = express();
const port = "4000"

// middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
  res.send("welcome and get fuuck, no don't.")
})


const uri = "mongodb+srv://shahidul1920shakil:nnl2JcAzzUGWTpDr@cluster0.kfgpk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("helloUser");
    const userBox = database.collection('Users');

    //post user
    app.post("/users", async (req, res) => {
      const userFromform = req.body;
      const result = await userBox.insertOne(userFromform);
      res.send(result);

    })

    //getting all user
    app.get('/users', async (req, res) => {
      const query = {};
      const allData = userBox.find(query);
      const users = await allData.toArray();
      res.send(users)
    })

    //delete User
    app.delete('/users/:userId', async (req, res) => {
      const id = req.params.userId;
      const findId = { _id: new ObjectId(id) };
      const result = await userBox.deleteOne(findId)
      res.send(result);
    })

    //getting single user

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const findId = { _id: new ObjectId(id) };
      const srchUser = await userBox.findOne(findId);
      res.send(srchUser)
    })

    //update User
    app.put('/users/:id', async (req, res) => {
      const updUser = req.body
      const id = req.params.id;
      const findId = { _id: new ObjectId(id) };
      const optn = { upsert: true }
      const userUpdate = {
        $set: {
          name: updUser.name,
          mail: updUser.mail,
          age: updUser.age,
          password : updUser.password
        }
      }
      console.log(updUser);
      
      const result = await userBox.updateOne(findId, userUpdate, optn)
      res.send(result)
    })

  } finally {


    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log("hell out", port);

})