const express=require('express');
const app=express();

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Headers','PUT, PATCH, GET, POST, DELETE, OPTIONS');
  next();
});
app.use('/api/posts',(req,res,next)=>{
  const posts=[
    {title:'Title',content:'content'},
    {title:'Title1', content:'Content2'}
  ];
  res.status(200).json({posts:posts});
});


module.exports=app;
