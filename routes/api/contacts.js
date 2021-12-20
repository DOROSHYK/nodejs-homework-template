const express = require('express');
// const { NotFound, BadRequest } = require('http-errors')
// const { status } = require('express/lib/response');
// const { json } = require('express/lib/response');
const router = express.Router()
const Joi = require('joi')
const contactsOperations = require("../../model/index");


const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

router.get('/', async (_, res, next) => {

  try {
    const contacts = await contactsOperations.listContacts();
  res.json(contacts);
   }
  catch (error) {
    // next(error);
    res.status(500).json({
      message: "Server error"
    })
  }
  
})

router.get('/:contactId', async (req, res, next) => {
 const { contactId } = req.params;
  try {
    // console.log(contactId)
    const result = await contactsOperations.getContactById(contactId);
    
    if (!result) {
      // throw new NotFound('Contact not found'); 
      const error = new Error("Not found");
      error.status = 404;
      throw error;
      // return res.status(404).json({
      //   message: "Not found"
      // })
    
    }
    res.json(result);
  } 
  catch (error) {
    // next(error);
    const { status = 500, message = "Server error" } = error;
     res.status(status).json({
      message
    })
  }
})

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
