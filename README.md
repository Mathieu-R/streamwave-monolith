# streamwave-monolith

6 years ago, I made a progressive web application called Streamwave. This was a full front-end app made with Preact and using multiple REST APIs for the back.

Despite the codebase being outdated, I notice lately that the way we most of the time build web applications these days (i.e. front-end framework + API) is not always needed. I would even say that it's overkill for a lot of projects and add unnecessary complexity (e.g. managing authentication on client side, duplication of routes on client side,...).

The goal for this new project is to rework Streamwave as a SSR first application and adding web / preact components on top of it only when it's needed.

### But does not building SPA with front-end framework allows better user experience (e.g. no page reload on view change) ?

Well, in fact, you can have a similar SPA experience with SSR.
Check for example [Unpoly](https://unpoly.com/) or [Hotwire](https://hotwired.dev/).

We can now even have transitions between views using [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)

### Legacy Web App

- streamwave: https://github.com/Mathieu-R/streamwave

### Legacy APIs

- streamwave-library: https://github.com/Mathieu-R/streamwave-library
- streamwave-auth: https://github.com/Mathieu-R/streamwave-auth

What changed ?

- Focus on desktop.
- PostgreSQL instead of MongoDB.
- Using session cookies instead of passing JWT to the request.
- SSR with TSX as template engine.

### Tech

- [x] [AdonisJS](https://adonisjs.com/)
- [x] [Lucid ORM](https://lucid.adonisjs.com/docs/introduction)
- [x] [TSX as template engine](https://adonisjs.com/blog/use-tsx-for-your-template-engine)
- [x] [Preact](https://preactjs.com/)

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
