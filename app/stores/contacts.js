import { writable } from "svelte/store";
import {
  getContacts,
  saveNewContact,
  updateContact,
  deleteContact,
} from "../db/contact";

function createHeader() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    getContacts: async () => {
      const contacts = await getContacts();

      set(contacts);
    },
    addContact: async (contact) => {
      const result = await saveNewContact(contact);

      if (result != null) {
        update((contacts) => {
          contacts.push(contact);
          return contacts;
        });

        return result;
      }

      return null;
    },
    updateContact: async (contact) => {
      const result = await updateContact(contact);

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
