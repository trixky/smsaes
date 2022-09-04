import { Application, Utils } from "@nativescript/core";

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
