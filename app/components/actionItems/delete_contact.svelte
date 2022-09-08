<script>
  import Home from "../../pages/home.svelte";
  import { navigate } from "svelte-native";
  import { confirm } from "@nativescript/core/ui/dialogs";
  import { deleteContact } from "../../db/contact";

  export let contact;

  function handleDeleteContact() {
    confirm({
      title: "Delete contact",
      message: "Are you sure you want to delete this contact?",
      okButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then(async (confirm) => {
      if (confirm && deleteContact(contact.phone_number))
        navigate({
          page: Home,
        });
    });
  }
</script>

<actionItem
  on:tap={handleDeleteContact}
  android.systemIcon="ic_menu_delete"
  android.position="actionBar"
/>
