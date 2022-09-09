import { initDB, db_name } from "./global";

const theme_table_name = "theme";
const TYPE_header = "header";

async function createTableIfNotExists(db) {
  return new Promise((resolve) => {
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS " +
        theme_table_name +
        " ( \
            theme_id INTEGER PRIMARY KEY, \
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
        theme_table_name +
        " (type, value) values ((?), (?));",
      [TYPE_header, header_color],
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
}

// ---------------------------------- SET HEADER

async function set(db, value) {
  return new Promise((resolve, reject) => {
    db.execSQL(
      "UPDATE " +
        theme_table_name +
        " SET " +
        "value = (?)" +
        " WHERE " +
        "type = (?)",
      [[value], [TYPE_header]],
      function (err, result) {
        console.log("on set:");
        console.log("-- err   :", err);
        console.log("-- result:", result);
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
    const result = await set(db, value);
    return result;
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured");
    return null;
  }
}

// ---------------------------------- GET HEADER

async function get(db) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT (value) FROM " + theme_table_name + " WHERE type = (?)",
      [TYPE_header],
      function (err, result) {
        console.log("on get:");
        console.log("-- err   :", err);
        console.log("-- result:", result);
        if (err != null) return reject(err);
        resolve(result[0]);
      }
    );
  });
}

export async function getHeader() {
  const db = await initDB(db_name);
  await initTable(db);

  try {
    const value = await get(db);
    console.log("on get final:", value);

    return value;
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured");
    return null;
  }
}
