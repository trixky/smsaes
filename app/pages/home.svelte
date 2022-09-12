<script>
  import BlackHeaderStore from "../stores/black_header";
  import LocalesStore from "../stores/locales";
  import ContactsStore from "../stores/contacts";
  import LaunchedStore from "../stores/lauched";
  import KeepDateStore from "../stores/keep_date";

  import Chat from "./chat.svelte";
  import AddContactActionItem from "../components/actionItems/add_contact.svelte";
  import SettingsActionItem from "../components/actionItems/settings.svelte";
  import { navigate } from "svelte-native";
  import {
    getReadSMSPermission,
    askReadSMSPermission,
    getSendSMSPermission,
    askSendSMSPermission,
    getReceiveSMSPermission,
    askReceiveSMSPermission,
  } from "../api/permissions";
  import * as app from "@nativescript/core/application";
  import ConversationsStore from "../stores/conversations";
  import { Application } from "@nativescript/core";
  import { receiveSMS } from "../api/receive_sms";

  const contentResolver = app.android.nativeApp.getContentResolver();

  let pageLoaded = false;

  let readSMSPermissionGranted = false;
  let sendSMSPermissionGranted = false;
  let receiveSMSPermissionGranted = false;

  let AllPermissionsGranted = false;

  $: AllPermissionsGranted =
    readSMSPermissionGranted &&
    sendSMSPermissionGranted &&
    receiveSMSPermissionGranted;

  BlackHeaderStore.refresh();
  LocalesStore.refresh();

  $: black_header = $BlackHeaderStore === "black";

  function infiniteGetReadSMSPermission(no_action = false) {
    if (!readSMSPermissionGranted) {
      readSMSPermissionGranted = getReadSMSPermission();
      setTimeout(() => {
        infiniteGetReadSMSPermission();
      }, 100);
    } else if (!no_action) {
      ConversationsStore.init(contentResolver);
    }
  }

  function infiniteGetSendSMSPermission() {
    if (!sendSMSPermissionGranted) {
      sendSMSPermissionGranted = getSendSMSPermission();
      setTimeout(() => {
        infiniteGetSendSMSPermission();
      }, 100);
    }
  }

  function infiniteGetReceiveSMSPermission(no_action = false) {
    if (!receiveSMSPermissionGranted) {
      receiveSMSPermissionGranted = getReceiveSMSPermission();
      setTimeout(() => {
        infiniteGetReceiveSMSPermission();
      }, 100);
    } else if (!no_action) {
      // -------------------------------------------------- LISTEN INCOMING SMS
      Application.android.registerBroadcastReceiver(
        "android.provider.Telephony.SMS_RECEIVED",
        (content, intent) => {
          receiveSMS(content, intent);
        }
      );
    }
  }

  setTimeout(() => {
    pageLoaded = true;
  }, 1000);

  ContactsStore.getContacts();

  infiniteGetReadSMSPermission($LaunchedStore);
  infiniteGetSendSMSPermission();
  infiniteGetReceiveSMSPermission($LaunchedStore);
  $: !$KeepDateStore && AllPermissionsGranted ? KeepDateStore.launch() : "";
  LaunchedStore.launch();
</script>

<page>
  <actionBar
    title={AllPermissionsGranted ? "Contacts" : "Permissions"}
    class:black-header={black_header}
  >
    {#if pageLoaded}
      <AddContactActionItem />
      <SettingsActionItem />
    {/if}
  </actionBar>
  {#if pageLoaded}
    {#if AllPermissionsGranted}
      <scrollView orientation="vertical">
        <stackLayout>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- <label>{final}</label> -->
          <!-- <button
            text="read old SMS"
            on:tap={() => {
              final = readInboxSMS(contentResolver);
            }}
          /> -->
          {#each $ContactsStore as contact}
            <button
              class="contact-button"
              on:tap={() =>
                navigate({
                  page: Chat,
                  props: { contact },
                })}
            >
              <formattedString>
                <span text={contact.firstname} />
                {#if contact.lastname.length > 0}
                  <span class="lastname" text={" " + contact.lastname} />
                {/if}
                <span text={" (" + contact.phone_number + ")"} />
              </formattedString>
            </button>
          {/each}
        </stackLayout>
      </scrollView>
    {:else}
      <stackLayout class="permission-container">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label horizontalAlignment="center" class="permission-demand"
          >{$LocalesStore.permissions.demand}</label
        >
        <button
          text={$LocalesStore.permissions.smsReadingButton}
          on:tap={askReadSMSPermission}
          class="button-permission"
          class:granted-permission={readSMSPermissionGranted}
        />
        <button
          text={$LocalesStore.permissions.smsSendingButton}
          on:tap={askSendSMSPermission}
          class="button-permission"
          class:granted-permission={sendSMSPermissionGranted}
        />
        <button
          text={$LocalesStore.permissions.smsReceivingButton}
          on:tap={askReceiveSMSPermission}
          class="button-permission"
          class:granted-permission={receiveSMSPermissionGranted}
        />
      </stackLayout>
    {/if}
  {:else}
    <activityIndicator busy={true} />
  {/if}
</page>

<style>
  .black-header {
    background-color: black;
  }

  .contact-button {
    text-align: left;
    background-color: var(--main-grey-10);
    padding: 0 15;
  }

  .lastname {
    color: var(--main-grey-3);
  }

  .permission-container {
    padding: 15;
  }

  .permission-demand {
    margin: 10 0;
  }

  .button-permission {
    background-color: var(--main-grey-10);
  }

  .granted-permission {
    background-color: green;
    text-decoration: line-through;
  }
</style>
