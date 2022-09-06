<script lang="typescript">
  import DetailContactActionItem from "../components/actionItems/detail_contact.svelte";

  export let contact;

  let sender_message = "";
  let encryption_checked = false;

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
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
        <label class="message mine">asdfasdfc--main-grey-3</label>
        <label class="message">asdfasdfc--main-grey-3</label>
      </stackLayout>
    </scrollView>
    <stackLayout class="sender" row="2">
      <gridLayout columns="*, auto" rows="auto">
        <textView
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
    /* margin: 0 15; */
  }

  .message.mine {
    text-align: right;
  }

  .sender {
    background-color: var(--main-grey-10);
  }

  .input-field {
    border-width: 0;
    padding: 15 15;
    padding-bottom: 22;
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
