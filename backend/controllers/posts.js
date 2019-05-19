const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.currentPage;
  try{
    const query=Post.find();
    if(pageSize && currentPage){
      query.skip(pageSize * (currentPage-1)).limit(pageSize);
    }
    const posts = await query;
    const totalPosts = await Post.countDocuments();
    res.status(200).json({posts: posts, maxPosts:totalPosts});
  }catch (e) {
    res.status(500).json({message: 'Fetching Posts failed!'});
  }

};

exports.getPost = async (req, res, next) => {
  try{
    const post = await Post.findById(req.params.id);
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post Not Found'});
    }
  }catch (e) {
    res.status(500).json({message: 'Fetching post failed!'});
  }
};

exports.createPost = async (req, res, next) => {
  const url=req.protocol +'://'+req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+'/'+req.file.path,
    creator: req.userData.userId
  });
  try {
    const createdPost = await post.save();
    res.status(201).json({
      message: 'Post added successfully!', post: {
        postId: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  } catch (e) {
    res.status(500).json({message: 'Creating post failed!'});
  }
};

exports.updatePost = async (req, res, next) => {
  let imagePath=req.body.imagePath;
  if(req.file){
    const url=req.protocol +'://'+req.get('host');
    imagePath=url+'/'+req.file.path
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  try {
    const result = await Post.updateOne({_id: req.params.id, creator:req.userData.userId}, post);
    if(result.n > 0){
      res.status(200).json({message: 'Updating successful'});
    } else {
      res.status(401).json({message: 'Not Authorized'});
    }
  } catch (e) {
    res.status(500).json({message: 'Failed to update post'});
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const result = await Post.deleteOne({_id: req.params.id, creator:req.userData.userId});
    if(result.n > 0){
      res.status(200).json({message: 'Deletion successful'});
    } else {
      res.status(401).json({message: 'Not Authorized'});
    }
  } catch (e) {
    res.status(500).json({message: 'Failed to delete post'});
  }
};
