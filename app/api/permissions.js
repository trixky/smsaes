import { Application, Utils } from "@nativescript/core";

// ------------------------ READ SMS

export function getReadSMSPermission() {
  return (
    androidx.core.content.PermissionChecker.checkSelfPermission(
      Utils.android.getApplicationContext(),
      android.Manifest.permission.READ_SMS
    ) === android.content.pm.PackageManager.PERMISSION_GRANTED
  );
}

export async function askReadSMSPermission() {
  await androidx.core.app.ActivityCompat.requestPermissions(
    Application.android.foregroundActivity,
    [android.Manifest.permission.READ_SMS],
    1
  );
}

// ------------------------ SEND SMS

export function getSendSMSPermission() {
  return (
    androidx.core.content.PermissionChecker.checkSelfPermission(
      Utils.android.getApplicationContext(),
      android.Manifest.permission.SEND_SMS
    ) === android.content.pm.PackageManager.PERMISSION_GRANTED
  );
}

export async function askSendSMSPermission() {
  await androidx.core.app.ActivityCompat.requestPermissions(
    Application.android.foregroundActivity,
    [android.Manifest.permission.SEND_SMS],
    1
  );
}

// ------------------------ RECEIVE SMS

export function getReceiveSMSPermission() {
  return (
    androidx.core.content.PermissionChecker.checkSelfPermission(
      Utils.android.getApplicationContext(),
      android.Manifest.permission.RECEIVE_SMS
    ) === android.content.pm.PackageManager.PERMISSION_GRANTED
  );
}

export async function askReceiveSMSPermission() {
  await androidx.core.app.ActivityCompat.requestPermissions(
    Application.android.foregroundActivity,
    [android.Manifest.permission.RECEIVE_SMS],
    1
  );
}
