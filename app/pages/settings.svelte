<script>
  import GoldHeaderStore from "../stores/gold_header";
  import LocalesStore from "../stores/locales";
  import locales from "../locales/global";

  $: gold_header = $GoldHeaderStore === "gold";

  function handleHeaderGoldSwitch(event) {
    if (event.value) GoldHeaderStore.set("gold");
    else GoldHeaderStore.reset();
  }

  function handleHeaderLocalesSwitch(event, locale) {
    event.object = undefined;

    switch (locale) {
      case locales.EN:
        if (event.value) LocalesStore.switchToEnglish();
        else LocalesStore.switchToFR();
        break;
      case locales.FR:
        if (event.value) LocalesStore.switchToFR();
        else LocalesStore.switchToEnglish();
        break;
    }
  }
</script>

<page>
  <actionBar
    title={$LocalesStore.settings.actionBar}
    class:gold-header={gold_header}
  />
  <scrollView>
    <stackLayout>
      <!--  ========================== THEME -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="title">Theme</label>
      <!--  ------------------ GOLD HEADER -->
      <gridLayout columns="4*, *" rows="*" class="settings switch-container">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label column="0">Gold Header</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          on:checkedChange={handleHeaderGoldSwitch}
          checked={gold_header}
        />
      </gridLayout>
      <!--  ========================== LOCAES -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="title">Locales</label>
      <!--  ------------------ LOCALES EN -->
      <gridLayout columns="4*, *" rows="*" class="settings switch-container">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label column="0">EN</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          on:checkedChange={(event) =>
            handleHeaderLocalesSwitch(event, locales.EN)}
          checked={$LocalesStore.is === locales.EN}
        />
      </gridLayout>
      <!--  ------------------ LOCALES FR -->
      <gridLayout columns="4*, *" rows="*" class="settings switch-container">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label column="0">FR</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          on:checkedChange={(event) =>
            handleHeaderLocalesSwitch(event, locales.FR)}
          checked={$LocalesStore.is === locales.FR}
        />
      </gridLayout>
    </stackLayout>
  </scrollView>
</page>

<style>
  .gold-header {
    background-color: rgb(255, 245, 99);
    color: black;
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

  .switch-container {
    margin: 5 0;
  }

  .switch {
    margin: 0;
    padding: 0;
  }
</style>
