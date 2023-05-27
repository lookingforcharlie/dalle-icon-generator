# WDID

- prisma folder: this is where we define our schema

- npx prisma studio: load up a tool connected to the local Sqlite database

- Create tRPC router for generating icons:

1. Add GeneratRouter in root.ts
2. Create a file generate.ts in routers folder
3. Use zod to type the router

- NextAuth

1. create a new project in cloud google, and set up the auth: Authorised JavaScript origins: http://localhost:3000, Authorised redirect URIs: http://localhost:3000/api/auth/callback/google
2. Get google_client_id and google_client_secret
3. Add GoogleProvider in auth.ts file
4. Create a button on the page with signIn function import from next-auth/react

- Setup Prisma to connect to DB

1. add 'credit Int @default(5)' in model User object in schema.prisma file
2. 'npx prisma db push' to sync the change in model User with DB
3. 'npx prisma studio': You can see the credit part in prisma studio now
4. All the models that created in schema.prisma can be seen in prisma studio

- Setup DALLE

1. Generate apikey from https://platform.openai.com/account/api-keys
2. npm install openai
3. import { Configuration, OpenAIApi } from "openai";
4. Setup environmemnt DALLE_API_KEy
5. Use the code in https://platform.openai.com/docs/libraries/node-js-library & https://platform.openai.com/docs/guides/images/usage to fetch images
6. return the image url back to client

- Store the images generated from DALLE to AWS S3

1. DALLE returns the url of the images generated from the prompt, but it will expire within a day I suppose, so we need to find a place to store the images.
2. Go to S3 on AWS, create a bucket, click your bucket. The things we store called Objects, we can possible setup the bucket to host a website
3. Go to IAM dashboard to manage access to AWS resources, click Users to create a new user.
4. Create a new policy for this new user: Write: putobject ...
5. After creation of the user, click the user to setup security credentials
6. Click 'create access key', choose 'Application running on an AWS compute service'
7. Generate 'access key' and 'secret access key', put in .env file
8. Add two keys settings in env.mjs file
9. We need to change the return value from DALLE from url to base64, cos we need base64 version of the image to store in AWS S3
10. npm i aws-sdk, import AWS from 'aws-sdk';
11. Setup S3 object, and use s3.putObject({}) to upload images onto AWS S3

- Setup schema.prisma to track the images who created, the user can view them in the dashboard later

1. Create 'model Icon'
2. Save the 'prompt' in the db
3. npx prisma db push -> npx prisma studio: restart the server to apply the changes

- Display all the icons on the page using url hosted on AWS S3 Bucket - config the Bucket to be a static host

1. Go to your Bucket -> Properties -> Static website hosting - Enable -> Input 'index.html' for Index document.
2. Go to your Bucket -> Permissions -> Block public access -> edit -> uncheck Block all public access (Everyone can go to your bucket, if they know your id.)
3. Go to your Bucket -> Bucket policy -> Edit -> Click to show 'Policy Example Page' -> Add customized policy to input field
4. In Permissions -> Cross-origin resource sharing (CORS) -> Add cors policy from examples
