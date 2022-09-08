<script>
  import Settings from "../../pages/settings.svelte";
  import { navigate } from "svelte-native";

  function toSettings() {
    navigate({
      page: Settings,
    });
  }
</script>

<actionItem
  on:tap={toSettings}
  android.systemIcon="ic_menu_preferences"
  android.position="actionBar"
/>
