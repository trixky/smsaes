<script lang="typescript">
  import GoldHeaderStore from "../stores/gold_header";
  let message: string = "Blank Svelte Native App";

  $: gold_header = $GoldHeaderStore === "gold";
</script>

<page>
  <actionBar title="Svelte Native App" class:gold-header={gold_header} />
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
  .gold-header {
    background-color: rgb(255, 245, 99);
    color: black;
  }

  .info .fas {
    color: #3a53ff;
  }
  .info {
    font-size: 20;
  }
</style>
