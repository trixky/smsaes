<script>
  import BlackHeaderStore from "../stores/black_header";
</script>

<page>
  <actionBar title="Settings" class:black-header={$BlackHeaderStore} />
  <scrollView>
    <stackLayout>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="title">Informations</label>
      <gridLayout columns="4*, *" rows="*" class="settings">
        <label column="0">Black Header</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          bind:checked={$BlackHeaderStore}
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
