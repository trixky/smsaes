import sqlite from "nativescript-sqlite";
import { initDB } from "./global";

const db_name = "global3";
const contacts_table_name = "contacts";

async function createTableIfNotExists(db) {
  return new Promise((resolve) => {
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS " +
        contacts_table_name +
        " ( \
            contact_id INTEGER PRIMARY KEY, \
            phone_number TEXT NOT NULL UNIQUE, \
            firstname TEXT NOT NULL, \
            lastname TEXT, \
            email TEXT, \
            note TEXT \
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
        " (phone_number, firstname, lastname, email, note) values (?, ?, ?, ?, ?);",
      [
        contact.phone_number,
        contact.firstname,
        contact.lastname,
        contact.email,
        contact.note,
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
    console.log("error: db >", err);
    if (err.message.includes("UNIQUE")) alert("Phone number already used");
    else alert("An internal error occured");
    return null;
  }
}

// ---------------------------------- UPDATE

async function update(db, contact) {
  return new Promise((resolve, reject) => {
    db.execSQL(
      "UPDATE " +
        contacts_table_name +
        " SET " +
        "phone_number = (?), firstname = (?), lastname = (?), email = (?), note = (?)" +
        " WHERE " +
        "phone_number = (?)",
      [
        [contact.phone_number],
        [contact.firstname],
        [contact.lastname],
        [contact.email],
        [contact.note],
        [contact.phone_number],
      ],
      function (err, result) {
        if (err != null) return reject(err);
        resolve(result);
      }
    );
  });
}

export async function updateContact(contact) {
  const db = await initDB(db_name);
  await createTableIfNotExists(db, contacts_table_name);

  try {
    const id = await update(db, contact);
    return id;
  } catch (err) {
    console.log("error: db >", err);
    alert("An internal error occured");
    return null;
  }
}

// ---------------------------------- GET ALLS

async function getAll(db) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT phone_number, firstname, lastname, email, note FROM " +
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
      note: contact[4],
    }));
  } catch (err) {
    return [];
  }
}
