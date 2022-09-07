import { writable } from "svelte/store";
import { readInboxSMS } from "../api/read_sms";

function createMessages() {
  const { subscribe, set, update } = writable({});

  return {
    subscribe,
    refresh: (contentResolver) => {
      const conversations = {};
      const messages = readInboxSMS(contentResolver);
      messages.forEach((message) => {
        const message_address = message.address;

        if (!conversations.hasOwnProperty(message_address))
          conversations[message_address] = [message];
        else conversations[message_address].push(message);
      });
      set(conversations);
    },
    reset: () => set([]),
  };
}

const messages = createMessages();

export default messages;
