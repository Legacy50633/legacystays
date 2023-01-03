const express = require('express')

const path = require('path')
const session = require('express-session')
const mongoose = require('mongoose');
const Item = require('./models/items');
const User = require('./models/user');
const flash = require('connect-flash');
const passport = require('passport')
const passportLocal = require('passport-local')
const methodOverride = require("method-override");
const { register } = require('./models/items');
mongoose.connect('mongodb://0.0.0.0:27017/ninja-cart',{
    useUnifiedTopology:true,
    useNewUrlParser:true,
    
})

const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error   "));
db.once("open",()=>{
    console.log("Hooked bro")
})

const app = express();
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(methodOverride('_method'))
 const sessionConfig = {

       
       secret:"hope",
        resave:false,
        saveUninitialized:true,
        cookie:
        {
            httpOnly:true,
            expires:Date.now() +1000*60*60*24*7,
            maxAge:1000*60*60*24*7
        }
 } 
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
   res.locals.success =  req.flash('success');
   res.locals.error =  req.flash('error')
   next();
})
app.get('/ninjas/register',(req,res)=>{

    res.render('register');

})
app.get('/ninjas/home',(req,res)=>{
 
       res.render("home");
})
app.get('/ninjas',async(req,res)=>{
    const items = await Item.find({})
    res.render('pages/ninjas',{items})
})
app.get('/ninjas/new',async(req,res)=>{
    res.render('pages/new')
})



app.post('/ninjas/register',async(req,res)=>{

    
        const {email,username,password} = req.body
     const user =  new User({email,username});
     const registeredUser = await User.register(user,password);

  console.log(registeredUser)
     req.flash('success',"Welcome Boss!")

 })



app.post('/ninjas',async(req,res)=>{
const item = new Item(req.body.item)
 await item.save();
 req.flash('success',"Sucessfully created !")
 res.redirect(`/ninjas`)
})

app.get('/ninjas/:id',async(req,res)=>{

   const product = await Item.findById(req.params.id);
    res.render('pages/show',{product})
    
})
app.get('/ninjas/:id/edit',async(req,res)=>{
    const product = await Item.findById(req.params.id)
    res.render('pages/edit',{product})

})
app.put("/ninjas/:id",async(req,res)=>{
const {id} = req.params;
const item =  await Item.findByIdAndUpdate(id,{...req.body.item})
req.flash('success',"Sucessfully Updated!")
res.redirect(`/ninjas/${item._id}`)
})

app.delete('/ninjas/:id',async(req,res)=>{
    const {id} = req.params
    await Item.findByIdAndDelete(id)
    req.flash('success',"Sucessfully Deleted!")
    res.redirect('/ninjas') 
})

app.listen(3000,(req,res)=>{
    console.log("Fine Tuned")
})

