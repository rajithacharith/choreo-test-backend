const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Successful response.');
});

app.listen(9090, () => {
    console.log('Server running on port 3000.');
});
