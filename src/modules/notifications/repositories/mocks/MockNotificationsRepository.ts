import { ObjectId } from 'mongodb';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import Notification from '../../infra/typeorm/schemas/notification';

class NotificationsRepository
    implements INotificationsRepository {

    private notifications: Notification[] = [];

    public async create({content, recipient_id}: ICreateNotificationDTO): Promise<Notification>{
        const notification = new Notification();

        Object.assign(notification, { id: new ObjectId(), recipient_id, content });

        this.notifications.push(notification);

        return notification;
    }
}

export default NotificationsRepository;