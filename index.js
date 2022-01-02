const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors');
const app = express();
require('dotenv').config();
// const  ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());

app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z9rhw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('RoofLine');
        const users = database.collection('userCollection');
        // const OurServices = database.collection('OurServices');
        // const myUserCollection = database.collection('users');
      
     //Post method  Method (single document)-----------API--Post
     app.post('/userCollection', async(req,res)=>{
      const user = req.body;
      const result = await users.insertOne(user);
      res.json(result)
      console.log(result)
    })
    app.put('/userCollection', async(req, res)=>{
        const user =req.body;
        const filter = {email:user.email} ;
        const options = {upsert: true};
        const updateDoc = {$set: user};
        const result  = await users.updateOne(filter,updateDoc,options);
        res.json(result)
        console.log(result);
      })
    //  Get Metod  get all RiderCollection---------------------API--get all
     app.get('/userCollection', async(req, res)=>{
      const user = users.find({});
      const result = await user.toArray();
      res.send(result)
    })
      //
      //  //update method for make admin-----------------------admin api
       app.put('/users/admin', async(req, res)=>{
        const user = req.body;
        // console.log(user)
        const filter = {email: user.email};
        const updateDoc = {$set:{role:'admin'}};
        const result = await users.updateOne(filter, updateDoc);
        res.json(result);
      })
      //get admin user-----------------------------------get admin user
      app.get('/users/:email', async(req, res) =>{
        const email = req.params.email;
        const query = { email: email};
        const user = await users.findOne(query)
        let isAdmin = false;
        if(user?.role == 'admin'){
          isAdmin = true
        }
        res.json({admin: isAdmin})
      })
    
      
    
     
    // Get method for find specefic document by id---------API-- get one
    // app.get('/myDocs/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const quary = {_id:ObjectId(id)};
    //   const result = await myDocsCollection.findOne(quary);
    //   res.send(result)
    
    // })
      //Delete Method  delete a doc-----------------API--Delete 
      // app.delete('/myDocs/:id', async(req, res)=>{
      //   const id = req.params.id;
      //   const query = {_id:ObjectId(id)};
      //   const result = await myDocsCollection.deleteOne(query);
      //   // console.log('deleted id', result);
      //   res.json(result); 
      // })
    
    
        
      } finally {
        // await client.close();
      }
    }
    run().catch(console.dir);
    
    
    app.get('/' , (req, res)=>{
      res.json('team32 working on......');
    })
    
    app.listen(port, ()=> {
      console.log('team32 listing from',port)
    })