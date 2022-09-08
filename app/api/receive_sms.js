import ConversationsStore from "../stores/conversations";

let local_received_id = 0;

export function receiveSMS(
  context, // android.content.Context
  intent // android.content.Intent
) {
  const extras = intent.getExtras();
  const pdus = extras.get("pdus");
  const received_message = android.telephony.SmsMessage.createFromPdu(pdus[0]);
  const date = Date.now();

  const message = {
    id: date.toString() + (++local_received_id).toString(),
    address: received_message.getOriginatingAddress(), // phone number
    from_me: false,
    body: received_message.getMessageBody().toString(),
    date,
    date_sent: 0,
    seen: false,
    read: false,
    deleted: false,
    local: undefined,
  };

  ConversationsStore.addMessage(message);
}
