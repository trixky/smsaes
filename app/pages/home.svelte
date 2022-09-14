<script>
  import BlackHeaderStore from "../stores/black_header";
  import LocalesStore from "../stores/locales";
  import ContactsStore from "../stores/contacts";
  import LaunchedStore from "../stores/lauched";
  import KeepDateStore from "../stores/keep_date";
  import { timestampIsItTodayToString } from "../utils/date";
  import { decryptMessage } from "../utils/aes";
  import MasterPasswordStore from "../stores/masterPassword";
  import { confirm } from "@nativescript/core/ui/dialogs";

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
  import { checkAesKey } from "../utils/input_checker";
  import {
    getEncryptedMasterPassword,
    checkMasterPassword,
    setMasterPassword,
    reset as resetSettings,
  } from "../db/settings";
  import { reset as resetContacts } from "../db/contact";

  const contentResolver = app.android.nativeApp.getContentResolver();

  let saved_encryptedMasterPassword = undefined;

  async function loadSavedEncryptedMasterPassword() {
    saved_encryptedMasterPassword = await getEncryptedMasterPassword();
  }
  loadSavedEncryptedMasterPassword();

  let saved_encryptedMasterPassword_is_loaded = false;
  $: saved_encryptedMasterPassword_is_loaded =
    saved_encryptedMasterPassword != null &&
    saved_encryptedMasterPassword != undefined;

  let saved_encryptedMasterPassword_is_defined = false;
  $: saved_encryptedMasterPassword_is_defined =
    saved_encryptedMasterPassword_is_loaded &&
    saved_encryptedMasterPassword != "";

  let chatLoaded = true;

  let pageLoaded = false;
  let pageFullLoadedd = false;

  $: pageFullLoadedd = pageLoaded && saved_encryptedMasterPassword_is_loaded;

  let masterPassword = "";

  let retrieve_masterPassword = "";

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

  async function checkBeforeStart() {
    const masterPassword_error = checkAesKey(masterPassword, true);
    if (masterPassword_error != null) {
      alert(masterPassword_error.message);
    }

    const AllPermissionsGranted_error = !AllPermissionsGranted;

    if (AllPermissionsGranted_error) {
      alert($LocalesStore.permissions.allMustBeAllowed);
    }

    if (!masterPassword_error && !AllPermissionsGranted_error) {
      await setMasterPassword(masterPassword);
      saved_encryptedMasterPassword = await getEncryptedMasterPassword();
      AppIsStarted = true;
    }
  }

  async function retrieveBeforeStart() {
    if (retrieve_masterPassword.length > 0) {
      if (await checkMasterPassword(retrieve_masterPassword)) {
        MasterPasswordStore.set(retrieve_masterPassword);
      } else {
        alert($LocalesStore.masterPassword.badMasterPassword);
      }
    } else {
      alert($LocalesStore.masterPassword.isRequired);
    }
  }

  async function handleReset() {
    if (await confirm($LocalesStore.decryption.resetConfirmation)) {
      await resetContacts();
      await resetSettings();

      saved_encryptedMasterPassword = "";
    }
  }
</script>

<page>
  <actionBar
    title={saved_encryptedMasterPassword_is_defined
      ? $MasterPasswordStore
        ? $LocalesStore.contacts.title
        : $LocalesStore.decryption.title
      : $LocalesStore.beforeStarting.title}
    class="header"
    class:gold-header={black_header}
  >
    {#if saved_encryptedMasterPassword_is_defined}
      <AddContactActionItem />
      <SettingsActionItem />
    {/if}
  </actionBar>
  {#if pageFullLoadedd && chatLoaded}
    {#if saved_encryptedMasterPassword_is_defined}
      <scrollView orientation="vertical">
        {#if $MasterPasswordStore != null}
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
        {:else}
          <dockLayout>
            <stackLayout dock="top">
              <label class="input-label">
                <formattedString>
                  <span>{$LocalesStore.masterPassword.title}</span>
                  <span class="asterisk" text=" *" />
                </formattedString></label
              >
              <textField
                class:error={false}
                class="input-field"
                maxLength={16}
                bind:text={retrieve_masterPassword}
              />
              <textView
                horizontalAlignment="center"
                textWrap="true"
                editable={false}
                class="master-password-text"
                >{$LocalesStore.masterPassword.description}</textView
              >

              <button
                text={$LocalesStore.masterPassword.start}
                on:tap={retrieveBeforeStart}
                class="before-start-button"
              />
            </stackLayout>
            <stackLayout dock="center" />
            <stackLayout dock="bottom" class="invert">
              <stackLayout class="invert">
                <textView
                  horizontalAlignment="center"
                  textWrap="true"
                  editable={false}
                  class="master-password-text warning"
                  >{$LocalesStore.masterPassword.warning}</textView
                >
                <button
                  text={$LocalesStore.masterPassword.reset}
                  on:tap={handleReset}
                  class="before-start-button dangerous"
                />
              </stackLayout>
            </stackLayout>
          </dockLayout>
        {/if}
      </scrollView>
    {:else}
      <scrollView orientation="vertical">
        <stackLayout class="permission-container">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="start-title">Permissions</label>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label horizontalAlignment="center" class="start-label"
            >{$LocalesStore.permissions.demand}</label
          >
          <button
            text={$LocalesStore.permissions.smsReadingButton}
            on:tap={askReadSMSPermission}
            class="before-start-button"
            class:granted-permission={readSMSPermissionGranted}
          />
          <button
            text={$LocalesStore.permissions.smsSendingButton}
            on:tap={askSendSMSPermission}
            class="before-start-button"
            class:granted-permission={sendSMSPermissionGranted}
          />
          <button
            text={$LocalesStore.permissions.smsReceivingButton}
            on:tap={askReceiveSMSPermission}
            class="before-start-button"
            class:granted-permission={receiveSMSPermissionGranted}
          />
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="start-title">{$LocalesStore.masterPassword.title}</label
          >
          <textField
            class:error={false}
            class="input-field"
            maxLength={16}
            bind:text={masterPassword}
          />
          <textView
            horizontalAlignment="center"
            textWrap="true"
            editable={false}
            class="master-password-text"
            >{$LocalesStore.masterPassword.description}</textView
          >
          <textView
            horizontalAlignment="center"
            textWrap="true"
            editable={false}
            class="master-password-text warning"
            >{$LocalesStore.masterPassword.warning}</textView
          >
          <button
            text={$LocalesStore.masterPassword.start}
            on:tap={checkBeforeStart}
            class="before-start-button"
          />
        </stackLayout>
      </scrollView>
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

  .start-label {
    margin: 10 0;
  }

  .before-start-button {
    background-color: var(--main-grey-10);
  }

  .before-start-button.dangerous {
    background-color: var(--main-red-10);
  }

  .granted-permission {
    background-color: green;
    text-decoration: line-through;
  }

  .no-contact {
    margin-top: 30;
    color: var(--main-grey-5);
  }

  .start-title {
    padding: 15 0;
    font-size: 20;
    text-align: center;
    opacity: 0.4;
  }

  .input-field {
    margin-top: 0;
    margin-bottom: 15;
    padding-left: 5;
  }

  .master-password-text {
    text-align: center;
    min-height: 0;
  }

  .master-password-text.warning {
    color: var(--main-red-5);
  }

  .input-label {
    padding-left: 20;
  }

  .asterisk {
    color: var(--main-grey-3);
  }

  .invert {
    transform: rotate(180deg);
  }
</style>
