/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import LocalAuthController from "#controllers/local_auth_controller";
import GoogleAuthController from "#controllers/google_auth_controller";
import CommonAuthController from "#controllers/common_auth_controller";
import {middleware} from "#start/kernel";

router.group(() => {
  // LOCAL AUTH
  router.post("/register/local", [LocalAuthController, "register"]);
  router.get("/validate", [LocalAuthController, "validateAccount"]);
  router.post("/login/local", [LocalAuthController, "login"]);
  router.post("/password/get-reset-token", [LocalAuthController, "getResetToken"]);
  router.post("/password/check-reset-token", [LocalAuthController, "checkResetToken"]);
  router.post("/password/reset", [LocalAuthController, "resetPassword"]);

  router.get("/login/google", [GoogleAuthController, "loginGoogle"])
  router.get("/login/google/callback", [GoogleAuthController, "loginGoogleCallback"])

  router.get("/logout", [CommonAuthController, "logout"])
}).prefix("/api/user")

router.group(() => {
  router.get("/library", )
}).prefix("/api/media")
  .use(middleware.auth())
router.on('/').renderInertia('home', { version: 6 })



