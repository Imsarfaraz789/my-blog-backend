import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinaryConfig.js";
import blogPost from "../model/blog.js";
import emailModel from "../model/emailSubscribe.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// this is the testing api
router.get("/", (req, res) => {
  res.send("test api is working");
});

// this is the blog post api
router.post(
  "/blogpost",
  upload.fields([
    { name: "blogImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, summary, category, description, profileName } = req.body;

      const blogImageFile = req.files.blogImage[0].path;
      const profileImageFile = req.files.profileImage[0].path;

      if (!blogImageFile) {
        return res.status(400).json({ error: "Blog image is required" });
      }

      if (!profileImageFile) {
        return res.status(400).json({ error: "Profile image is required" });
      }

      const [uploadedBlogImage, uploadedProfileImage] = await Promise.all([
        cloudinary.v2.uploader.upload(blogImageFile, { folder: "blog_images" }),
        cloudinary.v2.uploader.upload(profileImageFile, {
          folder: "profile_images",
        }),
      ]);

      const newPost = new blogPost({
        title,
        summary,
        category,
        description,
        profileName,
        blogImage: uploadedBlogImage.secure_url,
        profileImage: uploadedProfileImage.secure_url,
      });

      await newPost.save();
      res.status(201).json(newPost);
    } catch (error) {
      console.log("New post creation failed", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// this is list all the blog on admin  component

router.get("/allblog", async (req, res) => {
  try {
    const allpost = await blogPost.find();
    res.status(200).json(allpost);
  } catch (error) {
    console.log("post are not send");
  }
});

// this is the blog delete api
router.delete("/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await blogPost.findByIdAndDelete(id);
    res.status(200).send({ message: "Blog post deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: "Error deleting blog post" });
  }
});

// this is list all the blog post at admin
router.get("/admin/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await blogPost.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update the blog from the admin component
router.put("/admin/blog/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, category, description } = req.body;

    const updatePost = await blogPost.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        category,
        description,
      },
      { new: true }
    );

    if (!updatePost) {
      return res.status(404).send({ error: "Blog post not found" });
    }

    res.status(200).send({ message: "Post updated", updatedPost: updatePost });
  } catch (error) {
    console.error("Error updating blog post:", error);
    res.status(500).send({ error: "Error updating blog post" });
  }
});

// this is the api list all the blog at categry component
router.get("/singlepost/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const singlePost = await blogPost.findById(id);
    if (!singlePost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(singlePost);
  } catch (error) {
    console.error("Error retrieving post:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// subscribe email
router.post("/emailsubscribe", async (req, res) => {
  try {
    const { email } = req.body;
    const existingEmail = await emailModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).send({ error: "Email already subscribed" });
    }

    const newEmail = new emailModel({ email });
    await newEmail.save();

    res.status(200).send({ message: "Subscribed" });
  } catch (error) {
    console.error("Error subscribing email:", error);
    res.status(500).send({ error: "Failed to subscribe email" });
  }
});

export default router;
