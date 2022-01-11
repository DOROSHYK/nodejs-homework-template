const express = require('express');
const { NotFound, BadRequest } = require('http-errors');
const Joi = require('joi');

const router = express.Router();

const { Contact } = require("../../model/contacts");
const {authenticate} = require('../../middlewares/authenticate')

const joiSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
})

router.get('/', async (_, res, next) => {

  try {
    const contacts = await Contact.find();
  res.json(contacts);
   }
  catch (error) {
    next(error);
    
  }
  
})

router.get('/:contactId', async (req, res, next) => {
 const { contactId } = req.params;
  try {
   
    const result = await Contact.findById({_id:contactId});
    
    if (!result) {
      throw new NotFound('Contact not found'); 
    
     
    }
    res.json(result);
  } 
  catch (error) {
    if (error.message.includes('Cast to ObjectId failed')) {
      error.status = 404;
    }
    next(error);
  
   }
})


router.post('/', authenticate, async (req, res, next) => {
  console.log(req.user);
  try {

    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
     
    }
    const result = await Contact.create(req.body)
    res.status(201).json(result);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400;
    }
    next(error);  
  }
}) 


router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    console.log(result);
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`);
    }
    res.json({"message": "contact deleted"})
    
  } catch (error) {
    next(error);
  }
})



router.put('/:contactId', async (req, res, next) => {
  try {
   
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate( contactId, req.body, {new: true} );
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400;
    }
    next(error);
   }
  
})


router.patch('/:contactId/favorite', async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const { favorite } = req.body;
    const result = await Contact.findByIdAndUpdate( contactId, {favorite}, {new: true} );
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    if (error.message.includes('validation failed')) {
      error.status = 400;
    }
    next(error);
   }
  
})

module.exports = router
