<script>
  import NewContact from "../../pages/contact.svelte";
  import { navigate } from "svelte-native";

  export let contact;
  export let not_editable = false;

  function toContact() {
    navigate({
      props: { update_contact: contact, not_editable },
      page: NewContact,
    });
  }
</script>

<actionItem
  on:tap={toContact}
  android.systemIcon="ic_menu_info_details"
  android.position="actionBar"
/>
