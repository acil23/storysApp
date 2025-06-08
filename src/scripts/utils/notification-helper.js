import { VAPID_PUBLIC_KEY } from "../config.js";
import { BASE_URL } from "../config.js";
import { Auth } from "../utils/auth-helper.js";

export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API unsupported.");
    return false;
  }

  if (isNotificationGranted()) {
    return true;
  }

  const status = await Notification.requestPermission();

  if (status === "denied") {
    alert("Izin notifikasi ditolak.");
    return false;
  }

  if (status === "default") {
    alert("Izin notifikasi ditutup atau diabaikan.");
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
  if (!(await requestNotificationPermission())) return;

  const registration = await navigator.serviceWorker.getRegistration();

  const existingSubscription = await registration.pushManager.getSubscription();
  if (existingSubscription) {
    alert("Sudah berlangganan notifikasi.");
    return;
  }

  const newSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  console.log("Berhasil berlangganan:", newSubscription);

  const { endpoint, keys } = newSubscription.toJSON(); // ← penting!

  try {
    console.log("Token:", localStorage.getItem("story_token"));
    console.log("Sending subscription:", newSubscription);

    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Auth.getToken()}`, // ← tambahkan token jika perlu
      },
      body: JSON.stringify({ endpoint, keys }), // ← ini penting!
    });

    if (!response.ok) {
      throw new Error("Gagal mendaftarkan subscription ke server");
    }

    console.log("Subscription berhasil dikirim ke server");
    alert("Berhasil berlangganan notifikasi.");
  } catch (error) {
    console.error("Gagal mengirim subscription ke server:", error);
    await newSubscription.unsubscribe(); // rollback
    alert("Gagal berlangganan notifikasi.");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
