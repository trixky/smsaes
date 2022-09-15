import locales from "./global";

export default {
  is: locales.FR,
  masterPassword: {
    title: "Mot de passe maître",
    description:
      "Le mot de passe maître est requis à chaque démarrage de l'application. Il permet de déchiffrer les différentes clés AES de vos contacts, afin de ne pas les stocker en clair dans votre téléphone.",
    warning:
      "Ce mot de passe est irrécupérable. En cas d'oubli, vous devrez réinitialiser l'application: toutes vos clés AES et conversations cryptées seront détruites.",
    start: "Démarrer",
    reset: "Reset",
    permissionsError: "Toutes les permissions doivent être autorisées.",
    badMasterPassword: "Mauvais mot de passe maître.",
    isRequired: "Le mot de passe est requis pour démarrer.",
  },
  beforeStarting: {
    title: "Avant de commencer",
  },
  decryption: {
    title: "Déchiffrage",
    resetConfirmation:
      "Etes vous sûr de vouloir réinitialiser l'application ? Toutes vos clés AES et conversations cryptées seront détruites!",
  },
  contacts: {
    title: "Contacts",
    noContacts: "Aucun contact",
    alertAesDisabled: "L'encryption AES est désactivée pour ce contact.",
  },
  contactDetail: {
    detailTitle: "Detail du contact",
    newTitle: "Nouveau contact",
    updateTitle: "Mettre à jour le contact",
    subTitles: {
      informations: "Informations",
      encryption: "Chiffrement",
    },
    inputs: {
      phoneNumber: "Numéro de téléphone",
      firstname: "Prénom",
      lastname: "Nom de famille",
      email: "Email",
      note: "Note",
      aesKey: "Clé AES",
    },
  },
  settings: {
    actionBar: "Paramètres",
  },
  permissions: {
    demand: "Veuillez autoriser les permissions suivante.",
    smsReadingButton: "lecture de sms",
    smsSendingButton: "envoi de sms",
    smsReceivingButton: "réception de sms",
  },
  chat: {
    sendNotEncryptedMessageConfirmation:
      "L'encryptage n'est pas actif ! êtes-vous sûr de vouloir envoyer ce message ?",
    messageCopied: "copié",
    contactDeleted: "Le contact à ete supprimé.",
    messageTextHint: "Message",
  },
};
