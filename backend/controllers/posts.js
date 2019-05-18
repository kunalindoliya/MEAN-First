const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
  const pageSize=+req.query.pageSize;
  const currentPage=+req.query.currentPage;
  const query=Post.find();
  if(pageSize && currentPage){
     query.skip(pageSize * (currentPage-1)).limit(pageSize);
  }
  const posts = await query;
  const totalPosts = await Post.countDocuments();
  res.status(200).json({posts: posts, maxPosts:totalPosts});
};

exports.getPost = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.status(200).json(post);
  } else {
    res.status(404).json({message: 'Post Not Found'});
  }
};

exports.createPost = async (req, res, next) => {
  const url=req.protocol +'://'+req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url+'/'+req.file.path
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
    console.log(e);
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
    imagePath: imagePath
  });
  try {
    await Post.updateOne({_id: req.params.id}, post);
    res.status(200).json({message: 'Updating successful'});
  } catch (e) {
    console.log(e);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    await Post.deleteOne({_id: req.params.id});
    res.status(200).json({message: 'Deletion successful'});
  } catch (e) {
    console.log(e);
  }
};
