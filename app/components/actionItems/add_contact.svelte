<script>
  import AddContact from "../../pages/contact.svelte";
  import { navigate } from "svelte-native";

  function addContact() {
    navigate({
      props: { update_contact: null },
      page: AddContact,
    });
  }
</script>

<actionItem
  on:tap={addContact}
  android.systemIcon="ic_menu_add"
  android.position="actionBar"
/>
