<script lang="typescript">
  import ContactsStore from "../stores/contacts";
  import GoldHeaderStore from "../stores/gold_header";
  import DetailContactActionItem from "../components/actionItems/detail_contact.svelte";
  import ConversationsStore from "../stores/conversations";
  import { timestampToString } from "../utils/date";
  import sendSMS from "../telephony/send";
  import { alert } from "@nativescript/core/ui/dialogs";
  import { navigate } from "svelte-native";
  import Home from "../pages/home.svelte";
  import { decryptMessage } from "../utils/aes";
  import { confirm } from "@nativescript/core/ui/dialogs";
  import LocalesStore from "../stores/locales";
  import { setText } from "nativescript-clipboard";
  import Toast from "nativescript-toast";
  import Config from "../config";

  export let contact;

  $: encryption_activated =
    $ContactsStore.find(
      (_contact) => _contact.phone_number === contact.phone_number
    )?.encryption_activated === 1;

  let local_send_id = 0;

  let sender_message = "";

  $: send_button_blocked = sender_message.length === 0;

  $: gold_header = $GoldHeaderStore === "gold";

  function isAesMessage(message) {
    return message.startsWith(Config.aes.header);
  }

  function decryptAesMessage(message, with_label = false) {
    if (isAesMessage(message)) {
      const encrypted_body = message.slice(Config.aes.header.length);

      const descrypted_body = decryptMessage(encrypted_body, contact.aes_key);
      return (with_label ? Config.aes.header : "") + descrypted_body;
    }
    return message;
  }

  async function handleSendSMS() {
    if (!encryption_activated) {
      if (
        !(await confirm($LocalesStore.chat.sendNotEncryptedMessageConfirmation))
      )
        return;
    }

    if (sender_message.length > 0) {
      let current_sender_message = sender_message;
      sender_message = "";

      sendSMS(
        contact.phone_number,
        current_sender_message,
        Date.now().toString() + (++local_send_id).toString(),
        encryption_activated ? contact.aes_key : undefined
      );
    }
  }

  function localMessageIsSending(message) {
    return message?.local?.intent.ended === false;
  }

  function localMessageHadAnError(message) {
    return message.local?.intent.error === true;
  }

  function checkIfContactExists() {
    const check_contact = $ContactsStore.find(
      (_contact) => _contact.phone_number === contact.phone_number
    );

    if (check_contact === undefined) {
      alert($LocalesStore.chat.contactDeleted).then(() => {
        navigate({
          page: Home,
        });
      });
    }
  }

  function handleCopieMessage(body) {
    setText(body).then(() => {
      Toast.makeText($LocalesStore.chat.messageCopied).show();
    });
  }

  checkIfContactExists();
</script>

<page on:navigatedTo={checkIfContactExists}>
  <actionBar class:gold-header={gold_header}>
    <label horizontalAlignment="left"
      >{contact.firstname +
        (contact.lastname.length > 0 ? " " + contact.lastname : "") +
        " (" +
        contact.phone_number +
        ")"}</label
    >
    <DetailContactActionItem {contact} not_editable={true} />
  </actionBar>
  <gridlayout rows="*, auto">
    <scrollView row="0" class="invert">
      <gridLayout columns="*, auto" rows="auto">
        <stackLayout row="0" />

        <stackLayout
          row="1"
          class="messages invert"
          style="margin-bottofm: {(5 -
            ($ConversationsStore.hasOwnProperty(contact.phone_number)
              ? $ConversationsStore[contact.phone_number].length
              : 0)) *
            10}asdf;"
        >
          {#if $ConversationsStore.hasOwnProperty(contact.phone_number)}
            {#each $ConversationsStore[contact.phone_number] as message}
              <stackLayout
                class="message"
                width="70%"
                horizontalAlignment={message.from_me ? "right" : "left"}
              >
                <label
                  on:tap={() => handleCopieMessage(message.body)}
                  class="message-label"
                  horizontalAlignment={message.from_me ? "right" : "left"}
                  >{timestampToString(message.date)}</label
                >
                <textView
                  on:tap={() => handleCopieMessage(message.body)}
                  textWrap="true"
                  editable={false}
                  class:sending={localMessageIsSending(message)}
                  class:error={localMessageHadAnError(message)}
                  class="message-body"
                  style="text-align: {message.from_me ? 'right' : 'left'};"
                >
                  <formattedString>
                    {#if isAesMessage(message.body)}
                      <span class="aes-label">{Config.aes.header}</span>
                    {/if}
                    <span>{decryptAesMessage(message.body)}</span>
                  </formattedString>
                </textView>
              </stackLayout>
            {/each}
          {/if}
        </stackLayout>
      </gridLayout>
    </scrollView>
    <stackLayout row="1">
      <gridLayout columns="*, auto" rows="auto">
        <textView
          height="auto"
          class:encryption-activated={encryption_activated}
          class="input-field"
          row="0"
          col="0"
          hint={$LocalesStore.chat.messageTextHint}
          bind:text={sender_message}
        />
        <stackLayout
          class:blocked={send_button_blocked}
          class="send-button"
          row="0"
          col="1"
          on:tap={handleSendSMS}
        >
          <image
            src="~/static/send-inverted.png"
            stretch="fill"
            width="24"
            height="24"
          />
        </stackLayout>
      </gridLayout>
    </stackLayout>
  </gridlayout>
</page>

<style>
  .gold-header,
  .gold-header > Label {
    background-color: rgb(255, 245, 99);
    color: black;
  }

  .invert {
    transform: rotate(180deg);
  }

  .messages {
    padding: 15;
  }

  .message {
    margin-bottom: 8;
  }

  .message-label {
    color: var(--main-grey-3);
  }

  .message-body {
    min-height: 0;
    padding: 0;
    margin: 0;
    margin-top: 3;
    border-bottom-color: yellow;
  }

  .sending {
    color: var(--main-grey-7);
  }

  .error {
    color: var(--main-red-5);
  }

  .message.mine {
    text-align: right;
  }

  .input-field {
    border-width: 0;
    min-height: 0;
    padding: 18 15;
    margin: 0;
  }

  .input-field.encryption-activated {
    color: var(--main-blue-0);
  }

  .send-button {
    padding: 15 15 0 0;
    background-color: transparent;
    border-width: 0;
    z-index: 0;
    opacity: 0.8;
  }

  .blocked {
    opacity: 0.2;
  }

  .aes-label {
    color: var(--main-blue-0);
    font-style: italic;
  }
</style>
