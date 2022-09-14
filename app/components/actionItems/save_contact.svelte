<script>
  import { goBack } from "svelte-native";
  import ContactsStore from "../../stores/contacts";
  import MasterPasswordStore from "../../stores/masterPassword";

  import * as inputChecker from "../../utils/input_checker";

  export let contact;

  export let phone_number_error = false;
  export let firstname_error = false;
  export let aes_key_error = false;

  function checkPhoneNumber() {
    const error = inputChecker.checkPhoneNumber(contact.phone_number);

    if (error != null) {
      alert(error.message);
      phone_number_error = true;
      return true;
    }
    return false;
  }

  function checkFirstname() {
    const error = inputChecker.checkFirstname(contact.firstname);

    if (error != null) {
      alert(error.message);
      firstname_error = true;
      return true;
    }
    return false;
  }

  function checkAesKey() {
    const error = inputChecker.checkAesKey(contact.aes_key);

    if (error != null) {
      alert(error.message);
      aes_key_error = true;
      return true;
    }
    return false;
  }

  async function addContact() {
    const temp_aes_key_error = checkAesKey();
    const temp_firstname_error = checkFirstname();
    const temp_phone_number_error = checkPhoneNumber();

    if (temp_phone_number_error || temp_firstname_error || temp_aes_key_error)
      return;

    if (
      (await ContactsStore.addContact(
        {
          phone_number: contact.phone_number,
          firstname: contact.firstname,
          lastname: contact.lastname,
          email: contact.email,
          note: contact.note,
          aes_key: contact.aes_key,
          encryption_activated: contact.encryption_activated,
        },
        $MasterPasswordStore
      )) != null
    )
      goBack();
  }
</script>

<actionItem
  on:tap={addContact}
  android.systemIcon="ic_menu_save"
  android.position="actionBar"
/>
