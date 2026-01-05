import { Request, Response } from "express";
import { postService } from "./post.service";

const createPost = async (req:Request, res:Response) => {
  try{
      if(!req.user){
      return res.status(400).json({
        error: "Post creation failed"
    })
      }
    const result = await postService.createPost(req.body, req.user.id as string)
    res.status(201).json(result)
  }catch(e){
    res.status(400).json({
        error: "Post creation failed",
        details: e
    })
  }
}


const getAllPost = async (req:Request, res: Response) => {
  try{

   const result = await postService.getAllPost()
   res.status(200).json({
    success: true,
    message: "Posts retrived successfully",
    data: result
   })
    }catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

};

export const postController = {
    createPost,
    getAllPost
}