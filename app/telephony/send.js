import { ad } from "@nativescript/core/utils/utils";
import { Application } from "@nativescript/core";

const smsManager = android.telephony.SmsManager.getDefault();

export default function sendSMS(
  address,
  body,
  id,
  intent_callback = undefined
) {
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
