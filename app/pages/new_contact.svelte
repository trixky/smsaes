<script lang="typescript">
  import SaveContactActionItem from "../components/actionItems/save_contact.svelte";

  const initial_phone_number = "+";

  let phone_number = initial_phone_number;
  let firstname = "";
  let lastname = "";
  let email = "";
  let favorite = false;

  function handleBlurPhoneNumber() {
    let filtered_phone_number = "";
    for (var i = 0; i < phone_number.length; i++) {
      if (
        ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
          phone_number.charAt(i)
        )
      )
        filtered_phone_number += phone_number.charAt(i);
    }
    phone_number = initial_phone_number + filtered_phone_number;
  }
</script>

<page>
  <actionBar title="New contact">
    <SaveContactActionItem />
  </actionBar>
  <scrollView orientation="vertical">
    <stackLayout class="body">
      <label class="title">Informations</label>
      <label class="input-label">
        <formattedString>
          <span>Phone number</span>
          <span class="star" text=" *" />
        </formattedString></label
      >
      <textField
        class="input-field"
        bind:text={phone_number}
        on:blur={handleBlurPhoneNumber}
        maxLength={20}
        keyboardType="phone"
      />
      <label class="input-label">
        <formattedString>
          <span>Firstname</span>
          <span class="star" text=" *" />
        </formattedString></label
      >
      <textField class="input-field" bind:text={firstname} maxLength={20} />
      <label class="input-label">Lastname</label>
      <textField class="input-field" bind:text={lastname} maxLength={20} />
      <label class="input-label">Email</label>
      <textField
        class="input-field"
        bind:text={email}
        maxLength={50}
        keyboardType="email"
      />
      <label class="title">Encryption</label>
    </stackLayout>
  </scrollView>
</page>

<style>
  .body {
    padding-top: 5;
  }

  .input-label {
    padding-left: 20;
  }

  .input-field {
    margin-top: 0;
    margin-bottom: 15;
    padding-left: 5;
  }

  .title {
    padding: 15 0;
    font-size: 20;
    text-align: center;
    opacity: 0.4;
  }

  .star {
    color: var(--main-blue-1);
  }
</style>
