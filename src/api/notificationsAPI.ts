// src/api/notificationsAPI.ts
import { Notification } from "../types/Notification";

export const fetchNotificationsFromBackend = async (): Promise<Notification[]> => {
  const res = await fetch(
    'https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/notifications'
  );

  const data = await res.json();

  const documents = data.documents ?? [];

  return documents.map((doc: any) => ({
    id: doc.name.split('/').pop(),
    message: doc.fields.message.stringValue,
    time: doc.fields.time?.stringValue || '',
  }));
};
