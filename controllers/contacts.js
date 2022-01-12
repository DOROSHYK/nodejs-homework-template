const fs = require('fs/promises');
const path = require('path')
const { randomUUID } = require('crypto');
// const contacts = require('./contacts.json')
const contactsPath = path.join(__dirname, './contacts.json')

const listContacts = async () => {
 const data = await fs.readFile(contactsPath,  "utf-8");
  const allContacts = JSON.parse(data);
  if (!allContacts) {
    return [];
  }
  return allContacts;

}

const getContactById = async (contactId) => {
    const contacts = await listContacts();
  const oneContact = contacts.find(item => String(item.id) === String(contactId));
  
  if (!oneContact) {
    return null;
    
  }
  return oneContact;
}

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  
  const idx = contacts.findIndex(item => String(item.id) === String(contactId))

  if (idx === -1) {
    return null;
  }
  const removeContactById = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return removeContactById;
}

const addContact = async ({ name, email, phone }) => {
   const contacts = await listContacts();
  const newContact = {
    id: randomUUID(),
    name,
    email,
    phone

  }
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContact = async ({contactId,name, email, phone}) => {
  const contacts = await listContacts()
  const idx = contacts.findIndex(item => String(item.id) === String(contactId))

  if (idx === -1) {
    return null
  }
  contacts[idx] = {  contactId,name, email, phone};
    await fs.writeFile(contactsPath, JSON.stringify(contacts))
  return contacts[idx]
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}


