<script>
  import Contact from "./contact.svelte";
  import { navigate } from "svelte-native";
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

  let contacts = [
    {
      name: "trixky",
      phone_number: "+33 000000000",
    },
    {
      name: "chat",
      phone_number: "+33 090909090",
    },
  ];

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
</script>

<page>
  {#if pageLoaded}
    {#if readSMSPermissionGranted}
      <actionBar title="Svelte Native App" />
      <scrollView orientation="vertical">
        <stackLayout>
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label>{final}</label>
          <button
            text="read old SMS"
            on:tap={() => {
              final = readOldSMS(contentResolver);
            }}
          />
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
                <span text={contact.name} class="contact-name" />
                <span text={" s" + contact.phone_number} />
              </formattedString>
            </button>
          {/each}
        </stackLayout>
      </scrollView>
    {:else}
      <actionBar title="Svelte Native App" />
      <stackLayout>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{readSMSPermissionGranted} ???</label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{typeof readSMSPermissionGranted} ???</label>
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
    border-width: 2 0 0 0;
    border-color: rgb(99, 224, 99);
  }
  .contact-name {
    text-decoration: underline;
    padding-right: 30px;
  }
</style>
