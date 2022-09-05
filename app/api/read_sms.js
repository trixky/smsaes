export function readOldSMS(contentResolver) {
  // https://stackoverflow.com/questions/44256014/nativescript-android-net-uri-parse
  // https://github.com/NativeScript/NativeScript/issues/5838
  // android.net.Uri.parse(dataString)
  const cursor = contentResolver.query(
    android.net.Uri.parse("content://sms/sent"),
    null,
    null,
    null,
    null
  );

  let final = 0;

  if (cursor.moveToFirst()) {
    // must check the result to prevent exception
    do {
      final++;
      let msgData = "";
      for (let idx = 0; idx < cursor.getColumnCount(); idx++) {
        msgData +=
          " " + cursor.getColumnName(idx) + ":" + cursor.getString(idx);
      }
    } while (cursor.moveToNext());
  } else {
    // empty box, no SMS
  }

  return final;
}
