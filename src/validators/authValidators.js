const { body } = require("express-validator");

exports.registerValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username  is required")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email is not valid"),
  body("password").notEmpty().withMessage("Password is required").matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/).withMessage('password must be with minimum 8 characters, at least one upper case English letter, one lower case English letter, one number and one special character'),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];
