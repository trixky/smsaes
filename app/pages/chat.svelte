<script lang="typescript">
  import DetailContactActionItem from "../components/actionItems/detail_contact.svelte";
  import messages from "../stores/conversations";
  import ConversationsStore from "../stores/conversations";
  import { timestampToString } from "../utils/date";

  export let contact;

  let sender_message = "";
  // let encryption_checked = false;

  $: send_button_blocked = sender_message.length === 0;
</script>

<page>
  <actionBar
    title={contact.firstname +
      (contact.lastname.length > 0 ? " " + contact.lastname : "") +
      " (" +
      contact.phone_number +
      ")"}
  >
    <DetailContactActionItem {contact} />
  </actionBar>
  <gridlayout rows="auto, *, auto">
    <!-- <stackLayout row="0">
      <switch
        bind:checked={encryption_checked}
        style="background-color: red;"
      />
    </stackLayout> -->
    <scrollView row="1">
      <stackLayout class="messages">
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
                class="message-body"
                style="text-align: {message.from_me ? 'right' : 'left'};"
                >{message.body}
              </textView>
            </stackLayout>
          {/each}
        {/if}
      </stackLayout>
    </scrollView>
    <stackLayout class="sender" row="2">
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
          on:tap={() => {
            console.log("osdifjsd");
          }}
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
