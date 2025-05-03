const { Router } = require("express");

const validators = require("../handlers/validators.handler");
const helpers = require("../handlers/helpers.handler");
const asyncHandler = require("../utils/asyncHandler");
const locals = require("../handlers/locals.handler");
const auth = require("../handlers/auth.handler");
const utils = require("../utils");
const env = require("../env");

const router = Router();

router.post(
  "/login",
  locals.viewTemplate("partials/auth/form"),
  validators.login,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 5 }),
  asyncHandler(auth.local),
  asyncHandler(auth.login)
);

router.post(
  "/signup",
  locals.viewTemplate("partials/auth/form"),
  auth.featureAccess([!env.DISALLOW_REGISTRATION, env.MAIL_ENABLED]),
  validators.signup,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 5 }),
  validators.signupEmailTaken,
  asyncHandler(helpers.verify),
  asyncHandler(auth.signup)
);

router.post(
  "/create-admin",
  locals.viewTemplate("partials/auth/form_admin"),
  validators.createAdmin,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 5 }),
  asyncHandler(auth.createAdminUser)
);

router.post(
  "/change-password",
  locals.viewTemplate("partials/settings/change_password"),
  asyncHandler(auth.jwt),
  validators.changePassword,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 5 }),
  asyncHandler(auth.changePassword)
);

router.post(
  "/change-email",
  locals.viewTemplate("partials/settings/change_email"),
  asyncHandler(auth.jwt),
  auth.featureAccess([env.MAIL_ENABLED]),
  validators.changeEmail,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 3 }),
  asyncHandler(auth.changeEmailRequest)
);

router.post(
  "/apikey",
  locals.viewTemplate("partials/settings/apikey"),
  asyncHandler(auth.jwt),
  helpers.rateLimit({ window: 60, limit: 10 }),
  asyncHandler(auth.generateApiKey)
);

router.post(
  "/reset-password",
  locals.viewTemplate("partials/reset_password/request_form"),
  auth.featureAccess([env.MAIL_ENABLED]),
  validators.resetPassword,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 3 }),
  asyncHandler(auth.resetPassword)
);

router.post(
  "/new-password",
  locals.viewTemplate("partials/reset_password/new_password_form"),
  locals.newPassword,
  validators.newPassword,
  asyncHandler(helpers.verify),
  helpers.rateLimit({ window: 60, limit: 5 }),
  asyncHandler(auth.newPassword)
);

// ✅ ROTA DE VERIFICAÇÃO DE E-MAIL
router.get("/verify/:verificationToken", asyncHandler(auth.verify), (req, res) => {
  if (req.isHTML) {
    res.redirect("/dashboard");
  } else {
    res.status(200).send({ message: "Email verificado com sucesso." });
  }
});

// ✅ ROTA DE CONFIRMAÇÃO DE TROCA DE E-MAIL
router.get("/change-email/:changeEmailToken", asyncHandler(auth.changeEmail), (req, res) => {
  if (req.isHTML) {
    res.redirect("/settings");
  } else {
    res.status(200).send({ message: "Email alterado com sucesso." });
  }
});

module.exports = router;
