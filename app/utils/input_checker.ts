export function checkPhoneNumber(phone_number: string): Error | null {
  if (phone_number.length < 3) {
    return new Error("Phone number is too short");
  }
  return null;
}

export function checkFirstname(phone_number: string): Error | null {
  if (phone_number.length < 2) {
    return new Error("Firstname is too short");
  }
  return null;
}
