import {CBImageStamp} from '../Context/CBImageStamp';
import {CommonService} from "../_services/common.service";
import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from "@angular/core";
import {lastValueFrom} from "rxjs";
import {HttpConnectService} from "../_services/httpConnectService.service";
import {environment as env} from "../../environments/environment";
import {CBDocumentImage} from "../Context/CBDocumentImage";
import {CBTextStamp} from "../Context/CBTextStamp";
import {CBStamp} from "../Context/CBStamp";
import {HttpParams} from "@angular/common/http";
import {CBTemplateStamp} from "../Context/CBTemplateStamp";
import {CBText} from "../Context/CBText";
import {CBImage} from "../Context/CBImage";
import {CBLabel} from "../Context/CBLabel";
import {CBCustomStamp} from "../Context/CBCustomStamp";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: "app-sign-stamper",
    templateUrl: "./sign-stamper.component.html",
    styleUrls: ["./sign-stamper.component.scss"],
})
export class SignStamperComponent implements OnInit, AfterViewInit {
    x: number = 0;
    y: number = 0;
    width: number = 100;
    height: number = 100;
    documentID: string = "";
    _activeIndex: number = 0;
    documentImageList: any[] = [];
    imageList: CBImageStamp[] = [];
    textList: CBTextStamp[] = [];
    images: any[] = [];
    size: any = null;
    position: string = "bottom";
    textStamp: string = "";
    showFrame = false;
    frameTop = 0;
    frameLeft = 0;
    DisplayDialogAddTopic: boolean = false;
    displayDialog: boolean = false;
    templateStampList: CBTemplateStamp[] = [];
    zoom: number = 1.0;
    showImage = false;
    degree: number = 0;
    showGallery = false;
    signVisible = false;
    canvasWidth = 800;
    canvasHeight = 300;


    templateName: string = "";
    borderColor: string = '#000000';
    gridOption: boolean = false;
    textStampList: CBText[] = [];
    imageStampList: CBImage[] = [];
    labelStampList: CBLabel[] = [];
    fontSizes: number[] = [10, 12, 14, 16, 18, 20, 40, 50, 60];



    @ViewChild("imageListContainer") imageListContainer!: ElementRef;
    @ViewChild('myGalleria') galleria!: ElementRef;
    @ViewChild("imgstamp") imgstamp!: ElementRef;

    constructor(
        private httpService: HttpConnectService,
        private commonService: CommonService
    ) {
    }

    async ngOnInit() {
        await this.getTemplate();
    }

    ngAfterViewInit(): void {
    }

    async getTemplate() {
        let payload = new HttpParams();
        let response = await lastValueFrom(
            this.httpService.ConnectByPOST(`${env.localhost}/stamper/getTemplate`, payload)
        );
        console.log('response', response);
        console.log('response length', response.length)
        this.templateStampList = response;
    }

    showTextFrame(event: MouseEvent) {
        this.showFrame = true;
        this.frameTop = event.clientY;
        this.frameLeft = event.clientX;
    }

    openDialog() {
        this.DisplayDialogAddTopic = true;
    }

    submitDialog() {
        let text_list = new CBTextStamp();
        text_list.message = this.textStamp;
        text_list.x = this.x;
        text_list.y = this.y;
        text_list.pageNumber = this._activeIndex;
        text_list.documentID = this.documentID;
        text_list.isVisible = true;
        this.textList.push(text_list);
        this.textStamp = "";
        this.DisplayDialogAddTopic = false;
    }

    get activeIndex(): number {
        return this._activeIndex;
    }

    set activeIndex(newValue) {
        if (this.images && 0 <= newValue && newValue <= this.images.length - 1) {
            this._activeIndex = newValue;
        }
    }

    responsiveOptions: any[] = [
        {
            breakpoint: "1024px",
            numVisible: 5,
        },
        {
            breakpoint: "768px",
            numVisible: 3,
        },
        {
            breakpoint: "560px",
            numVisible: 1,
        },
    ];

