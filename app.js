//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require ("mongoose");
const dotenv = require('dotenv')

const homeStartingContent = "Welcome to the world of mechanical engineers,where you are a teacher, a student, a researcher, a reporter and many more.... Come.. join the community of enthusiastic mechanical engineers and redefine the world with your imaginations.";
const aboutContent = "This is a vibrant community of passionate individuals driven by a shared enthusiasm for delving into cutting-edge mechanical technologies. Our collective pursuit spans various facets of this domain, allowing each member to immerse themselves in the specific area that resonates most profoundly with their interests and expertise. ";
const contactContent = "Wanted to know anything else....  Here are our contact details ";

dotenv.config({path: "views/uri.env"});

const app = express();

app.set('view engine', 'ejs');

mongoose.connect (process.env.DB_URI, {useNewUrlParser:true} )

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
  title:String,
  content:String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find()
  .then((posts)=>{
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  })

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save();

  res.redirect("/");

});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId})
  .then((post)=>{
    res.render("post", {
      title: post.title,
      content: post.content
    });
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
