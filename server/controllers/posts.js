const Post = require("../models/post");
const User = require("../models/user");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({
      where: { privateStatus: false },
      include: [
        {
          model: User,
          required: true,
          attributes: [`username`],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log("ERROR IN getAllPosts");
    console.log(error);
    res.sendStatus(400);
  }
};

const getCurrentUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.findAll({
      where: { userId: userId },
      include: [
        {
          model: User,
          required: true,
          attributes: [`username`],
        },
      ],
    });
    res.status(200).send(posts);
  } catch (error) {
    console.log("ERROR IN getCurrentUserPosts");
    console.log(error);
    res.sendStatus(400);
  }
};

const addPost = async (req, res) => {
  try {
    const { title, content, status, userId } = req.body;
    await Post.create({ title, content, privateStatus: status, userId });
    console.log("addPost hit");
    res.status(200).send("Post created");
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
const editPost = async (req, res) => {
  // console.log("editPost");
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Post.update(
      { privateStatus: status },
      {
        where: {
          id: id,
        },
      }
    );
    res.status(200).send("Post updated");
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
const deletePost = async (req, res) => {
  // console.log("deletePost");
  try {
    const { id } = req.params;
    await Post.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

module.exports = {
  getAllPosts,
  getCurrentUserPosts,
  addPost,
  editPost,
  deletePost,
};
