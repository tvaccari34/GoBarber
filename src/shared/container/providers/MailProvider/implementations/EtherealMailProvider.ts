import nodemailer, { Transporter } from 'nodemailer';
import IMailProvider from "../models/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";
import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider';
import {injectable, inject} from 'tsyringe';

@injectable()
export default class EtherealMailProvider implements IMailProvider{

    private client: Transporter;

    constructor(
        @inject('MailTemplateProvider')
        private mailTemplateProvider: IMailTemplateProvider,
    ) {
        nodemailer.createTestAccount().then(account => {
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }

    public async sendMail({to, from, subject, templateData}: ISendMailDTO): Promise<void> {
        const message = await this.client.sendMail({
            from: {
                name: from?.name || 'GoBarber Team',
                address: from?.email || 'team@gobarber.co.uk',
            },
            to: {
                name: to.name,
                address: to.email,
            },
            subject,
            html: await this.mailTemplateProvider.parse(templateData),
        });
    };

}