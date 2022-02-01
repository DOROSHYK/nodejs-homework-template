const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

const { User } = require('../../model/user');
const { authenticate } = require('../../middlewares/authenticate');
const  upload  = require('../../middlewares/upload');


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
})

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
  await User.findByIdAndUpdate(_id,  avatarURL ,  {new: true });
  res.json({avatarURL});
})

module.exports = router;


