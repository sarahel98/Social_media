const API = require('./api');
const express = require('express');
const router = express.Router();
router.use(express.json());

// middleware pour afficher les details de chaque requete recu
router.use((req, res, next) => {
  //console.log(`${req.method} http://localhost:4000${req.path}`);
  //console.log('Query', JSON.stringify(req.query, null, 2));
  //console.log('Body', JSON.stringify(req.body, null, 2));
  next();
});

// Authentification
router.post('/authentification/login', API.login);
router.post('/authentification/logout', API.logout);
router.post('/authentification/mdp',API.findPassword);

// User
router.post('/users', API.createUser);
router.get('/users', API.isAuthorised, API.listUsers);
router.get('/users/:iduser(\\d+)', API.isAuthorised, API.getUser);
router.delete('/users',API.isAuthorised ,API.deleteUser);
router.post('/users/change', API.isAuthorised, API.changePassword);
router.post('/users/change/firstlast', API.isAuthorised, API.modifyFirstnameLastname);


// Friends
router.post('/users/:iduser(\\d+)/friends', API.isAuthorised, API.addFriend);
router.get('/users/:iduser(\\d+)/friends', API.isAuthorised, API.listFriends);
router.delete('/users/:iduser(\\d+)/friends/:idfriend(\\d+)', API.isAuthorised, API.removeFriend);

// Messages
router.post('/users/:iduser(\\d+)/messages', API.isAuthorised, API.addMessage);
router.get('/users/:iduser(\\d+)/messages', API.isAuthorised, API.listUserMessages);
router.delete('/users/:iduser(\\d+)/messages/:idmessage(\\d+)', API.isAuthorised, API.removeMessage);

router.get('/users/:iduser(\\d+)/friends/messages', API.isAuthorised, API.listFriendsMessages);
router.get('/users/messages', API.isAuthorised, API.listAllMessages);

// Recherche
router.get('/recherche', API.isAuthorised, API.recherche);

router.get('/checkAuthorisation', API.isAuthorised, API.checkAuthorisation);
router.get('/checkAuthorisation/:iduser(\\d+)', API.isAuthorised, API.checkAuthorisation);
module.exports = router;
