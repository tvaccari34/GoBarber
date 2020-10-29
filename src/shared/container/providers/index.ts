import {container} from 'tsyringe';
import IMailProvider from './MailProvider/models/IMailProvider';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProviders/models/IStorageProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);
//container.registerSingleton<IMailProvider>('MailProvider', MailProvider);
