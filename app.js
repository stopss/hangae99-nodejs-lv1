const express = require("express");
const mongoose = require("mongoose");
// const nunjucks = require("nunjucks");
// const bodyParser = require("body-parser");
// const path = require("path");
const Article = require("./models/article");
const Comment = require("./models/comment");
const req = require("express/lib/request");

const app = express();
const router = express.Router();

// DB setting
mongoose.connect("mongodb://localhost/article-demo", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));


// app.set("view engine", "html");
// nunjucks.configure("./views", {
//     express: app,
//     watch: true,
// })

// 전체 게시글 목록 조회
router.get("/board", async (req, res) => {
    try {
        console.log("전체");
        const articles = await Article.find().sort("-createdAt").exec();
        res.send({ articles });
        // res.render("home.html", { articles });
    } catch (error) {
        console.log(error);
    }
    
});

// router.get("/write", (req, res) => {
//     console.log("여기get");

//     res.render("write.html")
// });

// 게시글 작성 API
router.post("/board", async (req, res) => {
    try{
        console.log("여기post");
        const { title, writer, content } = req.body;
        const createdAt = new Date();
        // db 저장
        const article = new Article({ title, writer, content, createdAt });
        await article.save();

        res.send({ article });
    } catch(error) {
        console.log(error);
    }
});

// 게시글 조회 API
router.get("/board/:articleId", async (req, res) => {
    try {
        const { articleId } = req.params;
        const article = await Article.findById(articleId).exec();
        const comment = await Comment.find({ articleId }).sort("-createdAt").exec();

        if (!article) {
            res.status(404).send({});
        } else {
            res.send({ article, comment });
        }
    } catch(error) {
        console.log(error)
    }
});

// 게시글 수정 API
router.put("/board/:articleId", async (req, res) => {
    try {
        const { articleId } = req.params;
        const title = req.body.title;
        const writer = req.body.writer;
        const content = req.body.content;
        const createdAt = new Date();
        
        const article = await Article.findById(articleId).exec();

        if(!article) {
            res.status(400).send({});
        } else {
            article.title = title;
            article.writer = writer;
            article.content = content;
            article.createdAt = createdAt;

            await article.save();
        }

        res.send({
            msg : "수정되었습니다",
        });
    } catch(error) {
        console.log(error);
    }
    
});

// 게시글 삭제 API
router.delete("/board/:articleId", async (req, res) => {
    try{
        const { articleId } = req.params;
        // 게시글 삭제
        const existsArticle = await Article.findOne({articleId}).exec();

        if (existsArticle) {
            existsArticle.delete();
        }

        // 해당 게시글에 관한 댓글 삭제
        Comment.deleteMany({articleId}).exec();

        res.send({
            msg: "게시글이 삭제되었습니다",
        });
    } catch(error) {
        console.log(error);
    }
    
});

// 댓글 목록 조회 API
router.get("/board/:articleId/comment", async (req, res) => {
    try {
        const { articleId } = req.params;

        const comment = await Comment.find({ articleId }).sort("-createdAt").exec();
        
        res.send({
            comment
        });
    } catch (error) {
        console.log(error);
    }
    
});

// 댓글 추가 API
router.post("/board/:articleId/comment", async (req, res) => {
    try {
        const { articleId } = req.params;
        const { value } = req.body;
        const createdAt = new Date();

        // 댓글 내용이 없을 경우 메세지 리턴
        if(!value) {
            res.send({
                msg : "댓글 내용을 입력해주세요"
            });
            return;
        }

        const comment = new Comment({ value, articleId, createdAt });
        await comment.save();

        res.send({
            comment
        });
    } catch(error) {
        console.log(error);
    }
});

// 댓글 수정 API
router.put("/board/:articleId/comment/:commentId", async (req, res) => {
    try {
        // const { articleId } = req.params;
        const { commentId } = req.params;

        const { value } = req.body;
        const createdAt = new Date();

        if(!value) {
            res.send({
                msg : "댓글 내용을 입력해주세요"
            });
            return;
        }
        
        const comment = await Comment.findById(commentId).exec();

        if(!comment) {
            res.status(400).send({});
        } else {
            comment.value = value;
            comment.createdAt = createdAt;

            await comment.save();
        }

        res.send({
            msg : "수정되었습니다",
        });
    } catch(error) {
        console.log(error);
    }
});

// 댓글 삭제 API
router.delete("/board/:articleId/comment/:commentId", async (req, res) => {
    try{
        // const { articleId } = req.params;
        const { commentId } = req.params;

        const existsComment = await Comment.findOne({commentId}).exec();

        if (existsComment) {
            existsComment.delete();
        }

        res.send({
            msg: "게시글이 삭제되었습니다",
        });
    } catch(error) {
        console.log(error);
    }
});


app.use(express.json());
app.use('/',express.urlencoded({ extended: false }), router);

// port setting
app.listen(3000, () => {
    console.log("서버가 요청을 받을 준비가 됐어요");
});