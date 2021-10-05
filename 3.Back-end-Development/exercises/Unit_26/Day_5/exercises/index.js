const express = require('express');
const registerUser = require('./routes/passwords');
const btcPrice = require('./routes/btcPrice');
const posts = require('./routes/posts');

const app = express();

app.use(express.json());
app.use('/user', registerUser);
app.use('/btc', btcPrice);
app.use('/posts', posts);

app.listen(3001, () => {
  console.log('Aplicação ouvindo na porta 3001')
});