    onFileSelect(event: UploadEvent) {
        const reader = new FileReader();
        for (let file of event.files) {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                this.addImageList(reader.result!.toString());
            };
        }
    }

    onFileRemove(event: UploadEvent) {
        event.files.pop();
    }

    async stamp() {
        let stampList = new CBStamp();
        stampList.documentID = this.documentID;
        stampList.imageStampList = this.imageList;
        stampList.textStampList = this.textList;
        let response = await lastValueFrom(
            this.httpService.ConnectByPOST_JSON(
                `${env.localhost}/stamper/stampDocument`,
                stampList
            )
        );
        if (response != null) {
            console.log("image edited");
        }
    }

    documentUpload(event: UploadEvent) {
        const reader = new FileReader();
        for (let file of event.files) {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                this.upload(file, 100);
            };
        }
    }

    async upload(file: File, ai_letterType: number) {
        const methodName = "multiupload";
        console.log("START " + methodName);
        let urlPath: string = env.localhost + "/stamper/convert";
        let formData = new FormData();
        formData.append("file", file);
        formData.append("filename", file.name);
        formData.append("letterType", ai_letterType.toString());
        console.log("ทดสอบ", formData.getAll("file"));
        try {
            const response = await this.httpService
                .ConnectByPOSTFormData(urlPath, formData)
                .toPromise();
            console.log("Upload response:", response);
            let documentCB = new CBDocumentImage(this.commonService);
            documentCB.JSONToCB(response);
            this.documentID = documentCB.documentID;
            this.documentImageList = documentCB.imageBase64;
            console.log("id", this.documentID);
        } catch (error) {
            console.error("Upload error:", error);
        }
    }

    showNextImage() {
        this._activeIndex = (this._activeIndex + 1) % this.documentImageList.length;
        this.visibleImageStamp();
        this.visibleTextStamp();
    }

    showPreviousImage() {
        this._activeIndex = (this._activeIndex - 1 + this.documentImageList.length) % this.documentImageList.length;
        this.visibleImageStamp();
        this.visibleTextStamp();
    }

    visibleImageStamp() {
        for (let i = 0; i < this.imageList.length; i++) {
            if (this.imageList.at(i)!.pageNumber === this._activeIndex) {
                this.imageList.at(i)!.isVisible = true;
            } else {
                this.imageList.at(i)!.isVisible = false;
            }
        }
    }

    visibleTextStamp() {
        for (let i = 0; i < this.textList.length; i++) {
            if (this.textList.at(i)!.pageNumber === this._activeIndex) {
                this.textList.at(i)!.isVisible = true;
            } else {
                this.textList.at(i)!.isVisible = false;
            }
        }
    }

    onMoveEnd(event: any, component: any) {
        component.x = event.x;
        component.y = event.y;
        console.log('x coordinate',component.x);
        console.log('y coordinate',component.y);
    }

    onResizing(event: any, component: CBImageStamp) {
        component.signWidth = event.size.width;
        component.signHeight = event.size.height;
    }

    onResizingTemplate(event: any, component: CBImage) {
        component.signWidth = event.size.width;
        component.signHeight = event.size.height;
    }

    toggleBorder() {
        const button = document.getElementById("borderBtn")!;
        button.classList.toggle("active");
        this.gridOption = !this.gridOption;
        this.drawBorder();
    }

    drawBorder() {
        console.log(this.gridOption)
        const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
        const ctx = canvas.getContext("2d")!;
        if (this.gridOption) {
            this.drawStroke(ctx);
        } else {
            this.clearStroke(ctx);
        }
    }

    drawStroke(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.borderColor;
        ctx.lineWidth = 5;
        ctx.strokeRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
    }

    clearStroke(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
    }

    addText() {
        let stampContent = new CBText();
        stampContent.editable = true;
        stampContent.content = "เพิ่มข้อความ";
        stampContent.x = this.x;
        stampContent.y = this.y;
        stampContent.isBold = false;
        stampContent.isItalic = false;
        stampContent.showEdit = false;
        stampContent.showTools = false;
        stampContent.fontSize = 16;
        this.textStampList.push(stampContent);
    }

    addImage(event: any) {
        const reader = new FileReader();
        for (let file of event.target.files) {
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                let image_item = new CBImage();
                image_item.signContent = reader.result!.toString();
                image_item.signWidth = this.width;
                image_item.signHeight = this.height;
                image_item.x = this.x;
                image_item.y = this.y;
                this.imageStampList.push(image_item);
            };
        }
    }

    addLabel() {
        let labelItem = new CBLabel();
        labelItem.content = "";
        labelItem.editable = true;
        labelItem.isBold = false;
        labelItem.isItalic = false;
        labelItem.label = "";
        labelItem.showEdit = false;
        labelItem.showTools = false;
        labelItem.xContent = 250;
        labelItem.yContent = 0;
        labelItem.x = 0;
        labelItem.y = 0;
        labelItem.fontSize = 16;
        this.labelStampList.push(labelItem);
    }

    showEdit(component: any) {
        component.showEdit = true;
    }

    hideEdit(component: any) {
        component.showEdit = false;
    }

    onContentChange(event: Event, component: any) {
        component.content = (event.target as HTMLParagraphElement).innerText || "";
        const pElement = event.target as HTMLParagraphElement;
        const newWidth = this.getMaxLineWidth(
            component.content,
            `${component.fontSize}px Arial`
        );
        pElement.style.width = newWidth + "px";
    }

    onLabelChange(event: Event, component: any) {
        component.label = (event.target as HTMLParagraphElement).innerText || "";
        // const pElement = event.target as HTMLParagraphElement;
        // const newWidth = this.getMaxLineWidth(component.content, "36px Arial");
        // pElement.style.width = newWidth + "px";
    }

    getMaxLineWidth(text: string, font: string): number {
        const lines = text.split("\n");
        let maxWidth = 0;
        for (const line of lines) {
            const width = this.getTextWidth(line, font);
            maxWidth = Math.max(maxWidth, width);
        }
        if (maxWidth <= 10) {
            return 200;
        } else {
            return maxWidth;
        }
    }

    getTextWidth(text: string, font: string): number {
        const canvas = <HTMLCanvasElement>document.createElement("canvas");
        const context = canvas.getContext("2d")!;
        if (!context) {
            return 150;
        }
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width + 5;
    }

    editMode(component: any) {
        component.showTools = !component.showTools;
        component.editable = true;
    }

    boldText(component: any) {
        component.isBold = !component.isBold;
        console.log(this.textStampList);
    }

    italicText(component: any) {
        component.isItalic = !component.isItalic;
    }

    delete(component: any) {
        this.textStampList = this.textStampList.filter((_, i) => i !== component);
    }

    deleteImage(component: any) {
        this.imageStampList = this.imageStampList.filter((_, i) => i !== component);
    }

    deleteLabel(component: any) {
        this.labelStampList = this.labelStampList.filter((_, i) => i !== component);
    }

    async combinedCanvas() {
        const fgCanvas = <HTMLCanvasElement>document.getElementById("fgCanvas");
        const ctx = fgCanvas.getContext("2d")!;
        ctx.textBaseline = "top";
        this.drawContent(ctx);
        this.drawLabel(ctx);
        await this.drawImg(ctx);
        const combinedCanvas = document.createElement("canvas");
        combinedCanvas.width = this.canvasWidth;
        combinedCanvas.height = this.canvasHeight;
        const combinedCtx = combinedCanvas.getContext("2d")!;
        const bgCanvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
        // await this.drawBG(bgCanvas, combinedCtx);
        combinedCtx.drawImage(bgCanvas, this.x, this.y);
        combinedCtx.drawImage(fgCanvas, this.x, this.y);
        const dataUrl = combinedCanvas.toDataURL("image/png");
        await this.saveStampTemplate(dataUrl);

        // let sign_item = new CBImageStamp();
        // sign_item.signContent = dataUrl;
        // sign_item.signWidth = 800;
        // sign_item.signHeight = 300;
        // sign_item.x = this.x;
        // sign_item.y = this.y;
        // sign_item.pageNumber = this._activeIndex;
        // sign_item.documentID = this.documentID;
        // sign_item.isVisible = true;
        // this.imageList.push(sign_item);
        await this.getTemplate();
        this.displayDialog = false;

    }

    drawContent(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
        for (let list of this.textStampList) {
            ctx.fillStyle = `${list.color}`;
            ctx.font = `${list.isBold ? "bold" : ""} ${
                list.isItalic ? "italic" : ""
            } ${list.fontSize}px Arial`;
            const paragraph = document.getElementById("textStamp")!;
            list.height = paragraph.offsetHeight;
            list.width = paragraph.offsetWidth;
            let lines = list.content.split("\n");
            if (lines.length > 0) {
                //   for (let i = 0; i < lines.length; i++) {
                //     ctx.textBaseline = "top";
                //     ctx.fillText(lines[i], list.x, list.y + i * 25);
                // }
                this.drawMultilineText(
                    ctx,
                    list.content,
                    list.x,
                    list.y,
                    list.width,
                    list.height,
                    list.fontSize + 7
                );
            } else {
                ctx.fillText(list.content, list.x, list.y);
            }
        }
    }

    async drawImg(ctx: CanvasRenderingContext2D): Promise<void> {
        const loadImage = (
            src: string,
            x: number,
            y: number,
            width: number,
            height: number
        ): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    ctx.drawImage(img, x, y, width, height);
                    resolve();
                };
            });
        };
        const loadImagePromises: Promise<void>[] = [];
        for (const list of this.imageStampList) {
            const promise = loadImage(
                list.signContent,
                list.x,
                list.y,
                list.signWidth,
                list.signHeight
            );
            loadImagePromises.push(promise);
        }
        await Promise.all(loadImagePromises);
    }

    drawLabel(ctx: CanvasRenderingContext2D) {
        for (let list of this.labelStampList) {
            ctx.fillStyle = `${list.color}`;
            ctx.font = `${list.isBold ? "bold" : ""} ${
                list.isItalic ? "italic" : ""
            } ${list.fontSize}px Arial`;
            ctx.fillText(list.label, list.x, list.y + 5);
            ctx.fillText(list.content, list.xContent, list.yContent + 5);
        }
    }

    drawMultilineText(
        ctx: CanvasRenderingContext2D,
        text: string,
        areaX: number,
        areaY: number,
        areaWidth: number,
        areaHeight: number,
        lineHeight: number
    ) {
        const lines = text.split("\n");
        const totalHeight = lines.length * lineHeight;
        const startY = areaY + (areaHeight - totalHeight) / 2;
        lines.forEach((line, index) => {
            const offsetY = startY + index * lineHeight;
            const textWidth = ctx.measureText(line).width;
            const offsetX = areaX + (areaWidth - textWidth) / 2;
            ctx.fillText(line, offsetX, offsetY);
        });
    }

    async createStamp() {
        this.gridOption = false;
        this.textStampList = [];
        this.imageStampList = [];
        this.labelStampList = [];
        this.templateName = '';
        this.displayDialog = true;
    }

    async saveStampTemplate(templateThumbnail: string) {
        let customStamp = new CBCustomStamp();
        customStamp.enableBorder = this.gridOption;
        customStamp.textStampList = this.textStampList;
        customStamp.imageStampList = this.imageStampList;
        customStamp.labelStampList = this.labelStampList;
        let templateString = customStamp.CBTOJSON(customStamp);
        let templateStamp: CBTemplateStamp = new CBTemplateStamp();
        templateStamp.templateName = this.templateName;
        templateStamp.templateData = JSON.stringify(templateString);
        templateStamp.templateThumbnail = templateThumbnail;
        let jsonTemplate = templateStamp.CBToJSON(templateStamp);
        console.log('jsonTemplate',jsonTemplate)
        let payload = new HttpParams().set('requestData', JSON.stringify(templateStamp));
        let response = await lastValueFrom(
            this.httpService.ConnectByPOST_JSON(
                `${env.localhost}/stamper/saveTemplate`,
                jsonTemplate
            )
        );
    }

    editTemplate(template: any) {
        this.displayDialog = true
        let templateJSON = new CBTemplateStamp();
        templateJSON.JSONToCB(template);
        let customStamp: CBCustomStamp = new CBCustomStamp();
        customStamp.JSONToCB(JSON.parse(templateJSON.templateData));
        this.gridOption = customStamp.enableBorder;
        this.templateName = templateJSON.templateName;
        this.textStampList = customStamp.textStampList;
        this.imageStampList = customStamp.imageStampList;
        this.labelStampList = customStamp.labelStampList;
        const textStamp = document.getElementById('textStamp')!;
        setTimeout(() => {
            for (let item of this.textStampList) {
                textStamp.innerText = item.content
            }
        },1000);

        setTimeout(this.drawBorder, 1000);

    }

    selectStamp(selectItem: CBTemplateStamp) {
        this.addImageList(selectItem.templateThumbnail);
    }

    addImageList(imageSrc: string) {
        let sign_item = new CBImageStamp();
        sign_item.signContent = imageSrc;
        sign_item.signWidth = 400;
        sign_item.signHeight = 150;
        sign_item.x = this.x;
        sign_item.y = this.y;
        sign_item.pageNumber = this._activeIndex;
        sign_item.documentID = this.documentID;
        sign_item.isVisible = true;
        this.imageList.push(sign_item);
    }

}
