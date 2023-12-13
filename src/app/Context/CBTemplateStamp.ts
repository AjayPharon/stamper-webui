import {CBCustomStampInterface} from "./CBCustomStamp";

export interface CBTemplateStampInterface {
    ID: string;
    templateName: string;
    templateData: string;
    templateThumbnail: string;
    editable:boolean;
}

export class CBTemplateStamp {
    public ID: string = '';
    public templateName: string = '';
    public templateData: string = '';
    public templateThumbnail: string = '';
    public editable: boolean = false

    JSONToCB(jsonData: any) {
        this.ID = jsonData.ID;
        this.templateName = jsonData.templateName;
        this.templateData = jsonData.templateData;
        this.templateThumbnail = jsonData.templateThumbnail;
        this.editable = jsonData.editable;
    }


    CBToJSON(CBTemplateStamp: any) {
        const result: CBTemplateStampInterface = {} as CBTemplateStampInterface;
        result.templateName = CBTemplateStamp.templateName;
        result.templateData = CBTemplateStamp.templateData;
        result.templateThumbnail = CBTemplateStamp.templateThumbnail;
        result.editable = CBTemplateStamp.editable;
        return result;
    }
}