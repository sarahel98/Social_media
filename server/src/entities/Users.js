const db = require('../db/database');
const _ = require('lodash');

class Users {
  static async exists(login) {
    const { row, error } = await db.async.get('SELECT * FROM users WHERE login = ?', [login]);
    return row;
  }
  
  static async create(login, password, lastname, firstname) {
    const { lastID, changes } = await db.async.insert('INSERT INTO users (login, password, firstname, lastname) VALUES (?,?,?,?)', [
      login,
      password,
      firstname,
      lastname,
    ]);
    return lastID;
  }
  static async get(id) {
    const { row, error } = await db.async.get('SELECT * FROM users WHERE id = ?', [id]);
    return row;
  }
  static async getMdp(login) {
    const { row, error } = await db.async.get('SELECT password FROM users WHERE login = ?', [login]);
    return row;
  }

  static async getALL() {
    const { rows } = await db.async.all('SELECT * FROM users ', []);
    return rows;
  }
  static async login(login, password) {
    const { row, error } = await db.async.get('SELECT * FROM users WHERE login = ?', [login]);
    if (_.isEmpty(row)) {
      return false;
    }
    if (row.password !== password) {
      return false;
    }
    return row.id;
  }
  static async delete(login, password) {
    const { row, error } = await db.async.delete('DELETE from users WHERE login = ? AND password = ?', [login, password]);
}
static async changePwd(login, password, newPassword){
  const { row, error } = await db.async.get('UPDATE users SET password = ? WHERE login = ? and password = ?', [newPassword, login, password]);
  return true;
  }
  static async addFirstLast(login, password, firstname, lastname){
    const { row, error } = await db.async.get('UPDATE users SET firstname = ?, lastname = ? WHERE login = ? and password = ?', [firstname, lastname, login, password]);
    return row;
  }
}

exports.default = Users;
