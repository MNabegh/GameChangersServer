const express = require('express');
const validate = require('express-validation');
import expressJwt from 'express-jwt';
const userValidation = require('../User/Config/user.validations');
const UserManager = require('./UserManager');
import config from '../../../config/config'

const router = express.Router(); // eslint-disable-line new-cap

/** POST /users/login - Returns token if correct username and password is provided */
router.route('/login')
  .post(validate(userValidation.login), UserManager.loginUser);

/** POST /users/signup - Regiester new user */
router.route('/signup')
  .post(validate(userValidation.register),UserManager.registerUser);


// get the current user object
router.route('/user')
  .get(expressJwt({ secret: config.jwtSecret }), UserManager.getUser);

router.route('/fetch/user')
  .post(expressJwt({ secret: config.jwtSecret }), UserManager.getAnotherUser);

// get the current user;s team status object
// router.route('/team')
// .get(expressJwt({ secret: config.jwtSecret }), UserManager.getTeamStatus);

/** POST /users/forgot-password - Send a mail to reset the password of a user */
router.route('/forgot-password')
  .post(validate(userValidation.forgotPassword), UserManager.forgotPassword);
  
/** POST /users/reset-password - Reset the password of the user */
router.route('/reset-password')
  .post(validate(userValidation.resetPassword), UserManager.resetPassword); 
  
router.route('/create-judge')
  .post(expressJwt({ secret: config.jwtSecret }), validate(userValidation.createJudge), UserManager.createJudge); 

router.route('/get-judge')
  .get(expressJwt({ secret: config.jwtSecret }), UserManager.getJudgeById); 
router.route('/judges')
  .get(expressJwt({ secret: config.jwtSecret }), UserManager.getAllJudges); 

router.route('/isJudge/:email')
  .get(expressJwt({ secret: config.jwtSecret }), UserManager.isJudge)

router.route('/makeJudge/:email')
  .get(expressJwt({ secret: config.jwtSecret }),UserManager.makeAuserAJudge)  

router.route('/createNewJudge/')
  .post(expressJwt({ secret: config.jwtSecret }),UserManager.createJudge)    

/** GET /users/protected-route - Example of how to protect an endpoint */
router.route('/protected-route')
  .get(expressJwt({ secret: config.jwtSecret }), (req,res)=>{
    /**
     * You can access the authenticated user object using req.user
     * This is the payload of the created token
     */
    res.send("AUTHORIZED");
  });
router.route('/authenticate')
  .post(UserManager.authenticate)
module.exports = router;