<script>
  import ContactsStore from "../stores/contacts";
  import BlackHeaderStore from "../stores/black_header";
  import SaveContactActionItem from "../components/actionItems/save_contact.svelte";
  import EditContactActionItem from "../components/actionItems/edit_contact.svelte";
  import DeleteContactActionItem from "../components/actionItems/delete_contact.svelte";
  import UpdateContactActionItem from "../components/actionItems/update_contact.svelte";
  import * as inputChecker from "../utils/input_checker";
  import { alert } from "@nativescript/core/ui/dialogs";
  import { goBack } from "svelte-native";

  const MODE_NEW = "new";
  const MODE_UPDATE = "update";

  export let update_contact;
  export let not_editable = false;

  const mode =
    update_contact != undefined && update_contact != null
      ? MODE_UPDATE
      : MODE_NEW;

  const initial_phone_number = "+";

  let phone_number = initial_phone_number;
  let firstname = "";
  let lastname = "";
  let email = "";
  let note = "";

  function updateContact() {
    if (mode === MODE_UPDATE) {
      const check_contact = $ContactsStore.find(
        (_contact) => _contact.phone_number === update_contact.phone_number
      );

      if (check_contact === undefined) {
        goBack();
      } else {
        phone_number = check_contact.phone_number;
        firstname = check_contact.firstname;
        lastname = check_contact.lastname;
        email = check_contact.email;
        note = check_contact.note;
      }
    }
  }

  let phone_number_error = false;
  let firstname_error = false;

  let phone_number_had_an_error = false;
  let firstname_had_an_error = false;

  $: phone_number_had_an_error =
    phone_number_error || phone_number_had_an_error;
  $: firstname_had_an_error = firstname_error || firstname_had_an_error;

  $: _phone_number_error =
    phone_number_had_an_error &&
    inputChecker.checkPhoneNumber(phone_number) != null;

  $: _firstname_error =
    firstname_had_an_error && inputChecker.checkFirstname(firstname) != null;

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

  $: contact = {
    phone_number,
    firstname,
    lastname,
    email,
    note,
  };

  $: black_header = $BlackHeaderStore === "black";

  updateContact();
  function handleNavigatedTo() {
    updateContact();
  }
</script>

<page on:navigatedTo={handleNavigatedTo}>
  <actionBar
    title={mode === MODE_UPDATE ? "Update contact" : "New contact"}
    class:black-header={black_header}
  >
    {#if not_editable}
      <DeleteContactActionItem {contact} />
      <EditContactActionItem {contact} />
    {:else if mode === MODE_NEW}
      <SaveContactActionItem
        {contact}
        bind:firstname_error
        bind:phone_number_error
      />
    {:else}
      <UpdateContactActionItem
        {contact}
        bind:firstname_error
        bind:phone_number_error
      />
    {/if}
  </actionBar>
  <scrollView orientation="vertical">
    <stackLayout class="body">
      <label class="title">Informations</label>
      <label class="input-label">
        <formattedString>
          <span>Phone number</span>
          {#if !not_editable}
            <span class="asterisk" text=" *" />
          {/if}
        </formattedString></label
      >
      <textField
        editable={!not_editable && mode === MODE_NEW}
        class:not-editable={not_editable || mode === MODE_UPDATE}
        class:error={_phone_number_error}
        class="input-field"
        bind:text={phone_number}
        on:blur={handleBlurPhoneNumber}
        maxLength={20}
        keyboardType="phone"
      />
      <label class="input-label">
        <formattedString>
          <span>Firstname</span>
          {#if !not_editable}
            <span class="asterisk" text=" *" />
          {/if}
        </formattedString></label
      >
      <textField
        editable={!not_editable}
        class:not-editable={not_editable}
        class="input-field"
        class:error={_firstname_error}
        bind:text={firstname}
        maxLength={20}
      />
      <label class="input-label">Lastname</label>
      <textField
        editable={!not_editable}
        class:not-editable={not_editable}
        class="input-field"
        bind:text={lastname}
        maxLength={20}
      />
      <label class="input-label">Email</label>
      <textField
        editable={!not_editable}
        class:not-editable={not_editable}
        class="input-field"
        bind:text={email}
        maxLength={50}
        keyboardType="email"
      />
      <label class="input-label">Note</label>

      <textView
        editable={!not_editable}
        class:not-editable={not_editable}
        class="input-field note"
        height="auto"
        maxLength={300}
        bind:text={note}
      />

      <label class="title">Encryption</label>
    </stackLayout>
  </scrollView>
</page>

<style>
  .black-header {
    background-color: black;
  }

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

  .input-field.note {
    min-height: 0;
  }

  .input-field.error {
    border-color: rgb(205, 99, 99);
  }

  .input-field.not-editable {
    opacity: 0.4;
    /* border-width: 0; */
    border-color: transparent;
  }

  .title {
    padding: 15 0;
    font-size: 20;
    text-align: center;
    opacity: 0.4;
  }

  .asterisk {
    color: var(--main-blue-1);
  }
</style>
