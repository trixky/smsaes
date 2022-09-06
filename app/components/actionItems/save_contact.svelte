<script>
  import Home from "../../pages/home.svelte";
  import { navigate } from "svelte-native";
  import { saveNewContact } from "../../db/contact";
  import * as inputChecker from "../../utils/input_checker";

  export let phone_number;
  export let firstname;
  export let lastname = "";
  export let email = "";

  export let phone_number_error = false;
  export let firstname_error = false;

  function checkPhoneNumber() {
    const error = inputChecker.checkPhoneNumber(phone_number);

    if (error != null) {
      alert(error.message);
      phone_number_error = true;
      return true;
    }
    return false;
  }

  function checkFirstname() {
    const error = inputChecker.checkFirstname(firstname);

    if (error != null) {
      alert(error.message);
      firstname_error = true;
      return true;
    }
    return false;
  }

  async function addContact() {
    const temp_phone_number_error = checkPhoneNumber();
    const temp_firstname_error = checkFirstname();

    if (temp_phone_number_error || temp_firstname_error) return;

    if (
      (await saveNewContact({
        phone_number,
        firstname,
        lastname,
        email,
      })) != null
    )
      navigate({
        page: Home,
      });
    else alert("An internal error occured");
  }
</script>

<actionItem
  on:tap={addContact}
  android.systemIcon="ic_menu_save"
  android.position="actionBar"
/>
