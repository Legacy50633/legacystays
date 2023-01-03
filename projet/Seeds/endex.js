const Fruit = require('../models/fruits')
const products = require('./fruit.js')
const mongoose = require("mongoose")
mongoose.connect("mongodb://0.0.0.0:27017/ninja-cart",{
    useUnifiedTopology:true,
    useNewUrlParser:true
})
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error   "));
db.once("open",()=>{
    console.log("Hooked bro")
})


const seedDB= async() =>{
    await Fruit.deleteMany({})
   for(let i = 0;i < 22; i++){
         const ran = Math.floor(Math.random()*23);
        const list = new Fruit({
            name:`${products[ran].name}`,
            price:`${products[ran].price}`,
            available:`${products[ran].available}`,
            weight:`${products[ran].weight}`,
            
          
        })
        await list.save() 
   }

}

seedDB()