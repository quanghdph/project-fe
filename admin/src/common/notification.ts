import { notification } from 'antd';
import type { NotificationPlacement } from 'antd/es/notification';

type NotificationType = 'success' | 'info' | 'warning' | 'error';
export const Inotification = ({ type, message, description, placement, duration }: { type: NotificationType, message: string, description?: string, placement?: NotificationPlacement, duration?: number }) => {
    notification[type]({
        message,
        description,
        placement,
        duration,
    });
}