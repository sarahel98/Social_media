const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../src/app.js'); // c'est l'app "express"
const mocha = require('mocha');
chai.use(chaiHttp);
chai.should();

function generateText(length) {
  var result = [];
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
  }
  return result.join('');
}

mocha.describe("Test de l'API users", () => {
  mocha.it('users  ', async () => {
    const request = chai.request.agent(app.default).keepOpen();
    const user0 = {
      login: generateText(4),
      password: 'admin',
      lastname: 'admin',
      firstname: 'admin',
    };

    // create user
    const res1 = await request.post('/users').send(user0);
    const iduser = res1.body.iduser;
    res1.should.have.status(201);

    // check user
    const res2 = await request.get(`/users/${iduser}`);
    const user = res2.body.user;
    res2.should.have.status(200);
    chai.assert.deepEqual({ ...user0, id: iduser }, user);

    // check list user
    const res3 = await request.get(`/users`);
    const users = res3.body.users;
    res3.should.have.status(200);
    chai.assert.isAbove(users.length, 0);

    const res4 = await request.post('/users').send(user0);
    res4.should.have.status(409);
  });
  mocha.it('friends  ', async () => {
    const request = chai.request.agent(app.default).keepOpen();
    const user = {
      login: generateText(4),
      password: 'user',
      lastname: 'user',
      firstname: 'user',
    };
    const friend = {
      login: generateText(4),
      password: 'friend',
      lastname: 'friend',
      firstname: 'friend',
    };

    // create user & friend
    const res1 = await request.post('/users').send(user);
    const res2 = await request.post('/users').send(friend);
    res1.should.have.status(201);
    res2.should.have.status(201);
    user.id = res1.body.iduser;
    friend.id = res2.body.iduser;

    const addFriendRespnse = await request.post(`/users/${user.id}/friends`).send({ idfriend: friend.id });
    addFriendRespnse.should.have.status(201);

    const getFriendsResponse = await request.get(`/users/${user.id}/friends`);
    getFriendsResponse.should.have.status(200);
    const { friends } = getFriendsResponse.body;

    const isFriendSaved = friends.find(obj => obj.iduser === user.id && obj.idfriend === friend.id);
    chai.assert.isNotEmpty(isFriendSaved);
  });

  mocha.it('messages  ', async () => {
    const request = chai.request.agent(app.default).keepOpen();
    const user = {
      login: generateText(4),
      password: 'user',
      lastname: 'user',
      firstname: 'user',
    };
    const message = {
      text: generateText(4),
      date: Date.now(),
    };

    // create user
    const userResponse = await request.post('/users').send(user);
    userResponse.should.have.status(201);
    user.id = userResponse.body.iduser;

    // create messsage
    const addMessageRespnse = await request.post(`/users/${user.id}/messages`).send(message);
    addMessageRespnse.should.have.status(201);

    const getMessagesResponse = await request.get(`/users/${user.id}/messages`);
    getMessagesResponse.should.have.status(200);
    const { messages } = getMessagesResponse.body;

    const isMessageSaved = messages.find(obj => obj.iduser === user.id && obj.id === addMessageRespnse.body.id);
    chai.assert.isNotEmpty(isMessageSaved);

    const deletedMessagesResponse = await request.delete(`/users/${user.id}/messages/${addMessageRespnse.body.id}`);
    deletedMessagesResponse.should.have.status(200);
  });
  mocha.it('friends messages', async () => {
    const request = chai.request.agent(app.default).keepOpen();
    const user = {
      login: generateText(4),
      password: 'user',
      lastname: 'user',
      firstname: 'user',
    };
    const friend = {
      login: generateText(4),
      password: 'friend',
      lastname: 'friend',
      firstname: 'friend',
    };

    // create user & friend
    const res1 = await request.post('/users').send(user);
    const res2 = await request.post('/users').send(friend);
    res1.should.have.status(201);
    res2.should.have.status(201);
    user.id = res1.body.iduser;
    friend.id = res2.body.iduser;

    const addFriendRespnse = await request.post(`/users/${user.id}/friends`).send({ idfriend: friend.id });
    addFriendRespnse.should.have.status(201);

    const message = {
      text: generateText(4),
      date: Date.now(),
    };
    // create messsage
    const addMessageRespnse = await request.post(`/users/${friend.id}/messages`).send(message);
    addMessageRespnse.should.have.status(201);

    const getMessagesResponse = await request.get(`/users/${user.id}/friends/messages`);
    getMessagesResponse.should.have.status(200);
    const { messages } = getMessagesResponse.body;

    const isMessageSaved = messages.find(msg => msg.iduser === friend.id && msg.id === addMessageRespnse.body.id);
    chai.assert.isNotEmpty(isMessageSaved);
  });
  mocha.it('login  ', async () => {
    const request = chai.request.agent(app.default).keepOpen();
    //const request = chai.request.agent(app.default);

    const user = {
      login: generateText(4),
      password: 'admin',
      lastname: 'admin',
      firstname: 'admin',
    };

    // create user
    const res1 = await request.post('/users').send(user);
    user.id = res1.body.iduser;
    res1.should.have.status(201);

    const test1 = await request.get(`/checkAuthorisation`);
    test1.should.have.status(401);

    // login
    const loginResponseFaillure = await request.post(`/authentification/login`).send({ login: user.login, password: '1234' });
    loginResponseFaillure.should.have.status(401);

    const loginResponse = await request.post(`/authentification/login`).send({ login: user.login, password: user.password });
    loginResponse.should.have.status(200);

    const test2 = await request.get(`/checkAuthorisation`);
    test2.should.have.status(200);

    const test3 = await request.get(`/checkAuthorisation/${user.id}`);
    test3.should.have.status(200);

    const test4 = await request.get(`/checkAuthorisation/1234`);
    test4.should.have.status(401);

    const logoutResponse = await request.post(`/authentification/logout`).send({});
    logoutResponse.should.have.status(200);

    const test5 = await request.get(`/checkAuthorisation/${user.id}`);
    test5.should.have.status(401);
  });
});
