import { connectToDB } from "@utils/database";
import { v2 as cloudinary } from "cloudinary";

import Post from "@models/post";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const GET = async (req, res) => {
  try {
    await connectToDB();
    const posts = await Post.find({});
    return new Response(JSON.stringify({ success: true, data: posts }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error }), {
      status: 500,
    });
  }
};

export const POST = async (req, res) => {
  const { name, prompt, photo } = await req.json();
  const photoUrl = await cloudinary.uploader.upload(photo);
  try {
    await connectToDB();
    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });
    return new Response(JSON.stringify({ success: true, data: newPost }), {
      status: 201,
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error }), {
      status: 500,
    });
  }
};
