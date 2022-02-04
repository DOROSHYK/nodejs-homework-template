const express = require('express');
const { BadRequest, Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { nanoid } = require('nanoid');


const { User } = require('../../model/user');
const { joiSchema } = require('../../model/user');
const sendEmail = require('../../helpers/sendEmail');

const router = express.Router();
const { SECRET_KEY, SITE_NAME } = process.env;


router.post('/signup', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict("Email in use");
    }
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
      verificationToken
    });

    const data = {
      to: email,
      subject: 'Підтвердження email',
      html:`<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}"> Підтвердити </a>`,
    }
    await sendEmail(data);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: "starter"
      }
    })
  }
  catch (error) {
    next(error)
  }
}
);


router.post('/login', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized("Email or password is wrong");
    }
    if (!user.verify) {
       throw new Unauthorized("Email not verify")
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new Unauthorized("Email or password is wrong");
    }
    const payload = {
      id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
      token,
      user: {
        email,
        
      }
    })

  }
  catch (error) {
    next(error)
  }
});





module.exports = router;