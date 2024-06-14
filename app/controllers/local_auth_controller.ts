// import type { HttpContext } from '@adonisjs/core/http'

import {HttpContext} from "@adonisjs/core/http";
import User, {Provider} from "#models/user";
import {
  getResetTokenValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  tokenValidator
} from "#validators/local_auth";
import {inject} from "@adonisjs/core";
import LocalAuthService from "#services/local_auth_service";
import {DateTime} from "luxon";
import env from "#start/env";

export default class LocalAuthController {

  @inject()
  async register({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    // validate the request
    const { firstname, lastname, email, password } = await request.validateUsing(registerValidator)

    // check user does not already exist
    const existingUser = await User
      .query()
      .where(query => {
        query
          .where("email", email)
          .where("provider", Provider.LOCAL)
      })
      .first()

    if (existingUser) {
      return response.conflict({message: "User already exists"})
    }

    // create the user (hash is handled by the model)
    const user = await localAuthService.createUser({firstname, lastname, email, password})

    // send email verification
    await localAuthService.sendVerificationEmail(user)
    return response.ok({message: ["User created successfully", "Verify your email to activate your account"]})
  }

  @inject()
  async validateAccount({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const qs = request.qs()
    const {token} = await tokenValidator.validate(qs)

    // check if token is still valid
    const user = await User
      .query()
      .where(query => {
        return query
          .where("provider", Provider.LOCAL)
          .where("emailVerificationToken", token)
          .where("emailVerificationTokenExpiredAt", ">", DateTime.now().toSQLDate());
      })
      .first()

    // token does not exist or is expired
    if (!user) {
      return response.unauthorized("This account verification token does not exist or is expired.")
    }

    await localAuthService.validateAccount(user)

    const url = env.get("NODE_ENV") === "production" ? "https://www.streamwave.be/auth/login" : `http://localhost:${env.get("FRONT_PORT_DEV")}/auth/login`;
    return response.redirect(url)
  }

  async login({ request, response, auth }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    // check credentials
    const user = await User.verifyCredentials(email, password)

    // check email is verified
    if (!user.emailVerified) {
      return response.unauthorized({message: "Account not validated. Please verify your e-mails."})
    }

    // login the user
    await auth.use("web").login(user)

    // redirect to home page if successful login
    const url = env.get("NODE_ENV") === "production" ? "https://www.streamwave.be/" : `http://localhost:${env.get("FRONT_PORT_DEV")}/`;
    return response.redirect(url)
  }

  @inject()
  async getResetToken ({request, response}: HttpContext, localAuthService: LocalAuthService) {
    const {email} = await request.validateUsing(getResetTokenValidator)

    console.log(request.host(), request.hostname())

    // check if user exists
    const user = await User.query()
      .where(query => {
        query
          .where("email", email)
          .where("provider", Provider.LOCAL)
      })
      .first()

    if (!user) {
      return response.noContent()
    }

    await localAuthService.sendResetPasswordEmail(user)

    response.ok({
      message: `Reset password e-mail sent to: ${user.email}.`
    });
  }

  @inject()
  async checkResetToken({ request, response }: HttpContext, localAuthService: LocalAuthService){
    const qs = request.qs()
    const {token} = await tokenValidator.validate(qs)

    // check if token is still valid
    const user = await localAuthService.checkResetToken(token)

    // token does not exist or is expired
    if (!user) {
      return response.unauthorized("This password reset token does not exist or is expired.")
    }

    return response.redirect("/auth/reset/${token}")
  }

  @inject()
  async resetPassword({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const {token} = await tokenValidator.validate(request.qs())
    const {password} = await request.validateUsing(resetPasswordValidator)

    // check if token is still valid
    const user = await localAuthService.checkResetToken(token)

    if (!user) {
      return response.unauthorized("This password reset token does not exist or is expired.")
    }

    // hashing is performed by the AuthFinder mixin
    // https://docs.adonisjs.com/guides/authentication/verifying-user-credentials#hashing-user-password
    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordTokenExpiredAt = null
    await user.save()

    response.ok({message: "Password successfully changed !"})
  }
}
