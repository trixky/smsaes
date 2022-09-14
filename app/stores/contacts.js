import { writable } from "svelte/store";
import {
  getContacts,
  saveNewContact,
  updateContact,
  deleteContact,
} from "../db/contact";

import { encryptMessage, decryptMessage } from "../utils/aes";

function createHeader() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    getContacts: async (master_password) => {
      const contacts = await getContacts();

      const decrypted_contacts = contacts.map((contact) => ({
        ...contact,
        aes_key: decryptMessage(contact.aes_key, master_password),
      }));

      set(decrypted_contacts);
    },
    addContact: async (contact, master_password) => {
      const encrypted_contact = {
        ...contact,
        aes_key: encryptMessage(contact.aes_key, master_password),
      };

      const result = await saveNewContact(encrypted_contact);

      if (result != null) {
        update((contacts) => {
          contacts.push(contact);
          return contacts;
        });

        return result;
      }

      return null;
    },
    updateContact: async (contact, master_password) => {
      const encrypted_contact = {
        ...contact,
        aes_key: encryptMessage(contact.aes_key, master_password),
      };

      const result = await updateContact(encrypted_contact);

      if (result != null) {
        update((contacts) => {
          return contacts.map((_contact) =>
            _contact.phone_number === contact.phone_number ? contact : _contact
          );
        });

        return result;
      }

      return null;
    },
    removeContact: async (contact) => {
      const result = await deleteContact(contact);

      if (result != null) {
        update((contacts) => {
          return contacts.filter(
            (_contact) => _contact.phone_number != contact.phone_number
          );
        });
      }

      return result;
    },
  };
}

const header = createHeader();

export default header;
