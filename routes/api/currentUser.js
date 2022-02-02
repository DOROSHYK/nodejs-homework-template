const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');
const { NotFound, BadRequest } = require('http-errors');
// const { nanoid } = require('nanoid');

const { User } = require('../../model/user');
const { authenticate } = require('../../middlewares/authenticate');
const upload = require('../../middlewares/upload');
const sendEmail = require('../../helpers/sendEmail');

const { SITE_NAME } = process.env;

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get('/current', authenticate, async (req, res) => {

  const { email, subscription } = req.user;
  res.json({
    user: {
      email,
      subscription: subscription
    }
  })
    
});

router.get('/logout', authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.patch('/avatars', authenticate, upload.single('avatar'), async (req, res) => {
  const { path: tempUpload, originalname } = req.file;
  
  const changeSizeImg = await Jimp.read(tempUpload);
  changeSizeImg.resize(250, 250);
  await changeSizeImg.writeAsync(tempUpload);

  const { _id } = req.user;

  const [extension] = originalname.split('.').reverse();
  const newFileName = `${_id}.${extension}`;
  const fileUpload = path.join(avatarsDir, newFileName);
  await fs.rename(tempUpload, fileUpload);
  const avatarURL = path.join('avatars', newFileName);
  await User.findByIdAndUpdate(_id, avatarURL, { new: true });
  res.json({ avatarURL });
});

router.get('verify/:verificationToken', async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound('User not found');
    }
    await User.findOneAndUpdate(user._id, { verificationToken: null, verify: true });
    res.json({
      message: 'Verification successful',
    })
  }
  catch (error) {
    next(error)
  }
});


router.post('verify/', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound('User not found');
    } if (user.verify) {
      throw new BadRequest( "Verification has already been passed");
    }

    const { verificationToken } = user;
    
     const data = {
      to: email,
      subject: 'Підтвердження email',
      html:`<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}"> Підтвердити </a>`,
    }
    await sendEmail(data);
    res.json({ "message": "Verification email sent"})
  }
  catch (error) {
    next(error);
  }
})

module.exports = router;


