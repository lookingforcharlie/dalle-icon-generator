- prisma folder: this is where we define our schema

- npx prisma studio: load up a tool connected to the local Sqlite database

- Create tRPC router for generating icons:

1. Add GeneratRouter in root.ts
2. Create a file generate.ts in routers folder
3. Use zod to type the router

- NextAuth

1. create a new project in cloud google, and set up the auth
2. Get google_client_id and google_client_secret
3. Create a button on the page with signIn function import from next-auth/react
