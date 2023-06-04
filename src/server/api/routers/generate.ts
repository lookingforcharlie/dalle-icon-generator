import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

import { Configuration, OpenAIApi } from "openai";
import { b64Image } from "../../../data/image";

import AWS from "aws-sdk";
// Setup S3 object using AWS library
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: env.ACCESS_KEY_ID,
    secretAccessKey: env.SECRET_ACCESS_KEY,
  },
  region: "us-east-1",
});

const BUCKET_NAME = "dalle-icon-generator";

const configuration = new Configuration({
  apiKey: env.DALLE_API_KEY,
});

// make an openai object
const openai = new OpenAIApi(configuration);

async function generateIcons(prompt: string, numOfIcons = 1) {
  if (env.DALLE_MOCK === "true") {
    // return an Array of images, because user might choose to generate multiple icons
    return new Array(numOfIcons).fill(b64Image);
  } else {
    const response = await openai.createImage({
      prompt,
      n: numOfIcons, //You can request 1-10 images at a time using the n parameter.
      size: "512x512", //images can have a size of 256x256, 512x512, or 1024x1024 pixels.
      response_format: "b64_json", // We are using b64_json for storing images to S3
    });
    if (!response.data.data) return;

    return response.data.data.map((result) => result.b64_json || "");
  }
}

// trpc mutation: you want to modify or change something in your backend, like delete insert...
// trpc query: you want to get something back, you not mutating at all
export const generateRouter = createTRPCRouter({
  // define what inputs are needed for this method, here we just need a prompt
  // trpc built-in with zod: zod will automatically validate the input for you
  // we use z.object to define input
  // make sure this endpoint has to have 'prompt' to pass in, otherwise AI won't know what to generate
  // chain on this method with mutation, and write some code when someone does some mutation to this method
  generateIcon: protectedProcedure
    .input(
      z.object({
        prompt: z.string(),
        color: z.string(),
        shape: z.string(),
        style: z.string(),
        numberOfIcons: z.number().min(1).max(5),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // we gonna use ctx to get user id, prisma object reading writing in the database
      // TODO: Verify the user has enough credit
      // do a update in Prisma
      // we have a ctx object
      // updateMany will loop through to find any record that matches this criteria
      const { count } = await ctx.prisma.user.updateMany({
        where: {
          id: ctx.session.user.id, // TODO: Replaced with a real id
          credit: {
            // gte: 1, // gte: greater than or equal
            gte: input.numberOfIcons, // gte: greater than or equal
          },
        },
        data: {
          credit: {
            // decrement: 1,
            decrement: input.numberOfIcons,
          },
        },
      });

      // When user has enough credits, the value of res is {count: 1}
      // When credits ain't enough, the value of res is {count: 0}
      console.log("From tRPC generateIcon", count);

      // error handling when count <= 0
      if (count <= 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You do not have enough credits.",
        });
      }

      //TODO: make a fetch request to Dalle api
      // const response = await openai.createImage({
      //   prompt: input.prompt,
      //   n: 1, //You can request 1-10 images at a time using the n parameter.
      //   size: "256x256", //images can have a size of 256x256, 512x512, or 1024x1024 pixels.
      // });

      // if (!response.data.data[0]) return;
      // const url = response.data.data[0].url;

      const finalPrompt = `a modern ${input.shape} icon in ${input.color} of a ${input.prompt}, ${input.style}, high quality, unreal engine graphics quality`;

      // created a DALLE_MOCK and a function, so that we don't need to hit the real api every time
      // Now, base64EncodedImage returns an Array now.
      const base64EncodedImage = await generateIcons(
        finalPrompt,
        input.numberOfIcons
      );

      const createdIcons = await Promise.all(
        // Let's loop through base64EncodedImage
        base64EncodedImage!.map(async (img) => {
          // Create and keep track on the icon we just generated
          // After we created it in the db
          const icon = await ctx.prisma.icon.create({
            data: {
              prompt: input.prompt,
              userId: ctx.session.user.id,
            },
          });
          //TODO: Save the images to the S3 bucket
          await s3
            .putObject({
              Bucket: BUCKET_NAME,
              Body: Buffer.from(img, "base64"),
              Key: icon.id, // TODO: generate a random ID for the key
              ContentEncoding: "base64",
              ContentType: "image/gif",
            })
            .promise();
          return icon;
        })
      );

      // Now we return a bunch of objects
      return createdIcons.map((icon) => {
        return {
          // input carries 'prompt' we send it in
          message: `I come from the prompt: '${input.prompt}'`,
          // imageUrl: base64EncodedImage, // Now, we sent back the actual image, it's big, especially user generates 5 images at a time, it will be expensive to display them on the page.
          imageUrl: `https://${BUCKET_NAME}.s3.amazonaws.com/${icon.id}`,
        };
      });
    }),
});

// https://thumbs.dreamstime.com/z/cute-bunny-holding-carrot-thin-line-vector-icon-rabbit-linear-graphic-symbol-isolated-white-logo-design-concept-cute-rabbit-150521474.jpg

// Prompt
// a modern icon in ${input.color} of a ${input.prompt}, 3D rendered, metallic material, shiny, minimalist
// a modern icon in ${input.color} of a ${input.prompt}, pixel style, minimalistic, dark background
