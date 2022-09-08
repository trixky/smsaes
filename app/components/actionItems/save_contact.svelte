<script>
  import Home from "../../pages/home.svelte";
  import { navigate } from "svelte-native";
  import { saveNewContact } from "../../db/contact";
  import * as inputChecker from "../../utils/input_checker";

  export let contact;

  export let phone_number_error = false;
  export let firstname_error = false;

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

  async function addContact() {
    const temp_firstname_error = checkFirstname();
    const temp_phone_number_error = checkPhoneNumber();

    if (temp_phone_number_error || temp_firstname_error) return;

    if (
      (await saveNewContact({
        phone_number: contact.phone_number,
        firstname: contact.firstname,
        lastname: contact.lastname,
        email: contact.email,
        note: contact.note,
      })) != null
    )
      navigate({
        page: Home,
      });
  }
</script>

<actionItem
  on:tap={addContact}
  android.systemIcon="ic_menu_save"
  android.position="actionBar"
/>
