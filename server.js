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
// for loop to 10000 to log
for (let i = 0; i < 10000; i++) {
    console.error('Error message ' + i);
}


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
    var token = req.headers['x-jwt-assertion'];
    console.log('token: ' + token);
    if (!token) {
        token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IlpqY3dObUkyWkRKbU5XUTBNMkk1WXpaaVl6Sm1abU00WWpNd01ERmxPVEE0TUdFM1pXWmpaVE16TmpVM1lXVTFNelZpWWpaa09Ua3paall6T0dZeU5nIn0=.eyJzdWIiOiJjYzRhYzQ1Yy0yODdjLTQwMzItYTUxNi02YTcxYWRhNmQyNzAiLCJodHRwOlwvXC93c28yLm9yZ1wvY2xhaW1zXC9hcGluYW1lIjoiZXhwcmVzc2JhY2tlbmQgLSBQcm9kdWN0IENhdGFsb2cgODAzIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvYXBwbGljYXRpb250aWVyIjoiVW5saW1pdGVkIiwiaXNzIjoid3NvMi5vcmdcL3Byb2R1Y3RzXC9hbSIsImh0dHA6XC9cL3dzbzIub3JnXC9jbGFpbXNcL2VuZHVzZXJUZW5hbnRJZCI6IjAiLCJodHRwOlwvXC93c28yLm9yZ1wvY2xhaW1zXC9hcHBsaWNhdGlvblVVSWQiOiI3NjE3ODU2OC04YjIwLTQwZWUtOTEwMS0zZjM4N2U2OWEwYmYiLCJjbGllbnRfaWQiOiJ2cmZKX2NUTkp1c3NIeF9uOXFrVW1qNHNwS0FhIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvc3Vic2NyaWJlciI6IjMxM2IzMGNhLTM0OTQtNDY4Ny1iZjBhLTlkZGJmNTY5YjhkMyIsImF6cCI6InZyZkpfY1ROSnVzc0h4X245cWtVbWo0c3BLQWEiLCJzY29wZSI6ImFwcF9yb2xlcyBncm91cHMgb3BlbmlkIHByb2ZpbGUgdXJuOmNoYXJpdGhyOmV4cHJlc3NiYWNrZW5kcHJvZHVjdGNhdGE6Z2V0X3Byb2R1Y3QiLCJhcHBsaWNhdGlvbl9yb2xlcyI6ImN1c3RvbWVyIiwiZXhwIjoxNjg3ODQ2MzE4LCJodHRwOlwvXC93c28yLm9yZ1wvY2xhaW1zXC9hcHBsaWNhdGlvbmlkIjoiNzYxNzg1NjgtOGIyMC00MGVlLTkxMDEtM2YzODdlNjlhMGJmIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvdXNlcnR5cGUiOiJBcHBsaWNhdGlvbl9Vc2VyIiwib3JnX25hbWUiOiJjaGFyaXRociIsImlhdCI6MTY4Nzg0MjcxOCwianRpIjoiMTUxYjJlOTctZDRiZC00ZjRiLWJhNWMtYWRkZjA5NWY1NGNkIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvYXBpY29udGV4dCI6IlwvYTBhNTFhZDQtMWFjZC00ZmY1LTkxODUtZGI3NTlmNTQwYzQwXC95bHVoXC9leHByZXNzYmFja2VuZFwvcHJvZHVjdC1jYXRhbG9nLTgwM1wvMS4wLjAiLCJodHRwOlwvXC93c28yLm9yZ1wvY2xhaW1zXC92ZXJzaW9uIjoiMS4wLjAiLCJodHRwOlwvXC93c28yLm9yZ1wvY2xhaW1zXC9rZXl0eXBlIjoiU0FOREJPWCIsImh0dHA6XC9cL3dzbzIub3JnXC9jbGFpbXNcL2FwcGxpY2F0aW9uQXR0cmlidXRlcyI6eyJhc2dhcmRlb19hcHBfaWRfc2FuZGJveCI6IjYzNWY0NDk5LTJmYzgtNGYzNy04Yzc1LTY5MGEzZjhkYWQ5MiJ9LCJncm91cHMiOlsiQ3VzdG9tZXJzIl0sImh0dHA6XC9cL3dzbzIub3JnXC9jbGFpbXNcL2FwcGxpY2F0aW9ubmFtZSI6ImV4cHJlc3MyIiwib3JnX2lkIjoiYTBhNTFhZDQtMWFjZC00ZmY1LTkxODUtZGI3NTlmNTQwYzQwIiwiaHR0cDpcL1wvd3NvMi5vcmdcL2NsYWltc1wvdGllciI6IlVubGltaXRlZCJ9.zPrzIMrhfQVCpPqvSiDKaD2I76GwEbRYaUsGnYopbUxP58o9tmGN2FuS3ueViTwIibk_Svow4bJK6oQQzgr6yKKVasK-DWTgI0GXqKE31Vyo0bLId9_DNGwZdwjQdg-NjiJKtJ5Lcj2cTkOMCUKKgkAG7C72wBpjI0XGQAzRFsXRNg1H6UyQw9Dv5xn1mbFU6J3pxZO_sud9t01IN6bZVZJyuHzATiQZKxQnohG9kiRrf0Ypsogk2nR2H4ZGF0gkNrLNGkSTsoymCf16G8oM7-vDzw_P5t-SxKXvex6E1WVlCaoHgjHsNXwWPtcGtGALqySH8kERxYkoVnQOlA6xzA==";
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

    console.log(req.headers['x-jwt-assertion']);

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

app.get('/commonauth', (req, res) => {
    console.log("Commonauth method invoked.");
    res.json({});
    // method to get the access token.
});

app.get('/nic', (req, res) => {
    const clientId = "vrfJ_cTNJussHx_n9qkUmj4spKAa";
    console.log(req.auth.client_id);
    if(req.auth.client_id === clientId) {
        console.log("Request from client 1");
    }
    // method to get nic number.
    console.log("NIC method invoked.");
    const nicdata = {
        "name": "Charith Rajitha",
        "nic": "962391010V"
    }
    res.json(nicdata);
})

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
    for (let i = 0; i < 10000; i++) {
        console.log('Error message ' + i);
    }
});


