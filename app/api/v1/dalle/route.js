import { connectToDB } from "@utils/database";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const GET = async (req, res) => {
  try {
    await connectToDB();
    return new Response("Hello World!", { status: 200 });
  } catch (error) {
    return new Response("Failed", { status: 500 });
  }
};

export const POST = async (req, res) => {
  const { prompt } = await req.json();
  try {
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const image = aiResponse.data[0].b64_json;

    return new Response(JSON.stringify({ photo: image }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(error?.response.data.error.message, { status: 500 });
  }
};
