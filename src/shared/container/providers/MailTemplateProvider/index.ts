import {container} from 'tsyringe';
import IMailTemplateProvider from './models/IMailTemplateProvider';
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';
import mailConfig from '@config/mail';

const providers = {
    handlebars: HandlebarsMailTemplateProvider,
}

container.registerSingleton<IMailTemplateProvider>('MailTemplateProvider', providers.handlebars);