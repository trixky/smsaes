<script lang="typescript">
  import BlackHeaderStore from "../stores/black_header";
  import DetailContactActionItem from "../components/actionItems/detail_contact.svelte";
  import ConversationsStore from "../stores/conversations";
  import { timestampToString } from "../utils/date";
  import sendSMS from "../telephony/send";

  export let contact;
  let local_send_id = 0;

  let sender_message = "";
  // let encryption_checked = false;

  $: send_button_blocked = sender_message.length === 0;

  $: black_header = $BlackHeaderStore === "black";

  function handleSendSMS() {
    if (sender_message.length > 0) {
      const current_sender_message = sender_message;
      sender_message = "";

      const message = {
        id: "local",
        address: contact.phone_number, // phone number
        from_me: true,
        body: current_sender_message,
        date: Date.now(),
        date_sent: 0,
        seen: true,
        read: true,
        deleted: false,
        local: {
          intent: {
            ended: false,
            error: false,
          },
          delivery: undefined,
        },
      };

      ConversationsStore.addMessage(message);

      sendSMS(
        contact.phone_number,
        current_sender_message,
        message.date.toString() + (++local_send_id).toString(),
        (ok) => {
          ConversationsStore.updateSendedMessageIntent(message, {
            ended: true,
            error: !ok,
          });
        }
      );
    }
  }

  function localMessageIsSending(message) {
    return message?.local?.intent.ended === false;
  }

  function localMessageHadAnError(message) {
    return message.local?.intent.error === true;
  }
</script>

<page>
  <actionBar class:black-header={black_header}>
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
    <!-- <stackLayout row="0">
      <switch
      bind:checked={encryption_checked}
      style="background-color: red;"
      />
    </stackLayout> -->
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
                  class="message-label"
                  horizontalAlignment={message.from_me ? "right" : "left"}
                  >{timestampToString(message.date)}</label
                >
                <textView
                  textWrap="true"
                  editable={false}
                  class:sending={localMessageIsSending(message)}
                  class:error={localMessageHadAnError(message)}
                  class="message-body"
                  style="text-align: {message.from_me ? 'right' : 'left'};"
                  >{message.body}
                </textView>
              </stackLayout>
            {/each}
          {/if}
        </stackLayout>
      </gridLayout>
    </scrollView>
    <stackLayout class="sender" row="1">
      <gridLayout columns="*, auto" rows="auto">
        <textView
          height="auto"
          class="input-field"
          row="0"
          col="0"
          hint="Message text"
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
  .black-header {
    background-color: black;
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
  }

  .sending {
    color: blue;
  }

  .error {
    color: red;
  }

  .message.mine {
    text-align: right;
  }

  .sender {
    background-color: var(--main-grey-10);
  }

  .input-field {
    border-width: 0;
    min-height: 0;
    padding: 18 15;
    margin: 0;
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
</style>
