const sqlite3 = require('sqlite3').verbose();

const DB_NAME = './src/db/twister.db';
const create_users_table_sql = `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            login TEXT NOT NULL UNIQUE, 
            password TEXT NOT NULL, 
            firstname TEXT, 
            lastname TEXT
        )`;
const create_friends_table_sql = `CREATE TABLE IF NOT EXISTS friends (
            id INTEGER PRIMARY KEY,
            iduser INTEGER,
            idfriend INTEGER,
            FOREIGN KEY (iduser) 
                REFERENCES users (id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION,
            FOREIGN KEY (idfriend) 
                REFERENCES users (id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION
        )`;
const create_messages_table_sql = `CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY,
            iduser INTEGER,
            text TEXT, 
            date TEXT,
            FOREIGN KEY (iduser) 
                REFERENCES users (id) 
                    ON DELETE CASCADE 
                    ON UPDATE NO ACTION
        )`;
const init_users_table_sql = 'INSERT INTO users (login, password, firstname, lastname) VALUES (?,?,?,?)';
const init_users_table_params = ['admin', '1234', 'prenom', 'nom'];

const db = new sqlite3.Database(DB_NAME, error => {
  if (error) return console.log('open database error: ', error.message);
  else console.log('Open the database connection.');
});

db.run(create_users_table_sql, function (error) {
  if (error) return console.log('create_users_table_sql error: ', error.message);
});
db.run(create_friends_table_sql, function (error) {
  if (error) return console.log('create_friends_table_sql error: ', error.message);
});
db.run(create_messages_table_sql, function (error) {
  if (error) return console.log('create_messages_table_sql error: ', error.message);
});

db.async = {
  all: function (sql, params) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, function (error, rows) {
        if (error) reject(error);
        else resolve({ rows: rows });
      });
    });
  },
  run: function (sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, (error, rows) => {
        if (error) reject(error);
        else resolve({ rows: rows });
      });
    });
  },
  insert: function (sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (error) {
        if (error) reject(error);
        else resolve({ ...this });
      });
    });
  },
  get: function (sql, params) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, function (error, row) {
        if (error) reject(error);
        else resolve({ row });
      });
    });
  },
  delete: function (sql, params) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (error) {
        if (error) reject(error);
        else resolve({ ...this });
      });
    });
  },
};

module.exports = db;

/*
function close(db) {
  return new Promise(function (resolve, reject) {
    db.close(function (error) {
      if (error) reject(error);
      else resolve();
    });
  });
}

function createTable(db, sqlCreateTable, insertSql = '', insertParams = '') {
  return new Promise(function (resolve, reject) {
    db.run(sqlCreateTable, function (err) {
      if (err) resolve();
      if (!insertSql || !insertParams) resolve();
      db.run(insertSql, insertParams, function (err) {
        if (error) reject(error);
        else resolve();
      });
    });
  });
}
function open(DB_NAME) {
  return new Promise(function (resolve, reject) {
    const db = new sqlite3.Database(DB_NAME, error => {
      if (error) reject(error);
      else console.log('Open the database connection.');
    });
    resolve({ db: db });
  });
}

function init(db) {
  return new Promise(async function (resolve, reject) {
    try {
      await createTable(db, create_users_table_sql, init_users_table_sql, init_users_table_params);
      await createTable(db, create_friends_table_sql);
      await createTable(db, create_messages_table_sql);
      resolve(db);
    } catch (error) {
      reject(error);
    }
  });
}

*/

/*
db.serialize(() => {
  db.each(`SELECT id, name FROM users`, (err, row) => {
    if (err) return console.log('err: ', err.message);
    console.log(row.id + '\t' + row.name);
  });
});

function open(DB_NAME) {
  const db = new sqlite3.Database(DB_NAME, error => {
    if (error) return console.log('error: ', error.message);
    console.log('Open the database connection.');
  });
  return db;
}
db.run(create_users_table_sql, function (error) {
  if (error) return console.log('error: ', error.message);
  db.run(init_users_table_sql, init_users_table_params, function (error) {
    if (error) return console.log('error: ', error.message);
  });
});
*/
