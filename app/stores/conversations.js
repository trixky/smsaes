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
    addMessage: (message) => {
      update((conversations) => {
        if (conversations[message.address] != undefined)
          conversations[message.address].push(message);
        else conversations[message.address] = [message];
        return conversations;
      });
    },
    updateSendedMessageIntent: (message, intent) => {
      update((conversations) => {
        const new_conversations = { ...conversations };

        new_conversations[message.address].find(
          (_message) =>
            _message.date === message.date && _message.local != undefined
        ).local.intent = intent;

        return new_conversations;
      });
    },
    addConversation: (address) => {
      update((conversations) => {
        if (conversations[message.address] != undefined)
          conversations[address] = [];
        return conversations;
      });
    },
    reset: () => set([]),
  };
}

const messages = createMessages();

export default messages;
