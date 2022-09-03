<script>
  import Contact from "./contact.svelte";
  import { navigate } from "svelte-native";

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
</script>

<page>
  <actionBar title="Svelte Native App" />
  <scrollView orientation="vertical">
    <stackLayout>
      {#each contacts as contact}
        <!-- svelte-ignore a11y-label-has-associated-control -->
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
            <span text={"  " + contact.phone_number} />
          </formattedString>
        </button>
      {/each}
    </stackLayout>
  </scrollView>
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
