// https://developer.android.com/reference/android/provider/Telephony.TextBasedSmsColumns

export default interface Message {
  id: string;
  address: string; // phone number
  from_me: boolean;
  body: string;
  date: number;
  date_sent: number;
  seen: boolean;
  read: boolean;
  deleted: boolean;
}
