const express = require('express');
const { NotFound, BadRequest } = require('http-errors');
const router = express.Router();
const Joi = require('joi');
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
    next(error);
    
  }
  
})

router.get('/:contactId', async (req, res, next) => {
 const { contactId } = req.params;
  try {
   
    const result = await contactsOperations.getContactById(contactId);
    
    if (!result) {
      throw new NotFound('Contact not found'); 
    
     
    }
    res.json(result);
  } 
  catch (error) {
    next(error);
  
   }
})


router.post('/', async (req, res, next) => {
  try {
    const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
     
    }
    const result = await contactsOperations.addContact(req.body)
    res.status(201).json(result);
   } catch (error) {
    next(error); 
  }
})


router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsOperations.removeContact(contactId);
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
    
     const { error } = joiSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
     
    }
    const { contactId } = req.params;
    const result = await contactsOperations.updateContact({ contactId, ...req.body} );
    if (!result) {
      throw new NotFound(`Contact with id=${contactId} not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
   }
  
})

module.exports = router
