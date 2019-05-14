const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const Post=require('./models/post');
const mongoose=require('mongoose');
mongoose.connect('mongodb://localhost:27017/mean-complete',{useNewUrlParser: true})
  .then(()=>{
    console.log('connected successfully!');
  })
  .catch(err=>console.log(err));

app.use(bodyParser.json());

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods','PUT, PATCH, GET, POST, DELETE, OPTIONS');
  next();
});
app.post('/api/post',async (req,res,next)=>{
  const post=new Post({
    title:req.body.title,
    content:req.body.content
  });
  try{
    const createdPost=await post.save();
    res.status(201).json({message:'Post added successfully!',postId:createdPost._id});
  }catch (e) {
    console.log(e);
  }
});

app.put('/api/post/:id',async (req,res,next)=>{
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  try{
    await Post.updateOne({_id:req.params.id},post);
    res.status(200).json({message:'Updating successful'});
  }catch (e) {
    console.log(e);
  }
});

app.get('/api/post/:id',async (req,res,next)=>{
  const post=await Post.findById(req.params.id);
  if(post){
    res.status(200).json(post);
  } else {
    res.status(404).json({message:'Post Not Found'});
  }
});

app.get('/api/posts',async (req,res,next)=>{
  const posts=await Post.find();
  res.status(200).json({posts:posts});
});

app.delete('/api/post/:id',async (req,res,next)=>{
  try{
    await Post.deleteOne({_id:req.params.id});
    res.status(200).json({message:'Deletion successful'});
  }catch (e) {
    console.log(e);
  }
});


module.exports=app;
