const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const { router } = require('./routes/authRouter');
const mongooseConnect = require('./models/mongooseConnect');
const { eventRouter } = require('./routes/eventRouter');
require('dotenv').config();


const app = express();

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'OPTIONS','PUT','DELETE', 'PATCH'],  
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json())


mongooseConnect()


  app.use( '/api/auth', router)

  app.use('/api/event', eventRouter)


app.listen(process.env.PORT || 3000, () => console.log("app started on", process.env.PORT ))