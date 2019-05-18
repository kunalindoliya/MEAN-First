const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const postRoutes=require('./routes/posts');
const userRoutes=require('./routes/user');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/mean-complete',{useNewUrlParser: true})
  .then(()=>{
    console.log('connected successfully!');
  })
  .catch(err=>console.log(err));

app.use(bodyParser.json());
app.use('/backend/files',express.static('backend/files'));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods','PUT, PATCH, GET, POST, DELETE, OPTIONS');
  next();
});

app.use('/api/posts',postRoutes);
app.use('/api/user',userRoutes);


module.exports=app;
