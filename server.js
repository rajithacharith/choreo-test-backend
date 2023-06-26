const express = require('express');
var bodyParser = require('body-parser');
// const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const axios = require('axios');
const qs = require('qs');

const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
console.log('process.env.JWKS_URI: ' + process.env.JWKS_URI);


// app.use(jwt({
//     // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
//     secret: jwksRsa.expressJwtSecret({
//       jwksRequestsPerMinute: 5,
//       jwksUri: process.env.JWKS_URI
//     }),
//     getToken: function fromHeaderOrQuerystring (req) {
//         return req.headers['x-jwt-assertion'];
//     },
//     algorithms: ['RS256']
//   }));

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

// Function to decode JWT token
const decodeJWT= (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

app.use((req, res, next) => {
    const token = req.headers['x-jwt-assertion'];
    console.log('token: ' + token);
    if (!token) {
        return res.status(401).send({ message: 'Missing token.' });
    }
    const decoded = decodeJWT(token);
    if (!decoded) {
        return res.status(401).send({ message: 'Invalid token.' });
    }
    req.auth = decoded;
    next();
});

app.get('/products', (req, res) => {
    console.log('GET /products request received from user ' + req.auth.sub);
    console.log("Exchanged token: " + exchangeToken(req.headers['x-access-token']));

    console.log(config);

    res.json(products);
});

app.post('/products', (req, res) => {
    const product = req.body;
    console.log('POST /products request received from user ' + req.auth.sub);
    console.log(req.headers['x-access-token']);
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


async function exchangeToken(token) {
    let data = {
        'grant_type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'subject_token': req.headers['x-access-token'],
        'subject_token_type': 'urn:ietf:params:oauth:token-type:jwt',
        'requested_token_type': 'urn:ietf:params:oauth:token-type:jwt',
        'scope': 'read_booking' 
    };

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.asgardeo.io/t/charithr/oauth2/token',
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            'Authorization': 'Basic ZlRiS0JlYm9ZU2pkU1F3OVc3U2o4NXhKSWpFYTpEYUtVRmdySWVXajJ3THNvZlQ5OHhEaTBMajRh', 
        },
        data : qs.stringify(data)
    };

    return await axios.request(config);
}


app.listen(9090, () => {
    console.log('Server running on port 3000.');
});


