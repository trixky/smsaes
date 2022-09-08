<script>
  import Chat from "./chat.svelte";
  import AddContactActionItem from "../components/actionItems/add_contact.svelte";
  import { navigate } from "svelte-native";
  import { getContacts } from "../db/contact";
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

  let contacts = [];
  let pageLoaded = false;

  let readSMSPermissionGranted = false;
  let sendSMSPermissionGranted = false;
  let receiveSMSPermissionGranted = false;

  function infiniteGetReadSMSPermission() {
    if (!readSMSPermissionGranted) {
      readSMSPermissionGranted = getReadSMSPermission();
      setTimeout(() => {
        infiniteGetReadSMSPermission();
      }, 100);
    } else {
      ConversationsStore.refresh(contentResolver);
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

  function infiniteGetReceiveSMSPermission() {
    if (!receiveSMSPermissionGranted) {
      receiveSMSPermissionGranted = getReceiveSMSPermission();
      setTimeout(() => {
        infiniteGetReceiveSMSPermission();
      }, 100);
    }
  }

  infiniteGetReadSMSPermission();
  infiniteGetSendSMSPermission();
  infiniteGetReceiveSMSPermission();

  setTimeout(() => {
    pageLoaded = true;
  }, 1000);

  async function refreshContacts() {
    contacts = await getContacts();
  }

  refreshContacts();
  if (readSMSPermissionGranted) ConversationsStore.refresh(contentResolver);

  // -------------------------------------------------- LISTEN INCOMING SMS
  Application.android.registerBroadcastReceiver(
    "android.provider.Telephony.SMS_RECEIVED",
    (content, intent) => {
      receiveSMS(content, intent);
    }
  );
</script>

<page>
  {#if pageLoaded}
    {#if readSMSPermissionGranted && sendSMSPermissionGranted && receiveSMSPermissionGranted}
      <actionBar title="My App">
        <AddContactActionItem />
      </actionBar>
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
          {#each contacts as contact}
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
      <stackLayout>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>sendSMSPermissionGranted: {sendSMSPermissionGranted}</label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>readSMSPermissionGranted: {readSMSPermissionGranted}</label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>askReceiveSMSPermission: {receiveSMSPermissionGranted}</label>
        <button text="read SMS permissions" on:tap={askReadSMSPermission} />
        <button text="send SMS permissions" on:tap={askSendSMSPermission} />
        <button
          text="receive SMS permissions"
          on:tap={askReceiveSMSPermission}
        />
        <button
          text="updattte permission"
          on:tap={() => {
            readSMSPermissionGranted = getReadSMSPermission();
          }}
        />
      </stackLayout>
    {/if}
  {:else}
    <gridLayout>
      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label horizontalAlignment="center" verticalAlignment="middle"
        >loading...</label
      >
    </gridLayout>
  {/if}
</page>

<style>
  .contact-button {
    text-align: left;
    background-color: var(--main-grey-10);
    padding: 0 15;
  }

  .lastname {
    color: var(--main-grey-3);
  }
</style>
