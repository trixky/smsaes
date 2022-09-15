import { ad } from "@nativescript/core/utils/utils";
import { Application } from "@nativescript/core";
import ConversationsStore from "../stores/conversations";
import { encryptMessage } from "../utils/aes";
import Config from "../config";

const smsManager = android.telephony.SmsManager.getDefault();

const max_body_length = 80; // 152;

function sendPartSMS(address, body, id, intent_callback = undefined) {
  // https://developer.android.com/reference/android/app/PendingIntent#FLAG_MUTABLE
  const FLAG_MUTABLE = 33554432;
  // https://developer.android.com/reference/android/app/PendingIntent#FLAG_IMMUTABLE
  const FLAG_IMMUTABLE = 67108864;

  const context = ad.getApplicationContext();

  // ------------------------------------------ pending intent
  const intentPendingFilter = id + "_intent";
  const intent_for_pending = new android.content.Intent(intentPendingFilter);
  const pendingIntent = android.app.PendingIntent.getBroadcast(
    context,
    0,
    intent_for_pending,
    FLAG_IMMUTABLE
  );

  Application.android.registerBroadcastReceiver(
    intentPendingFilter,
    function (
      context, // android.content.Context
      intent // android.content.Intent
    ) {
      if (intent_callback != undefined)
        intent_callback(
          this.getResultCode() === android.app.Activity.RESULT_OK
        );
    }
  );

  // ------------------------------------------ delivery intent
  const intentDeliveryFilter = id + "_delivery";
  const intent_for_delivery = new android.content.Intent(intentDeliveryFilter);
  const deliveryIntent = android.app.PendingIntent.getBroadcast(
    context,
    0,
    intent_for_delivery,
    FLAG_IMMUTABLE
  );

  Application.android.registerBroadcastReceiver(
    intentDeliveryFilter,
    function (
      context, // android.content.Context
      intent // android.content.Intent
    ) {}
  );

  setTimeout(() => {
    smsManager.sendTextMessage(
      address,
      null,
      body,
      pendingIntent,
      deliveryIntent
    );
  }, 2000);
}

export default function sendSMS(address, body, id, aes_key = undefined) {
  let index = 0;

  while (body.length > 0) {
    let local_body = body.slice(0, max_body_length);
    body = body.slice(max_body_length);
    if (aes_key != undefined)
      local_body = Config.aes.header + encryptMessage(local_body, aes_key);

    const local_id = id + (++index).toString();

    const message = {
      local_id: "local",
      address: address, // phone number
      from_me: true,
      body: local_body,
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

    sendPartSMS(
      address,
      local_body,
      local_id,
      (ok) => {
        ConversationsStore.updateSendedMessageIntent(message, {
          ended: true,
          error: !ok,
        });
      },
      aes_key
    );
  }
}
