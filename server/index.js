require("dotenv").config();

const express = require("express");
const cors = require("cors");

// const PORT = 4005;

const { PORT } = process.env;

const {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
} = require("./controllers/posts");
const { login, register, logout } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

const app = express();

const sequelize = require("../server/util/database");
const Post = require("./models/post");
const User = require("./models/user");

// console.log(process.env);

User.hasMany(Post);
Post.belongsTo(User);

app.use(express.json());
app.use(cors());

//Auth
app.post("/register", register);
app.post("/login", login);

//Get Post - no auth
app.get("/post", getAllPosts);

//CRUD Posts - auth required
app.get("/userposts/:userId", isAuthenticated, getCurrentUserPosts);
// app.post("/posts", isAuthenticated, addPost);
app.post("/posts", addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => console.log(`server is running on ${PORT}`));
  })
  .catch((err) => console.log(err));
