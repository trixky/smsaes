import sqlite from "nativescript-sqlite";

export const db_name = "global5";

export function existsAnOpen(db, db_name) {
  if (!sqlite.exists(db_name)) {
    console.log("error: db [" + db_name + "] doesn't exist");
    return false;
  }

  if (!db.isOpen()) {
    console.log("error: db [" + db_name + "] is closed");
    return false;
  }

  return true;
}

export async function initDB(db_name) {
  const db = await sqlite(db_name);

  if (!existsAnOpen(db, db_name)) return null;

  return db;
}
