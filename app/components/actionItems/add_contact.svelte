<script>
  import AddContact from "../../pages/new_contact.svelte";
  import { navigate } from "svelte-native";

  function addContact() {
    navigate({
      page: AddContact,
    });
  }
</script>

<actionItem
  on:tap={addContact}
  android.systemIcon="ic_menu_add"
  android.position="actionBar"
/>
