# smsaes

<img src="https://github.com/trixky/smsaes/blob/main/.demo/icon.png?raw=true" alt="screenshots" width="100"/>

A mobile application that allows you to send encrypted sms in [AES](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard) build with [svelte-native](https://svelte-native.technology/).

<img src="https://github.com/trixky/smsaes/blob/main/.demo/screenshots.gif?raw=true" alt="screenshots" width="300"/>

## Security and privacy

- The contact directory of the application is dissociated from the default one of your phone.
- Each contact has its own AES key.
- AES keys backup is encrypted. So the application must be unlocked at startup.
- You can enable or disable encryption for each contact.

## Usage

```bash
# install depdencies
tns install
# check available devices
tns devices
# run the app for android
tns run android
```

> only made for android.

### Requirements

- android-sdk build/plateform-tools 33
- nativescript 8.3.3
- nativescript/android 7.0.0