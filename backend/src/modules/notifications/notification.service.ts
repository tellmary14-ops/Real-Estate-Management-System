import { notificationRepository } from "./notification.repository.js";

export const notificationService = {
  list(userId: string) {
    return notificationRepository.findByUser(userId);
  },

  markRead(userId: string, id: string) {
    return notificationRepository.markRead(id, userId);
  },

  markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  },
};
