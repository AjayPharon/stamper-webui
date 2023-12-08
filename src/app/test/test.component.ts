import {CBCustomStamp} from "../Context/CBCustomStamp";
import {CBImage} from "../Context/CBImage";
import {CBLabel} from "../Context/CBLabel";
import {CBText} from "../Context/CBText";
import {Component, ElementRef, ViewChild} from "@angular/core";
import {HttpConnectService} from "../_services/httpConnectService.service";
import {lastValueFrom} from "rxjs";
import {environment as env} from "../../environments/environment";
import {HttpParams} from "@angular/common/http";
import {CBTemplateStamp} from "../Context/CBTemplateStamp";

interface UploadEvent {
    originalEvent: Event;
    files: File[];
}

@Component({
    selector: "app-test",
    templateUrl: "./test.component.html",
    styleUrls: ["./test.component.scss"],
})
export class TestComponent {
    @ViewChild("bgCanvas", {static: true}) bgCanvas!: ElementRef;
    @ViewChild("fileInput") fileInput: any;
    gridOption: boolean = false;
    templateName:string = "";
    DisplayDialogConfig: boolean = false;
    draggable = true;
    x: number = 0;
    y: number = 0;
    width: number = 100;
    height: number = 100;
    textStampList: CBText[] = [];
    imageStampList: CBImage[] = [];
    labelStampList: CBLabel[] = [];
    fontSizes: number[] = [10, 12, 14, 16, 18, 20];
    canvasWidth:number = 800;
    canvasHeight:number = 300;

    constructor(
        private httpService: HttpConnectService,
    ) {
    }

    ngOnInit(): void {
        this.DisplayDialogConfig = true;
        this.gridOption = false;
    }

    drawBorder() {
        const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
        const ctx = canvas.getContext("2d")!;
        if (this.gridOption) {
            this.drawStroke(ctx);
        } else {
            this.clearStroke(ctx);
        }
    }

    drawStroke(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
    }

    clearStroke(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(this.x, this.y, this.canvasWidth, this.canvasHeight);
    }

    onMoveEnd(event: any, component: any) {
        component.x = event.x;
        component.y = event.y;
    }

    addText() {
        let stampContent = new CBText();
        stampContent.editable = true;
        stampContent.content = "";
        stampContent.x = this.x;
        stampContent.y = this.y;
        stampContent.isBold = false;
        stampContent.isItalic = false;
        stampContent.showEdit = false;
        stampContent.showTools = false;
        stampContent.fontSize = 16;
        this.textStampList.push(stampContent);
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
        this.saveStampTemplate(dataUrl);
    }

    isInsideBgCanvas(event: MouseEvent): boolean {
        const bgCanvasRect = this.bgCanvas.nativeElement.getBoundingClientRect();
        return (
            event.clientX >= bgCanvasRect.left &&
            event.clientX <= bgCanvasRect.right &&
            event.clientY >= bgCanvasRect.top &&
            event.clientY <= bgCanvasRect.bottom
        );
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

    boldText(component: any) {
        component.isBold = !component.isBold;
        console.log(this.textStampList);
    }

    italicText(component: any) {
        component.isItalic = !component.isItalic;
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

    showEdit(component: any) {
        component.showEdit = true;
    }

    hideEdit(component: any) {
        component.showEdit = false;
    }

    editMode(component: any) {
        component.showTools = !component.showTools;
        component.editable = true;
    }

    toggleBorder() {
        const button = document.getElementById("borderBtn")!;
        button.classList.toggle("active");
        this.gridOption = !this.gridOption;
        this.drawBorder();
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

    onResizing(event: any, component: CBImage) {
        component.signWidth = event.size.width;
        component.signHeight = event.size.height;
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

    async saveStampTemplate(templateThumbnail: string) {
        let customStamp = new CBCustomStamp();
        customStamp.enableBorder = this.gridOption;
        customStamp.textStampList = this.textStampList;
        customStamp.imageStampList = this.imageStampList;
        customStamp.labelStampList = this.labelStampList;
        let templateString = customStamp.CBTOJSON(customStamp);
        let templateStamp: CBTemplateStamp = new CBTemplateStamp();
        templateStamp.templateName = this.templateName;
        templateStamp.templateString = JSON.stringify(templateString);
        templateStamp.templateThumbnail = templateThumbnail;
        let payload = new HttpParams().set('requestData', JSON.stringify(templateStamp));
        let response = await lastValueFrom(
            this.httpService.ConnectByPOST_JSON(
                `${env.localhost}/stamper/saveTemplate`,
                templateStamp
            )
        );
        await this.getTemplate();
    }

    async getTemplate() {
        let payload = new HttpParams();
        let response = await lastValueFrom(
            this.httpService.ConnectByPOST(`${env.localhost}/stamper/getTemplate`, payload)
        );
    }
}
