<script>
  import Contact from "../../pages/contact.svelte";
  import { navigate } from "svelte-native";

  export let contact;

  function toContact() {
    navigate({
      props: { contact },
      page: Contact,
    });
  }
</script>

<actionItem
  on:tap={toContact}
  android.systemIcon="ic_menu_info_details"
  android.position="actionBar"
/>
