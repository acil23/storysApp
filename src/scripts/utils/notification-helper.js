import { VAPID_PUBLIC_KEY } from '../config.js';

export function isNotificationAvailable() {
  return 'Notification' in window;
}
 
export function isNotificationGranted() {
  return Notification.permission === 'granted';
}
 
export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error('Notification API unsupported.');
    return false;
  }
 
  if (isNotificationGranted()) {
    return true;
  }
 
  const status = await Notification.requestPermission();
 
  if (status === 'denied') {
    alert('Izin notifikasi ditolak.');
    return false;
  }
 
  if (status === 'default') {
    alert('Izin notifikasi ditutup atau diabaikan.');
    return false;
  }
 
  return true;
}
 
export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}
 
export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}
 
export async function subscribe() {
  if (!(await requestNotificationPermission())) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    alert('Sudah berlangganan notifikasi.');
    return;
  }

  const newSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  console.log('Berhasil berlangganan:', newSubscription);

  alert('Berhasil berlangganan notifikasi.');
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
