import locales from "./global";

export default {
  is: locales.EN,
  masterPassword: {
    title: "Master passwrod",
    description:
      "The master password is required each time the application is started. It allows you to decrypt the different AES keys of your contacts, so as not to store them in plain text in your phone.",
    warning:
      "This password is unrecoverable. If you forget it, you will have to reset the application: all your AES keys and encrypted conversations will be destroyed.",
    start: "Start",
    reset: "Reset",
    permissionsError: "All permissions must be allowed.",
    badMasterPassword: "Bad master password.",
    isRequired: "The master password is required to start.",
  },
  beforeStarting: {
    title: "Before starting",
  },
  decryption: {
    title: "Decryption",
    resetConfirmation:
      "Are you sure you want to reset the app? All your AES keys and encrypted conversations will be destroyed!",
  },
  contacts: {
    title: "Contacts",
    noContacts: "No contacts",
    alertAesDisabled: "AES encryption is disabled for this contact.",
  },
  contactDetail: {
    detailTitle: "Contact detail",
    newTitle: "New contact",
    updateTitle: "Update contact",
    subTitles: {
      informations: "Informations",
      encryption: "Encryption",
    },
    inputs: {
      phoneNumber: "Phone number",
      firstname: "Firstname",
      lastname: "Lastname",
      email: "Email",
      note: "Note",
      aesKey: "AES key",
    },
  },
  settings: {
    actionBar: "Settings",
  },
  permissions: {
    subTitle: "Permissions",
    demand: "Please allow the following permissions.",
    smsReadingButton: "sms reading",
    smsSendingButton: "sms sending",
    smsReceivingButton: "sms receiving",
    allMustBeAllowed: "All permissions must be allowed.",
  },
  chat: {
    sendNotEncryptedMessageConfirmation:
      "Encryption is not active! Are you sure you want to send this message?",
    messageCopied: "copied",
    contactDeleted: "The contact has been deleted.",
    messageTextHint: "Message text",
  },
};
