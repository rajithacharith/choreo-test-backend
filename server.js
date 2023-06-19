const express = require('express');
var bodyParser = require('body-parser');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Successful response.');
});

const products = [
    { id: 1, name: 'Product 1' },
    { id: 2, name: 'Product 2' },
    { id: 3, name: 'Product 3' },
    { id: 4, name: 'Product 4' },
    { id: 5, name: 'Product 5' },
    { id: 6, name: 'Product 6' },
    { id: 7, name: 'Product 7' },
];

app.get('/products', (req, res) => {
    res.json(products);
});

app.post('/products', (req, res) => {
    const product = req.body;
    console.log(product);
    products.push(product);
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(product => product.id === id);
    products.splice(index, 1);
    res.json({ message: `Product ${id} deleted.`});
});


app.listen(9090, () => {
    console.log('Server running on port 3000.');
});
