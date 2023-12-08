import {CBCustomStampInterface} from "./CBCustomStamp";

export interface CBTemplateStampInterface {
    templateName: string;
    templateSting: string;
    templateThumbnail: string;
    editable:boolean;
}

export class CBTemplateStamp {
    public templateName: string = '';
    public templateString: string = '';
    public templateThumbnail: string = '';
    public editable: boolean = false

    JSONToCB(jsonData: any) {
        this.templateName = jsonData.templateName;
        this.templateString = jsonData.templateSting;
        this.templateThumbnail = jsonData.templateThumbnail;
        this.editable = jsonData.editable;
    }


    CBTOJSON(CBTemplateStamp: any) {
        const result: CBTemplateStampInterface = {} as CBTemplateStampInterface;
        result.templateName = CBTemplateStamp.templateName;
        result.templateSting = CBTemplateStamp.templateString;
        result.templateThumbnail = CBTemplateStamp.templateThumbnail;
        result.editable = CBTemplateStamp.editable;
        return result;
    }
}