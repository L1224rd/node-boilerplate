const express = require('express');
const cors = require('cors');

require('dotenv').config();

const routes = require('./routes.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', routes);

app.listen(process.env.PORT, () => {
  console.log(`Ready at ${process.env.PORT}`);
});
