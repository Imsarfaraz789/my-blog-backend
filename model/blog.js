import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    blogImage: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },

    profileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const blogPost = mongoose.model("blogPost", blogSchema);

export default blogPost;
