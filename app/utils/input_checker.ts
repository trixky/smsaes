export function checkPhoneNumber(phone_number: string): Error | null {
  if (phone_number.length < 3) {
    return new Error("Phone number is too short");
  }
  return null;
}

export function checkFirstname(phone_number: string): Error | null {
  if (phone_number.length === 0) {
    return new Error("Firstname is missing");
  }
  return null;
}

export function checkAesKey(aes_key: string, is_master = false): Error | null {
  if (aes_key.length < 8) {
    return new Error(
      "The " +
        (is_master ? "master password" : "AES key") +
        " must be at least 8 characters long."
    );
  }

  return null;
}
