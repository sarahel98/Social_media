const db = require('../db/database');
const _ = require('lodash');

class Friends {
  static async exists(iduser, idfriend) {
    const { row, error } = await db.async.get('SELECT * FROM friends WHERE iduser = ? AND idfriend = ?', [iduser, idfriend]);
    return row && row.id;
  }
  static async create(iduser, idfriend) {
    const { lastID, changes } = await db.async.insert('INSERT OR REPLACE INTO friends (iduser, idfriend) VALUES (?,?)', [iduser, idfriend]);
    return lastID;
  }
  static async getFriends(iduser) {
    const { rows } = await db.async.all('SELECT * FROM friends WHERE iduser = ? ', [iduser]);
    return rows;
  }
  static async remove(id) {
    const { lastID, changes } = await db.async.delete('DELETE FROM friends WHERE id = ?', [id]);
    return changes;
  }
}

exports.default = Friends;
