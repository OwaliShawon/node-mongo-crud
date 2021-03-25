const express = require('express');
const bodyParser = require('body-parser');
const password = 'Zym4syH_f77e!V';
const MongoClient = require('mongodb').MongoClient;

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
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        console.log(product);

        productCollection.insertOne(product)
            .then(result => {
                // res.send(result);
                console.log('one product added successfully');
                res.send('one product added successfully');
            })
    })
});

app.listen(3000);