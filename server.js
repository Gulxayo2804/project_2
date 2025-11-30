const express = require('express');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use((err, req,res,next)=>{
    const status = err.statusCode || 500;
    const message = err.message;
    console.log(err)
    res.status(status).json({message})
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})