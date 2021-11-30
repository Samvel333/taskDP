const express = require('express');
const { connection } = require('./database/connection');
const user = require('./user/route');
const product = require('./product/route');

const app = express();
const {
  HOST,
  PORT,
} = process.env;

app.use(express.json());
app.use('/user', user.router);
app.use('/product', product.router)

connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log("Successfully conected to DB!");
});

app.listen(PORT, () => {
  console.log(`Server started: ${HOST}:${PORT}`)
})