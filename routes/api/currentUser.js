const express = require('express');

const { User } = require('../../model/user');
const { authenticate } = require('../../middlewares/authenticate');


const router = express.Router();

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

module.exports = router;


// 00.26.00 hv