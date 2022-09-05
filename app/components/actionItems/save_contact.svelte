<script>
  import Home from "../../pages/home.svelte";
  import { navigate } from "svelte-native";

  function addContact() {
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
