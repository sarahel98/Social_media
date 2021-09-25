const db = require('../db/database');
const _ = require('lodash');

class Messages {
  static async exists(idmessage) {
    const { row, error } = await db.async.get('SELECT * FROM messages WHERE id = ?', [idmessage]);
    return row;
  }
  static async create(iduser, text, date) {
    const { lastID, changes } = await db.async.insert('INSERT INTO messages (iduser, text, date) VALUES (?,?,?)', [iduser, text, date]);
    return lastID;
  }
  static async remove(id) {
    const { lastID, changes } = await db.async.delete('DELETE FROM messages WHERE id = ?', [id]);
    return changes;
  }
  static async getUserMessages(iduser) {
    const { rows } = await db.async.all('SELECT * FROM messages WHERE iduser = ? ', [iduser]);
    return rows;
  }
  static async getAllUsersMessages() {
    const { rows } = await db.async.all(
      'SELECT messages.id id, messages.iduser iduser, messages.text text, messages.date date, users.login login FROM messages inner join users on users.id = messages.iduser ORDER BY date DESC',
      []
    );
    return rows;
  }
  static async recherche(text) {
    const { rows } = await db.async.all(
      `SELECT messages.id id, messages.iduser iduser, messages.text text, messages.date date, users.login login FROM messages inner join users on users.id = messages.iduser where text like '%${text}%' ORDER BY date DESC`,
      []
    );
    return rows;
  }

  static async getAllFriendsMessages(iduser) {
    const {
      rows,
    } = await db.async.all(
      'SELECT messages.id id, messages.iduser iduser, messages.text text, messages.date date FROM users INNER JOIN friends ON users.id = friends.iduser INNER JOIN messages ON friends.idfriend = messages.iduser WHERE users.id = ?',
      [iduser]
    );
    return rows;
  }
}

exports.default = Messages;
