const express=require('express');
const router=express.Router();
const postsController=require('../controllers/posts');
const checkAuth=require('../middleware/check-auth');
const multer=require('multer');
const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
    cb(null,'backend/files')
  },
  filename: (req,file,cb)=>{
    cb(null,Date.now()+'-'+file.originalname);
  }
});

router.get('',postsController.getPosts);
router.get('/:id',postsController.getPost);
router.post('',checkAuth,multer({storage:storage}).single('image'),postsController.createPost);
router.put('/:id',checkAuth,multer({storage:storage}).single('image'),postsController.updatePost);
router.delete('/:id',checkAuth,postsController.deletePost);

module.exports=router;
