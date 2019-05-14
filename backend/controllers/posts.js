const Post= require('../models/post');

exports.getPosts=async (req,res,next)=>{
  const posts=await Post.find();
  res.status(200).json({posts:posts});
};

exports.getPost=async (req,res,next)=>{
  const post=await Post.findById(req.params.id);
  if(post){
    res.status(200).json(post);
  } else {
    res.status(404).json({message:'Post Not Found'});
  }
};

exports.createPost=async (req,res,next)=>{
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
};

exports.updatePost=async (req,res,next)=>{
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
};

exports.deletePost=async (req,res,next)=>{
  try{
    await Post.deleteOne({_id:req.params.id});
    res.status(200).json({message:'Deletion successful'});
  }catch (e) {
    console.log(e);
  }
};
