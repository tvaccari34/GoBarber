import {container} from 'tsyringe';
import DiskStorageProvider from './StorageProviders/implementations/DiskStorageProvider';
import IStorageProvider from './StorageProviders/models/IStorageProvider';

container.registerSingleton<IStorageProvider>('StorageProvider', DiskStorageProvider);