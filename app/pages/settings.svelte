<script>
  import BlackHeaderStore from "../stores/black_header";

  function handleHeaderBlackSwitch(event) {
    if (event.value) BlackHeaderStore.set("black");
    else BlackHeaderStore.reset();
  }

  $: black_header = $BlackHeaderStore === "black";
</script>

<page>
  <actionBar title="Settings" class:black-header={black_header} />
  <scrollView>
    <stackLayout>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="title">Theme</label>
      <gridLayout columns="4*, *" rows="*" class="settings">
        <label column="0">Black Header</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          on:checkedChange={handleHeaderBlackSwitch}
          checked={black_header}
        />
      </gridLayout>
    </stackLayout>
  </scrollView>
</page>

<style>
  .black-header {
    background-color: black;
  }

  .title {
    padding: 15 0;
    font-size: 20;
    text-align: center;
    opacity: 0.4;
  }

  .settings {
    padding: 0 15;
  }

  .switch {
    margin: 0;
    padding: 0;
  }
</style>
