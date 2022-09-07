const MESSAGE_IN = "inbox";
const MESSAGE_OUT = "sent";

export function readInboxSMS(contentResolver) {
  // https://stackoverflow.com/questions/44256014/nativescript-android-net-uri-parse
  // https://github.com/NativeScript/NativeScript/issues/5838

  const messages = [];

  [MESSAGE_IN, MESSAGE_OUT].forEach((source) => {
    const from_me = source === MESSAGE_OUT;

    const cursor = contentResolver.query(
      android.net.Uri.parse("content://sms/" + source),
      null,
      null,
      null,
      null
    );

    if (cursor.moveToFirst()) {
      // must check the result to prevent exception
      do {
        const message = {};

        for (let idx = 0; idx < cursor.getColumnCount(); idx++) {
          message.from_me = from_me;

          const column_name = cursor.getColumnName(idx);
          const column_value = cursor.getString(idx);

          switch (column_name) {
            case "_id":
              message.id = parseInt(column_value);
              break;
            case "address":
              message.address = column_value;
              break;
            case "date":
              message.date = parseInt(column_value);
              break;
            case "date_sent":
              message.date_sent = parseInt(column_value);
              break;
            case "read":
              message.read = Boolean(parseInt(column_value));
              break;
            case "seen":
              message.seen = Boolean(parseInt(column_value));
              break;
            case "date_sent":
              message.date_sent = Boolean(parseInt(column_value));
              break;
            case "body":
              message.body = column_value;
              break;
            case "deleted":
              message.deleted = Boolean(parseInt(column_value));
              break;
            default:
              break;
          }
        }
        messages.push(message);
      } while (cursor.moveToNext());
    } else {
      // empty box, no SMS
    }
  });

  return messages.sort((a, b) => a.date - b.date);
}
