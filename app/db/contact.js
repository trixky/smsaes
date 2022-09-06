import sqlite from "nativescript-sqlite";
import { initDB } from "./global";

const db_name = "global";
const contacts_table_name = "contacts";

async function createTableIfNotExists(db) {
  return new Promise((resolve) => {
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS " +
        contacts_table_name +
        " ( \
            contact_id INTEGER PRIMARY KEY, \
            phone_number TEXT NOT NULL, \
            firstname TEXT NOT NULL, \
            lastname TEXT, \
            email TEXT \
          );",
      (err, result) => {
        resolve(err != null);
      }
    );
  });
}

// ---------------------------------- INSERT

async function insert(db, contact) {
  return new Promise((resolve, reject) => {
    db.execSQL(
      "INSERT INTO " +
        contacts_table_name +
        " (phone_number, firstname, lastname, email) values (?, ?, ?, ?);",
      [
        contact.phone_number,
        contact.firstname,
        contact.lastname,
        contact.email,
      ],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

export async function saveNewContact(contact) {
  const db = await initDB(db_name);
  await createTableIfNotExists(db, contacts_table_name);

  try {
    const id = await insert(db, contact);
    return id;
  } catch (err) {
    return null;
  }
}

// ---------------------------------- GET ALLS

async function getAll(db) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT phone_number, firstname, lastname, email FROM " +
        contacts_table_name +
        ";",
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

export async function getContacts() {
  const db = await initDB(db_name);

  await createTableIfNotExists(db, contacts_table_name);

  try {
    const contacts = await getAll(db);
    return contacts.map((contact) => ({
      phone_number: contact[0],
      firstname: contact[1],
      lastname: contact[2],
      email: contact[3],
    }));
  } catch (err) {
    return [];
  }
}
