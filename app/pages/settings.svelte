<script>
  import BlackHeaderStore from "../stores/black_header";
  import LocalesStore from "../stores/locales";
  import locales from "../locales/global";

  $: black_header = $BlackHeaderStore === "black";

  function handleHeaderBlackSwitch(event) {
    if (event.value) BlackHeaderStore.set("black");
    else BlackHeaderStore.reset();
  }

  function handleHeaderLocalesSwitch(event, locale) {
    event.object = undefined;

    console.log(event);
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
    class:black-header={black_header}
  />
  <scrollView>
    <stackLayout>
      <!--  ========================== THEME -->
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="title">Theme</label>
      <!--  ------------------ BLACK HEADER -->
      <gridLayout columns="4*, *" rows="*" class="settings switch-container">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label column="0">Black Header</label>
        <switch
          class="switch"
          column="1"
          horizontalAlignment="center"
          on:checkedChange={handleHeaderBlackSwitch}
          checked={black_header}
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

  .switch-container {
    margin: 5 0;
  }

  .switch {
    margin: 0;
    padding: 0;
  }
</style>
