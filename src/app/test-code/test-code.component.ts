import { Component } from "@angular/core";
import { CBImageStamp } from "../Context/CBImageStamp";
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-test-code",
  templateUrl: "./test-code.component.html",
  styleUrls: ["./test-code.component.scss"],
})
export class TestCodeComponent {
  imageStampList: CBImageStamp[] = [];
  ngAfterViewInit(): void {
    const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d")!;
    var text = 'ข้อความทดสอบ 1\nข้อความทดสอบ 2\nข้อความทดสอบ 3\nข้อความทดสอบ 4\nข้อความทดสอบ 5'
    this.drawImg(ctx);
    var lines = text.split('\n');

ctx.font = "20px Arial";
ctx.fillStyle = "black";

for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], 100, 100 + i * 25); // Adjust the vertical spacing as needed
}
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    // this.drawStroke();
    // this.drawImg();
  }
  drawStroke(ctx:CanvasRenderingContext2D) {
    // const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    // const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3;
    ctx.fillStyle="white"
    ctx.fillRect(0, 0, 800, 300);
  }

  drawImg(ctx:CanvasRenderingContext2D) {
    // const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    // const ctx = canvas.getContext("2d")!;
    var img = new Image();
    img.src = "https://cdn.freebiesupply.com/images/thumbs/2x/apple-logo.png";
    img.onload = function () {
      ctx.drawImage(img, 0, 0, 100, 100);
    };

    

  }

  onFileSelect(event: UploadEvent) {
    const reader = new FileReader();
    for (let file of event.files) {
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        let sign_item = new CBImageStamp();
        sign_item.signContent = reader.result!.toString();
        sign_item.signWidth = 100;
        sign_item.signHeight = 100;
        sign_item.x = 0;
        sign_item.y = 0;
        this.imageStampList.push(sign_item);
        
      };
    }
  }
  draw() {
    const canvas = <HTMLCanvasElement>document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d")!;
    // this.drawStroke(ctx);
    // this.drawImg(ctx);

    const dataUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "canvas_image.png";
    setTimeout(() => {
      downloadLink.click();
    }, 1000);
  }

  // calculateHeight(): number {
  //   const lineHeight = 0.5;
  //   return this.textStamp.split("\n").length * lineHeight;
  // }

  // calculateWidth(): number {
  //   return this.textStamp.length * 10;
  // }

  // drawMultilineText(text: string, maxWidth: number) {
  //   const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
  //   const ctx = canvas.getContext('2d')!;
  //   // Set font
  //   ctx.font = '16px THSarabun';
  //   // ctx.textAlign = 'center';
  //   ctx.fillStyle = 'black';

  //   // Split the text into words
  //   const words = text.split(' ');

  //   // Initialize variables
  //   let currentLine = '';
  //   let lines = [];

  //   for (const word of words) {
  //     const testLine = currentLine + word + ' ';
  //     const { width } = ctx.measureText(testLine);

  //     if (width < maxWidth) {
  //       currentLine = testLine;
  //     } else {
  //       lines.push(currentLine.trim());
  //       currentLine = word + ' ';
  //     }
  //   }

  //   // Add the last line
  //   lines.push(currentLine.trim());

  //   // Draw each line at the specified y-coordinate
  //   const lineHeight = 20;
  //   let y = this.canvasHeight / 2 - (lines.length * lineHeight) / 2;

  //   lines.forEach((line) => {
  //     ctx.textAlign = 'center';
  //     ctx.fillText(line, this.canvasHeight / 2, y-30);
  //     y += lineHeight;
  //   });
  // }
  // drawMultilineText(text: string, maxWidth: number) {
  //     const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
  //     const ctx = canvas.getContext('2d')!;
  //     ctx.font = 'bold 18px Arial';
  //     ctx.fillStyle = 'black';
  //     const words = text.split(' ');
  //     let currentLine = '';
  //     let lines = [];
  //     for (const word of words) {
  //         const testLine = currentLine + word + ' ';
  //         const {width} = ctx.measureText(testLine);
  //
  //         if (width < maxWidth) {
  //             currentLine = testLine;
  //         } else {
  //             lines.push(currentLine.trim());
  //             currentLine = word + ' ';
  //         }
  //     }
  //     lines.push(currentLine.trim());
  //     const lineHeight = 25;
  //     const totalTextHeight = lines.length * lineHeight;
  //     let y = canvas.height / 2 - totalTextHeight / 2;
  //     lines.forEach(line => {
  //         const x = canvas.width / 2 - ctx.measureText(line).width / 2;
  //         ctx.fillText(line, x, y - 25);
  //         y += lineHeight;
  //     });
  // }

  // drawStamp(color = "red"): string {
  //     const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
  //     const ctx = canvas.getContext('2d')!;
  //     const resolution = window.devicePixelRatio || 1;
  //     console.log('res', resolution);
  //
  //     let dataUrl = '';
  //     canvas.width = this.canvasWidth * resolution;
  //     canvas.height = this.canvasHeight * resolution;
  //     ctx.scale(resolution, resolution);
  //
  //
  //     ctx.strokeStyle = 'red';
  //     ctx.lineWidth = 5;
  //     ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
  //     ctx.fillStyle = 'red';
  //     this.drawMultilineText("มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตบางเขน ภาควิชาวิศวกรรมคอมพิวเตอร์", this.canvasWidth - 50)
  //     ctx.font = '16px Arial';
  //     ctx.fillStyle = 'red'
  //     ctx.fillText('เลขที่รับ', 30, 70);
  //     ctx.fillText('00000', 150, 70);
  //     ctx.fillText('วันที่รับ', 30, 100);
  //     ctx.fillText('01 / 01 / 2000', 150, 100);
  //     ctx.fillText('เวลาที่รับ', 30, 130);
  //     ctx.fillText('00.00', 150, 130);
  //
  //     dataUrl = canvas.toDataURL('image');
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = dataUrl;
  //     downloadLink.download = "canvas_image.png";
  //     downloadLink.click();
  //     return dataUrl;
  // }

  // addStamp() {
  //     let sign_item = new CBImageStamp();
  //     sign_item.signContent = this.drawStamp();
  //     sign_item.signWidth = 400
  //     sign_item.signHeight = 150
  //     sign_item.x = this.xPosition;
  //     sign_item.y = this.yPosition;
  //     sign_item.pageNumber = this._activeIndex;
  //     sign_item.documentID = this.documentID;
  //     sign_item.isVisible = true;
  //     this.imageStampList.push(sign_item);
  // }

  // detectScrolling(): void {
  //   const containerElement: HTMLElement =
  //       this.imageListContainer.nativeElement();
  //   containerElement.addEventListener("scroll", () => {
  //     const visibleIndex = Math.floor(
  //         containerElement.scrollTop / containerElement.clientHeight
  //     );
  //     this._activeIndex = visibleIndex;
  //     console.log("Visible Image Index:", visibleIndex);
  //   });
  // }

  // async drawBG(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): Promise<void> {
  //   return new Promise<void>((resolve) => {
  //     const img = new Image();
  //     img.src = canvas.toDataURL(); // Assuming canvas is the source canvas
  //
  //     img.onload = () => {
  //       ctx.drawImage(img, 0, 0);
  //       resolve();
  //     };
  //   });
  // }

  // clearText() {
  //   const overlayCanvas = <HTMLCanvasElement>(
  //     document.getElementById("fgCanvas")
  //   );
  //   const overlayCtx = overlayCanvas.getContext("2d")!;
  //   overlayCtx.textBaseline = "top";
  //   const textInput: HTMLInputElement = <HTMLInputElement>(
  //     document.getElementById("textField")
  //   );
  //   const text = textInput!.value;
  //   overlayCtx.clearRect(
  //     0,
  //     0,
  //     overlayCanvas.width - 6,
  //     overlayCanvas.height - 6
  //   );
  //   overlayCtx.fillStyle = "red";
  //   overlayCtx.font = "25px THSarabun";
  //   overlayCtx.fillText(text, 0, 0);
  // }

  // onFocus(elementId: string, content: string) {
  //   if (content.length === 0) {
  //     document.getElementById(elementId)!.innerText = "";
  //   }
  // }
  //
  // onBlur(elementId: string, content: any) {
  //   if (elementId === "labelStamp") {
  //     if (content.label.length === 0) {
  //       document.getElementById(elementId)!.innerText = "เพิ่มหัวข้อ";
  //     }
  //   }
  //   if (elementId === "contentStamp" || elementId === "textStamp") {
  //     if (content.content.length === 0) {
  //       document.getElementById(elementId)!.innerText = "เพิ่มข้อความ";
  //     }
  //   }
  //   content.showEdit = false;
  //   content.showTools = false;
  // }
}
