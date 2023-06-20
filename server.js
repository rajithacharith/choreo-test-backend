const express = require('express');
var bodyParser = require('body-parser');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const app = express();
app.use(express.json());

app.use(jwt({
    // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: process.env.JWKS_URI
    }),
    getToken: req => req.headers['x-jwt-assertion'],
    algorithms: [ 'RS256' ]
  }));

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
    console.log('GET /products request received from user ' + req.auth.sub);
    res.json(products);
});

app.post('/products', (req, res) => {
    const product = req.body;
    console.log('POST /products request received from user ' + req.auth.sub);
    products.push(product);
    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    console.log('DELETE /products request received from user ' + req.auth.sub);
    const id = parseInt(req.params.id);
    const index = products.findIndex(product => product.id === id);
    products.splice(index, 1);
    res.json({ message: `Product ${id} deleted.`});
});


app.listen(9090, () => {
    console.log('Server running on port 3000.');
});
