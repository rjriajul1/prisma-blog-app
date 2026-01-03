import express from "express"
import { postRouter } from "./modules/post/post.route";

const app = express();
app.use(express.json());

app.use('/posts', postRouter);
app.use('/getAllPost', postRouter)

app.get("/", (req, res)=> {
    res.send("Hello world!")
})
export default app;