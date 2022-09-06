<script>
  import { goBack } from "svelte-native";
</script>

<navigationButton
  text="Go back"
  android.systemIcon="ic_menu_back"
  on:tap={goBack}
/>
