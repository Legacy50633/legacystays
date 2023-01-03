const mongoose = require('mongoose')
const Schema = mongoose.Schema
const FSchema = new Schema({

  name:{
        type:String,
        required:true
    
    },
    price:
    {type:Number,
      required:true  
    },
    available:
    {
    type:Number,
    required:true
},
weight:{
  type:Number,
  required:true
}
})
  
module.exports = mongoose.model('Fruit',FSchema)