import { initDB, db_name } from "./global";
import locales from "../locales/global";

const settings_table_name = "settings";

const TYPE_header = "header";
const TYPE_locales = "locales";
const TYPE_date = "date";

async function createTableIfNotExists(db) {
  return new Promise((resolve) => {
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS " +
        settings_table_name +
        " ( \
            setting_id INTEGER PRIMARY KEY, \
            type TEXT NOT NULL UNIQUE, \
            value TEXT NO NULL \
          );",
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

async function addHeader(db, header_color) {
  return new Promise((resolve) => {
    db.execSQL(
      "INSERT OR IGNORE INTO " +
        settings_table_name +
        " (type, value) values ((?), (?));",
      [TYPE_header, header_color],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

async function addLocales(db, locale) {
  return new Promise((resolve) => {
    db.execSQL(
      "INSERT OR IGNORE INTO " +
        settings_table_name +
        " (type, value) values ((?), (?));",
      [TYPE_locales, locale],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

async function addDate(db) {
  const date = Date.now().toString();

  return new Promise((resolve) => {
    db.execSQL(
      "INSERT OR IGNORE INTO " +
        settings_table_name +
        " (type, value) values ((?), (?));",
      [TYPE_date, date],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

async function initTable(db) {
  await createTableIfNotExists(db);
  await addHeader(db, "");
  await addLocales(db, locales.EN);
  await addDate(db);
}

// ---------------------------------- SET

async function set(db, value, type) {
  return new Promise((resolve, reject) => {
    db.execSQL(
      "UPDATE " +
        settings_table_name +
        " SET " +
        "value = (?)" +
        " WHERE " +
        "type = (?)",
      [[value], [type]],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

export async function setHeader(value) {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const result = await set(db, value, TYPE_header);
    return result;
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured #004");
    return null;
  }
}

export async function setLocales(value) {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const result = await set(db, value, TYPE_date);
    return result;
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured #005");
    return null;
  }
}

export async function setDate() {
  const db = await initDB(db_name);
  await initTable(db);

  const timestamp = Date.now();

  try {
    const result = await set(db, timestamp.toString(), TYPE_date);
    return result;
  } catch (err) {
    alert("An internal error occured #006");
    return null;
  }
}

// ---------------------------------- GET HEADER

async function get(db, type) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT (value) FROM " + settings_table_name + " WHERE type = (?)",
      [type],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

export async function getHeader() {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const value = await get(db, TYPE_header);

    return value[0];
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured #007");
    return null;
  }
}

export async function getLocales() {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const value = await get(db, TYPE_locales);

    return value[0];
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured #008");
    return null;
  }
}

export async function getDate() {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const value = await get(db, TYPE_date);

    return new Date(parseInt(value[0], 10));
  } catch (err) {
    alert("An internal error occured #009");
    return null;
  }
}
