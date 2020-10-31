import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";

class MockMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ template, variables }: IParseMailTemplateDTO): Promise<string> {
        return template;
    }
}

export default MockMailTemplateProvider;