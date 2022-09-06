<script>
  import Contact from "./contact.svelte";
  import AddContactActionItem from "../components/actionItems/add_contact.svelte";
  import { navigate } from "svelte-native";
  import { getContacts } from "../db/contact";
  import {
    getReadSMSPermission,
    askReadSMSPermission,
  } from "../api/permissions";
  import { readOldSMS } from "../api/read_sms";
  import * as app from "@nativescript/core/application";

  const contentResolver = app.android.nativeApp.getContentResolver();

  let final = 0;
  let readSMSPermissionGranted = false;
  let pageLoaded = false;

  let contacts = [];

  function infiniteGetReadSMSPermission() {
    if (!readSMSPermissionGranted) {
      readSMSPermissionGranted = getReadSMSPermission();
      setTimeout(() => {
        infiniteGetReadSMSPermission();
      }, 100);
    }
  }

  infiniteGetReadSMSPermission();

  setTimeout(() => {
    pageLoaded = true;
  }, 1000);

  async function refreshContacts() {
    contacts = await getContacts();
  }

  refreshContacts();
</script>

<page>
  {#if pageLoaded}
    {#if readSMSPermissionGranted}
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
              final = readOldSMS(contentResolver);
            }}
          /> -->
          {#each contacts as contact}
            <button
              class="contact-button"
              on:tap={() =>
                navigate({
                  page: Contact,
                  props: { contact },
                })}
            >
              <formattedString>
                <span text={contact.firstname} class="contact-label" />
                <span text={" " + contact.phone_number} />
              </formattedString>
            </button>
          {/each}
        </stackLayout>
      </scrollView>
    {:else}
      <stackLayout>
        <button text="read SMS permissions" on:tap={askReadSMSPermission} />
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

  .contact-label {
    text-decoration: underline;
    padding-right: 30px;
  }
</style>
