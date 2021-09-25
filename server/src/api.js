const express = require('express');
const Users = require('./entities/Users.js').default;
const Friends = require('./entities/Friends').default;
const Messages = require('./entities/Messages').default;
const _ = require('lodash');

const CREATED = 201;
const OK = 200;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;
const FORBIDDEN = 403;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function checkEmptyValues(values) {
  const isBadRequest = values.some(value => ['', undefined, null].includes(value));
  return isBadRequest;
}
// User
exports.createUser = async function createUser(req, res) {
  const { login, password, lastname, firstname } = req.body;
  if (checkEmptyValues([login, password])) {
    return res.status(BAD_REQUEST).json({ error: 'login, password' });
  }
  try {
    if (await Users.exists(login)) {
      return res.status(CONFLICT).json({ error: 'login already exist' });
    }
    const iduser = await Users.create(login, password, lastname, firstname);
    return res.status(CREATED).json({ iduser: iduser });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.getUser = async function getUser(req, res) {
  const { iduser } = req.params;
  if (checkEmptyValues([iduser])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser' });
  }
  try {
    const user = await Users.get(iduser);
    if (!_.isEmpty(user)) {
      return res.status(OK).json({ user: user });
    } else {
      return res.status(NOT_FOUND).json({});
    }
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.listUsers = async function listUsers(req, res) {
  try {
    const users = await Users.getALL();
    return res.status(OK).json({ users: users });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.deleteUser = async function deleteUser(req, res) {
  const { login, password } = req.body;
  const iduser = await Users.login(login, password); 
  try{
    if (!iduser) {
      return res.status(UNAUTHORIZED).json({ error: 'login or password  not correct' });
    }
    else{
      const sup = await Users.delete(login, password);
      return res.status(OK).json({ done : 'User deleted'});
    }
  } catch(error) {
      return res.status(SERVER_ERROR).json({ error : error });
    }
};
exports.changePassword = async function changePassword(req, res){
  const{ login, password, newPassword } = req.body;
  const iduser = await Users.login(login, password);
  if (checkEmptyValues([login, password, newPassword])) {
    return res.status(BAD_REQUEST).json({ error: 'login, password or newPassword missing' });
  }
  try{
    if (!iduser) {
      return res.status(UNAUTHORIZED).json({ error: 'login or password  not correct' });
    }
    if(password !== newPassword){
      const newpwd = await Users.changePwd(login, password, newPassword) ;
      return res.status(OK).json({ done : 'password changed' });
    }
    else{
     return res.status(BAD_REQUEST).json({ error : 'choose a new password different from the previous one'});
    }
  }catch(error){
        return res.status(SERVER_ERROR).json({ error : error });
        }
};
exports.modifyFirstnameLastname = async function modifyFirstnameLastname(req, res){
  const{ login, password, firstname, lastname } = req.body;
  const iduser = await Users.login(login, password);
  if (checkEmptyValues([login, password, firstname, lastname])) {
    return res.status(BAD_REQUEST).json({ error: 'firstname or lastname missing' });
  }
  try{
    if(!iduser){
      return res.status(UNAUTHORIZED).json({ error: 'login or password not correct' });
    }
    const addFL = await Users.addFirstLast(login, password, firstname, lastname);
    return res.status(OK).json({ done : 'firstname and lastname modified' });
  }catch(error){
    return res.status(SERVER_ERROR).json({ error : error });
   }
};

exports.findPassword = async function findPassword(req,res){
  const{login1,login2}=req.body;
  if (checkEmptyValues([login1,login2])) {
    return res.status(BAD_REQUEST).json({ error: 'login missing' });
  }
  try{
    const mdp = await Users.getMdp(login1);
    if(login1 != login2){
      return res.status(BAD_REQUEST).json({error:'les 2 logins sont différents'});
    }
    const login= await Users.exists(login1);
    if(_.isEmpty(login)){
      return res.status(NOT_FOUND).json({error:'login does not exist'});
    }
    if (!_.isEmpty(mdp)) {
      return res.status(OK).json({ mdp : mdp });
    } else {
      return res.status(NOT_FOUND).json({error:'password not found'});
    }
  }catch(error){
    return res.status(SERVER_ERROR).json({error:error});
  }
}

// Friends
exports.addFriend = async function addFriend(req, res) {
  const { iduser } = req.params;
  const { idfriend } = req.body;
  if (checkEmptyValues([iduser, idfriend])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser, idfriend' });
  }
  try {
    const existingId = await Friends.exists(iduser, idfriend);
    if (existingId) {
      return res.status(CREATED).json({ id: existingId });
    } else {
      const id = await Friends.create(iduser, idfriend);
      return res.status(CREATED).json({ id: id });
    }
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.listFriends = async function listFriends(req, res) {
  const { iduser } = req.params;
  if (checkEmptyValues([iduser])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser' });
  }
  try {
    const friends = await Friends.getFriends(iduser);
    return res.status(OK).json({ friends: friends });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.removeFriend = async function removeFriend(req, res) {
  const { iduser, idfriend } = req.params;
  if (checkEmptyValues([iduser, idfriend])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser, idfriend' });
  }
  try {
    const id = await Friends.exists(iduser, idfriend);
    if (!id) {
      return res.status(NOT_FOUND).json({error: 'No friends with this Id'});
    }
    const changes = await Friends.remove(id);
    return res.status(OK).json({ changes: changes });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};

// Messages
exports.addMessage = async function addMessage(req, res) {
  const { iduser } = req.params;
  const { text, date } = req.body;
  if (checkEmptyValues([iduser, text, date])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser, text, date' });
  }
  try {
    const id = await Messages.create(iduser, text, date);
    return res.status(CREATED).json({ id: id });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.listUserMessages = async function listUserMessages(req, res) {
  const { iduser } = req.params;
  if (checkEmptyValues([iduser])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser' });
  }
  try {
    const messages = await Messages.getUserMessages(iduser);
    return res.status(OK).json({ messages: messages });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.removeMessage = async function removeMessage(req, res) {
  const { iduser, idmessage } = req.params;
  if (checkEmptyValues([iduser, idmessage])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser, idmessage' });
  }
  try {
    const message = await Messages.exists(idmessage);
    if (_.isEmpty(message)) {
      return res.status(NOT_FOUND).end();
    }
    const changes = await Messages.remove(message.id);
    return res.status(OK).json({ changes: changes });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.listAllMessages = async function listAllMessages(req, res) {
  try {
    const messages = await Messages.getAllUsersMessages();
    return res.status(OK).json({ messages: messages });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.listFriendsMessages = async function listFriendsMessages(req, res) {
  const { iduser } = req.params;
  if (checkEmptyValues([iduser])) {
    return res.status(BAD_REQUEST).json({ error: 'iduser' });
  }
  try {
    const messages = await Messages.getAllFriendsMessages(iduser);
    return res.status(OK).json({ messages: messages });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};

// Authentification
exports.isAuthorised = async function isAuthorised(req, res, next) {
  try {
    if (!req.session.iduser) {
      return res.status(UNAUTHORIZED).json({ error: 'must login first' });
    }
    if (req.params.iduser && req.params.iduser != req.session.iduser) {
      return res.status(UNAUTHORIZED).json({ error: 'not allowed' });
    }
    next();
  } catch (err) {
    res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.login = async function login(req, res) {
  const { login, password } = req.body;
  if (checkEmptyValues([login, password])) {
    return res.status(BAD_REQUEST).json({ error: 'login, password' });
  }
  try {
    const iduser = await Users.login(login, password);
    if (!iduser) {
      return res.status(UNAUTHORIZED).json({ error: 'login or password  not correct' });
    }
    req.session.iduser = iduser;
    return res.status(OK).json({ iduser: iduser });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};
exports.logout = async function logout(req, res) {
  if(req.session.iduser == null){
    return res.status(BAD_REQUEST).json({ error : 'not connected'});
   }
  req.session.iduser = null;
  return res.status(OK).json({ok : 'deconnexion'});
};

// Recherche
exports.recherche = async function recherche(req, res) {
  try {
    const { text } = req.query;
    if (checkEmptyValues([text])) {
      const messages = await Messages.getAllUsersMessages();
      return res.status(OK).json({ messages: messages });
    }
    const messages = await Messages.recherche(text);
    return res.status(OK).json({ messages: messages });
  } catch (error) {
    return res.status(SERVER_ERROR).json({ error: error });
  }
};

// checkAuthorisation
exports.checkAuthorisation = async function checkAuthorisation(req, res) {
  return res.status(OK).json({ message: `isAuthorised OK` });
};
