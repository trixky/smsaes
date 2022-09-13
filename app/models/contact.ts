export default interface Contact {
  phone_number: string;
  firstname: string;
  lastname: string | null;
  email: string | null;
  note: string | null;
  aes_key: string;
}
