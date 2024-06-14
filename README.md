[![dependencies Status](https://david-dm.org/Mathieu-R/streamwave-api-ts/status.svg)](https://david-dm.org/Mathieu-R/streamwave-api-ts)

# streamwave-monolith

This is a merge and rework of the streamwave web app and APIs using AdonisJS, Inertia and React.

### Legacy Web App 

- streamwave: https://github.com/Mathieu-R/streamwave

### Legacy APIs

- streamwave-library: https://github.com/Mathieu-R/streamwave-library
- streamwave-auth: https://github.com/Mathieu-R/streamwave-auth

What changed ?

- Unified user table instead of splitting for local user and Google user.
- Using session cookies instead of passing JWT to the request.
- SSR with Inertia and Preact instead of separating the front-end and back-end.

### Tech

- [x] [AdonisJS](https://adonisjs.com/)
- [x] [Lucid ORM](https://lucid.adonisjs.com/docs/introduction)
- [x] [Inertia](https://inertiajs.com/)

### Usage

#### Prepare media files

Prepare some media files you want to stream in the application.  
You can use the command line tool [metadatapp](https://github.com/Mathieu-R/metadatapp) to extract metadata and create necessary files needed for streaming.  
Then, move the data folder at the root of this project.

#### Generate Google OAuth2 secrets

Go to https://console.cloud.google.com and create a new project.  
Then go to APIs and services > Credentials then create an `OAuth 2.0 Client`. Take note of **Client ID**, **Client secret**.  
You need to set the **Authorised JavaScript origins** to `http://localhost:3000` and **Authorised redirect URIs** to `http://localhost:3000/user/google/login/callback`.

### Set environment variables

Set environment variables following .env.example file.

#### Run

```
npm install
npm run build
npm run start
```
