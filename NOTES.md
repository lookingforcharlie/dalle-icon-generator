# WDID

## prisma folder: this is where we define our schema

1. NextAuth takes care of model

## Next.JS App folder directories

- pages -> api: next.js treats them like api endpoints.

1. Request from frond end actually call pages/api/trpc/
1. You can create traditonal Restful API inside the folder.
1. We put stripe.ts endpoint here.
1. trpc and auth are provided by T3 stack out of box.

## /server: tRPC server directory

1. From trpc.ts, trpc provides 'publicProcedure' for all the users and 'privateProcedure' for only login users
2. From root.ts, this is where we create routers, like express routers with all kinds of functions

## /utils/api.ts: boilerplate code to set up the connection from front end and back end from trpc

## npx prisma studio: load up a tool connected to the local Sqlite database

## Create tRPC router for generating icons:

1. Add GeneratRouter in root.ts
2. Create a file generate.ts in routers folder
3. Use zod to type the router

## NextAuth

1. create a new project in cloud google, and set up the auth: Authorised JavaScript origins: http://localhost:3000, Authorised redirect URIs: http://localhost:3000/api/auth/callback/google
2. Get google_client_id and google_client_secret
3. Add GoogleProvider in auth.ts file
4. Create a button on the page with signIn function import from next-auth/react

## Setup Prisma to connect to DB

1. add 'credit Int @default(5)' in model User object in schema.prisma file
2. 'npx prisma db push' to sync the change in model User with DB
3. 'npx prisma studio': You can see the credit part in prisma studio now
4. All the models that created in schema.prisma can be seen in prisma studio

## Setup DALLE

1. Generate apikey from https://platform.openai.com/account/api-keys
2. npm install openai
3. import { Configuration, OpenAIApi } from "openai";
4. Setup environmemnt DALLE_API_KEy
5. Use the code in https://platform.openai.com/docs/libraries/node-js-library & https://platform.openai.com/docs/guides/images/usage to fetch images
6. return the image url back to client

## Store the images generated from DALLE to AWS S3

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

## Setup schema.prisma to track the images who created, the user can view them in the dashboard later

1. Create 'model Icon'
2. Save the 'prompt' in the db
3. npx prisma db push -> npx prisma studio: restart the server to apply the changes

## Display all the icons on the page using url hosted on AWS S3 Bucket - config the Bucket to be a static host

1. Go to your Bucket -> Properties -> Static website hosting - Enable -> Input 'index.html' for Index document.
2. Go to your Bucket -> Permissions -> Block public access -> edit -> uncheck Block all public access (Everyone can go to your bucket, if they know your id.)
3. Go to your Bucket -> Bucket policy -> Edit -> Click to show 'Policy Example Page' -> Add customized policy to input field
4. In Permissions -> Cross-origin resource sharing (CORS) -> Add cors policy from examples

## Setup Stripe: user pays to buy credits, you will receive the money, and increment certain amount of credits for the user

1. Go to Stripe to create an account, get public and secret keys, setup .env and env.mjs
2. Allow user to create checkout session: Server -> api -> routers -> root.ts -> add a router called 'checkout'
3. npm install stripe --save
4. https://stripe.com/docs/api/checkout/sessions/create , get the create Session code
5. create checkout.ts for new router, add code in it
6. npm i --save @stripe/stripe-js: allow run Stripe at the frontend
7. Create custom hook of useBuyCredits, create a button of 'buy Credit' on page
8. https://dashboard.stripe.com/account/payments/settings , for setting the payment methods
9. Create a test product in Stripe Dashboard, get the product_id, click 'buy Credit', you will see the checkout session page
10. Setup the webhook, setup local stripe listener, strip cli brew: https://stripe.com/docs/stripe-cli
11. You need stripe cli tool setup, so you can emulate this websocket event on your local machine
12. add "stripe:listen": "stripe listen --forward-to localhost:3000/api/stripe" to package.json
13. create stripe.ts file

## Work on prompt, add radio buttons for style, shape and color

1. Show spinner in the button, check Button.tsx reusable component, check Spinner.tsx, got it from flowbite: https://flowbite.com/docs/components/spinner/

## Setup Supabase

1. https://supabase.com/docs/guides/integrations/prisma
2. Get the connection string (Database URL) for Prisma, put it into .env
3. Modify schema.prisma, run 'npx prisma db push' to sync the local prisma schema to supabase

## Deployment - AWS Amplify

1. put following into 'build commands'

```
- env | grep -e NEXT_PUBLIC_ >> .env.production
- env | grep -e DATABASE_URL >> .env.production
- env | grep -e STRIPE_SECRET_KEY >> .env.production
- env | grep -e STRIPE_WEB_HOOK_SECRET >> .env.production
- env | grep -e HOST_NAME >> .env.production
- env | grep -e PRICE_ID >> .env.production
- env | grep -e NEXTAUTH_SECRET >> .env.production
- env | grep -e NEXTAUTH_URL >> .env.production
- env | grep -e GOOGLE_CLIENT_ID >> .env.production
- env | grep -e GOOGLE_CLIENT_SECRET >> .env.production
- env | grep -e DALLE_API_KEY >> .env.production
- env | grep -e DALLE_MOCK >> .env.production
- env | grep -e SECRET_ACCESS_KEY >> .env.production
- env | grep -e ACCESS_KEY_ID >> .env.production
- echo "NODE_ENV=production" >> .env.production
```

2. Adding environment variables one by one, we will come back to change Host_name to real domain where we host our application

3. Error:

```
44:49  Error: Promise-returning function provided to attribute where a void return was expected.  @typescript-eslint/no-misused-promises

How to fix it? add following into rules of .eslintrc.cjs
"@typescript-eslint/no-misused-promises": [
      2,
      {
        checksVoidReturn: {
          attributes: false,
        },
      },
    ],
```

4. https://master.d1lhwjhb4w0vwe.amplifyapp.com/
5. Setup a domain (sub-domain), and point to this application, then we gonna go back through all the google authentication configurations, add access to that domain
6. go to https://domains.google.com/, works with AWS Domain management, setup production looks domain, https://icons.meetxb.com/
7. Right now, when I sign in with google auth, browser redirects me to localhost:3000, we don't want that, so we setup host_name and NEXTAUTH_URL to https://icons.meetxb.com in AWS Amplify
8. Add new endpoint for webhooks in Stripe
9. Part 26, round 20:00, talking about setup Stripe when you want to go production.
10. Every time you modify a environmet variable, you need to redeploy the app again

## Creating the collection pages

## Implement generating multiple icons at one batch

1. Add numberOfIcons input in generate.tsx file, add numberOfIcons in generate.ts at the backend
2. Modified function generateIcons in generate.ts, modified the return value from a string to an Array of String
3. Now, generateRouter returns an Array of image urls.
4. In the frontend, the imagesUrl becomes an Array of String, we need loop through imagesUrl to render multiple icons on the page
