<script lang="typescript">
  import BlackHeaderStore from "../stores/black_header";
  let message: string = "Blank Svelte Native App";
</script>

<page>
  <actionBar title="Svelte Native App" class:black-header={$BlackHeaderStore} />
  <gridLayout>
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label
      class="info"
      horizontalAlignment="center"
      verticalAlignment="middle"
      textWrap="true"
    >
      <formattedString>
        <span class="fas" text="&#xf135;" />
        <span text=" {message}" />
      </formattedString>
    </label>
  </gridLayout>
</page>

<style>
  .black-header {
    background-color: black;
  }

  .info .fas {
    color: #3a53ff;
  }
  .info {
    font-size: 20;
  }
</style>
