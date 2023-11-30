import { Component, ElementRef, ViewChild } from "@angular/core";
import { CBStampContent } from "../Context/CBStampContent";
import { CdkDragEnd } from "@angular/cdk/drag-drop";
import { computeMsgId } from "@angular/compiler";

@Component({
  selector: "app-test",
  templateUrl: "./test.component.html",

  styleUrls: ["./test.component.scss"],
})
export class TestComponent {
  @ViewChild("bgCanvas", { static: true }) bgCanvas!: ElementRef;
  private inputBox!: HTMLInputElement;
  gridOption: boolean = false;
  DisplayDialogConfig: boolean = false;
  canvasShow: boolean = false;
  inputField: string = "";
  contentField: string = "";
  receiveNumber: string = "";
  stampContentList: CBStampContent[] = [];
  isBold: boolean = false;
  isItalic: boolean = false;
  draggable = true;
  isEditable: boolean = true;
  maxlength: number = 750;
  editableContent: string = "Initial content";
  safeAreaPadding: number = 15;
  isShow: boolean = false;

  ngOnInit(): void {
    this.DisplayDialogConfig = true;
    this.gridOption = false;
    this.canvasShow = false;
  }

  ngAfterViewInit(): void {}
  onDrag() {
    console.log("dragging");
    
  }

  onSingleClick(event: MouseEvent) {
    // Handle single click (focus)
    this.isEditable = false; // Prevent editing on single click
    // Additional logic for focusing or other actions on single click
  }

  onDoubleClick(event: MouseEvent) {
    // Handle double-click (start editing)
    this.isEditable = true;
    console.log(this.isEditable);
  }

  onBlur() {
    // Handle blur (stop editing when input loses focus)
    this.isEditable = false;
    console.log(this.isEditable);
  }

  drawBorder() {
    if (this.gridOption) {
      this.drawStroke();
    } else {
      this.clearStroke();
    }
  }

  onMoveEnd(event: any, component: any) {
    console.log(event.x, event.y);
    component.x = event.x;
    component.y = event.y;
  }

  onDialogShow() {
    this.drawBorder();
  }

  configStamp() {
    this.DisplayDialogConfig = true;
  }

  addText() {
    let stampContent = new CBStampContent();
    stampContent.content = this.inputField;
    stampContent.x = 0;
    stampContent.y = 0;
    this.stampContentList.push(stampContent);
  }

  clearText() {
    const overlayCanvas = <HTMLCanvasElement>(
      document.getElementById("fgCanvas")
    );
    const overlayCtx = overlayCanvas.getContext("2d")!;
    overlayCtx.textBaseline = "top";
    const textInput: HTMLInputElement = <HTMLInputElement>(
      document.getElementById("textField")
    );
    const text = textInput!.value;
    overlayCtx.clearRect(
      0,
      0,
      overlayCanvas.width - 6,
      overlayCanvas.height - 6
    );
    overlayCtx.fillStyle = "red";
    overlayCtx.font = "25px THSarabun";
    overlayCtx.fillText(text, 0, 0);
  }

  drawStroke() {
    const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, 800, 300);
  }

  drawContent() {
    const canvas = <HTMLCanvasElement>document.getElementById("fgCanvas");
    const ctx = canvas.getContext("2d")!;
    ctx.textBaseline = "top";
    

    ctx.clearRect(0, 0, 800, 300);
    for (let i in this.stampContentList) {
      ctx.fillStyle = `${this.stampContentList[i].color}`;
      ctx.font = `${this.stampContentList[i].isBold? "bold" : ""} ${this.stampContentList[i].isItalic? "italic" : ""} 36px Arial`;
      let maxWidth = this.getMaxLineWidth(this.stampContentList[i].content, '36px Arial')
      const paragraph = document.getElementById('myParagraph')!;

      // Get the height and width of the <p> element
      const height = paragraph.offsetHeight;
      const width = paragraph.offsetWidth;
      let lines = this.stampContentList[i].content.split('\n').length;
      if(lines > 1){
        this.drawMultilineText(ctx, this.stampContentList[i].content, this.stampContentList[i].x, this.stampContentList[i].y , width, height, 38);
      } else {
        ctx.fillText(this.stampContentList[i].content, this.stampContentList[i].x, this.stampContentList[i].y);
      }
      
      // let lineText = this.stampContentList[i].content.split("\n");
      // for (let j in lineText) {
      //   ctx.fillText(
      //     lineText[j],
      //     this.stampContentList[i].x + 1,
      //     this.stampContentList[i].y + this.safeAreaPadding + Number(j) * 44
      //   );
      // }
    }
  }

  drawMultilineText(ctx: CanvasRenderingContext2D, text: string, areaX: number, areaY: number, areaWidth: number, areaHeight: number, lineHeight: number) {
    const lines = text.split('\n');
    const totalHeight = lines.length * lineHeight;
  
    // Adjust the y-coordinate for center alignment within the specified area
    const startY = areaY + (areaHeight - totalHeight) / 2;
    
    // Draw each line separately within the specified area
    lines.forEach((line, index) => {
      const offsetY = startY + index * lineHeight;
  
      // Calculate the x-coordinate for center alignment within the specified area
      const textWidth = ctx.measureText(line).width;
      const offsetX = areaX + (areaWidth - textWidth) / 2;
  
      // Draw the line within the specified area
      ctx.fillText(line, offsetX, offsetY);
    });
  }

  clearStroke() {
    const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, 800, 300);
  }

  combinedCanvas() {
    this.drawContent();
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = 800;
    combinedCanvas.height = 300;
    const combinedCtx = combinedCanvas.getContext("2d")!;
    const bgCanvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    const fgCanvas = <HTMLCanvasElement>document.getElementById("fgCanvas");
    combinedCtx.drawImage(bgCanvas, 0, 0);
    combinedCtx.drawImage(fgCanvas, 0, 0);
    const dataUrl = combinedCanvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "canvas_image.png";
    setTimeout(() => {
      downloadLink.click();
    }, 2000);
  }

  onClick(event: any) {
    this.isEditable = false;
    const xRelativeToBgCanvas = event.offsetX;
    const yRelativeToBgCanvas = event.offsetY;
    console.log(xRelativeToBgCanvas, yRelativeToBgCanvas);
    if (this.isInsideBgCanvas(event)) {
      this.createInputBox(xRelativeToBgCanvas, yRelativeToBgCanvas);
    } else {
      this.stampContentList.pop();
    }
    console.log(this.isEditable);
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

  createInputBox(x: number, y: number) {
    let stampContent = new CBStampContent();
    stampContent.content = "เพิ่มข้อความ";
    stampContent.x = x;
    stampContent.y = y;
    stampContent.showContent = true;
    stampContent.isBold = false;
    stampContent.isItalic = false;
    this.stampContentList.push(stampContent);
  }

  delete(component: any) {
    this.stampContentList = this.stampContentList.filter(
      (_, i) => i !== component
    );
    console.log(this.stampContentList);
  }
  boldText(component: any) {
    component.isBold = !component.isBold
    console.log(this.stampContentList);
    
  }

  italicText(component: any) {
    component.isItalic = !component.isItalic

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

    return maxWidth;
  }

  onContentChange(event: Event, component: any) {
    const editedContent =
      (event.target as HTMLParagraphElement).innerText || "";
    component.content = editedContent;
    const pElement = event.target as HTMLParagraphElement;
    const newWidth = this.getMaxLineWidth(component.content, "36px Arial");
    pElement.style.width = newWidth + "px";
  }

  saveStamp() {}
}
