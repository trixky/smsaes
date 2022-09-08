<script>
  import AddContact from "../../pages/contact.svelte";
  import { navigate } from "svelte-native";

  export let contact;

  function toEditContact() {
    navigate({
      props: { update_contact: contact },
      page: AddContact,
    });
  }
</script>

<actionItem
  on:tap={toEditContact}
  android.systemIcon="ic_menu_edit"
  android.position="actionBar"
/>
