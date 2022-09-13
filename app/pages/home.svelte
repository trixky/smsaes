<script>
  import BlackHeaderStore from "../stores/black_header";
  import LocalesStore from "../stores/locales";
  import ContactsStore from "../stores/contacts";
  import LaunchedStore from "../stores/lauched";
  import KeepDateStore from "../stores/keep_date";
  import { timestampIsItTodayToString } from "../utils/date";
  import { decryptMessage } from "../utils/aes";

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
  import Config from "../config";

  const contentResolver = app.android.nativeApp.getContentResolver();

  let pageLoaded = false;
  let chatLoaded = true;

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

  function infiniteGetContacts(no_action = false) {
    ContactsStore.getContacts();
    if (!no_action)
      setTimeout(() => {
        infiniteGetContacts(no_action);
      }, 500);
  }

  function infiniteGetReadSMSPermission(no_action = false) {
    if (!readSMSPermissionGranted) {
      readSMSPermissionGranted = getReadSMSPermission();
      setTimeout(() => {
        infiniteGetReadSMSPermission(no_action);
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
        infiniteGetReceiveSMSPermission(no_action);
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

  function getLastMessage(contact) {
    return $ConversationsStore.hasOwnProperty(contact.phone_number)
      ? $ConversationsStore[contact.phone_number][
          $ConversationsStore[contact.phone_number].length - 1
        ].body
      : "";
  }

  function getLastMessageDate(contact) {
    return $ConversationsStore.hasOwnProperty(contact.phone_number)
      ? $ConversationsStore[contact.phone_number][
          $ConversationsStore[contact.phone_number].length - 1
        ].date
      : null;
  }

  function getLastMessageDateString(contact) {
    const last_message_date = getLastMessageDate(contact);

    return last_message_date === null
      ? ""
      : timestampIsItTodayToString(last_message_date);
  }

  setTimeout(() => {
    pageLoaded = true;
  }, 1000);

  let sorted_contacts = [];
  $: sorted_contacts = $ContactsStore.sort((a, b) => {
    const last_a_message_date = getLastMessageDate(a);
    const last_b_message_date = getLastMessageDate(b);

    if (last_a_message_date === null && last_b_message_date != null) return 1;
    if (last_b_message_date === null && last_a_message_date != null) return -1;
    return last_a_message_date > last_b_message_date ? -1 : 1;
  });

  infiniteGetContacts($LaunchedStore);

  infiniteGetReadSMSPermission($LaunchedStore);
  infiniteGetSendSMSPermission();
  infiniteGetReceiveSMSPermission($LaunchedStore);

  $: !$KeepDateStore && AllPermissionsGranted ? KeepDateStore.launch() : "";
  LaunchedStore.launch();

  function isAesMessage(message) {
    const ret = message.startsWith(Config.aes.header);
    return ret;
  }

  function decryptAesMessage(message, aes_key, with_label = false) {
    if (isAesMessage(message)) {
      const encrypted_body = message.slice(Config.aes.header.length);

      const descrypted_body = decryptMessage(encrypted_body, aes_key);
      return (with_label ? Config.aes.header : "") + descrypted_body;
    }
    return message;
  }
</script>

<page>
  <actionBar
    title={AllPermissionsGranted ? "Contacts" : "Permissions"}
    class="header"
    class:gold-header={black_header}
  >
    {#if pageLoaded}
      <AddContactActionItem />
      <SettingsActionItem />
    {/if}
  </actionBar>
  {#if pageLoaded && chatLoaded}
    {#if AllPermissionsGranted}
      <scrollView orientation="vertical">
        <stackLayout class="messages">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <!-- <label>{final}</label> -->
          <!-- <button
            text="read old SMS"
            on:tap={() => {
              final = readInboxSMS(contentResolver);
            }}
          /> -->
          {#if sorted_contacts.length > 0}
            {#each sorted_contacts as contact}
              <stackLayout
                class="contact"
                on:tap={() => {
                  chatLoaded = false;
                  navigate({
                    page: Chat,
                    props: { contact },
                  });
                  setTimeout(() => {
                    setTimeout(() => {
                      chatLoaded = true;
                    }, 200);
                  }, 50);
                }}
              >
                <gridLayout columns="2*, *" rows="auto">
                  <label column="0" horizontalAlignment="left">
                    <formattedString>
                      <span text={contact.firstname} />
                      {#if contact.lastname.length > 0}
                        <span text={" " + contact.lastname} />
                      {/if}
                      <span text={" (" + contact.phone_number + ")"} />
                    </formattedString>
                  </label>
                  <label
                    column="1"
                    horizontalAlignment="right"
                    class="last-message-date"
                    >{getLastMessageDateString(contact)}</label
                  >
                </gridLayout>
                <label class="last-message">
                  <formattedString>
                    {#if isAesMessage(getLastMessage(contact))}
                      <span class="aes-header">{Config.aes.header}</span>
                    {/if}
                    <span
                      >{decryptAesMessage(
                        getLastMessage(contact),
                        contact.aes_key
                      )}</span
                    >
                  </formattedString>
                </label>
              </stackLayout>
            {/each}
          {:else}
            <label class="no-contact" horizontalAlignment={"center"}
              >{$LocalesStore.contacts.noContacts}</label
            >
          {/if}
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
  .header {
    background-color: black;
  }

  .gold-header {
    background-color: rgb(255, 245, 99);
    color: black;
  }

  .messages {
    padding: 10 0;
  }

  .contact {
    text-align: left;
    border-left-width: 2;
    border-color: var(--main-grey-10);
    padding: 10 15;
    margin: 10 15;
  }

  .last-message {
    margin-top: 4;
    color: var(--main-grey-3);
  }

  .aes-header {
    color: var(--main-blue-0);
    font-style: italic;
  }

  .last-message-date {
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

  .no-contact {
    margin-top: 30;
    color: var(--main-grey-5);
  }
</style>
