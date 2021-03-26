const express = require('express');
const bodyParser = require('body-parser');
const password = 'Zym4syH_f77e!V';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://myDbUser:Zym4syH_f77e!V@cluster0.gpyrw.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.get('/', (req, res) => {
//     res.send('hello i am working');
// })

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        console.log(product);

        productCollection.insertOne(product)
            .then(result => {
                // res.send(result);
                console.log('one product added successfully');
                // res.send('one product added successfully');
                res.redirect('/');
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log('delete product');
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then((result) => {
                // console.log(result);
                res.send(result.deletedCount > 0);
            })
    })

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { price: req.body.price, quantity: req.body.quantity }
            })
            .then(result => {
                // console.log(result);
                res.send(result.modifiedCount > 0);
            })
    })

});

app.listen(3000);