import locales from "./global";

export default {
  is: locales.EN,
  settings: {
    actionBar: "Settings",
  },
  permissions: {
    demand: "Please allow the following permissions before continuing.",
    smsReadingButton: "sms reading",
    smsSendingButton: "sms sending",
    smsReceivingButton: "sms receiving",
  },
  chat: {
    sendNotEncryptedMessageConfirmation:
      "Encryption is not active! Are you sure you want to send this message?",
    messageCopied: "copied",
  },
};
