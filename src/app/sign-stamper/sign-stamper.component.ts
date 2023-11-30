import { CBImageStamp } from './../Context/CBImageStamp';
import { CommonService } from "./../_services/common.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { HttpConnectService } from "../_services/httpConnectService.service";
import { environment as env } from "../../environments/environment";
import { CBDocumentImage } from "../Context/CBDocumentImage";
import { CBTextStamp } from "../Context/CBTextStamp";
import { CBStamp } from "../Context/CBStamp";
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-sign-stamper",
  templateUrl: "./sign-stamper.component.html",
  styleUrls: ["./sign-stamper.component.scss"],
})
export class SignStamperComponent implements OnInit {
  xPosition: number = 0;
  yPosition: number = 0;
  scaleX: number = 100;
  scaleY: number = 100;
  documentID: string = "";
  _activeIndex: number = 0;
  documentImageList: any[] = [];
  imageStampList: CBImageStamp[] = [];
  textStampList: CBTextStamp[] = [];
  signVisible = false;
  images: any[] = [];
  size: any = null;
  zoom: number = 1.0;
  showImage = false;
  degree: number = 0;
  showGallery = false;
  position: string = "bottom";
  textStamp: string = "";

  organizationStamp: string = '';
  receiveNumber: string = '';

  showFrame = false;
  textValue = "";
  frameTop = 0;
  frameLeft = 0;

  DisplayDialogAddTopic: boolean = false;

  showText = false;

  canvasWidth = 400;
  canvasHeight = 150;

  @ViewChild("imageListContainer") imageListContainer!: ElementRef;
  @ViewChild('myGalleria') galleria!: ElementRef;
  @ViewChild("imgstamp") imgstamp!: ElementRef;

  constructor(
    private httpService: HttpConnectService,
    private commonService: CommonService
  ) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    // this.detectScrolling();
    // this.drawCanvas();
  }

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
   drawMultilineText(text: string, maxWidth: number) {
    const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d')!;
    // Set font
    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = 'black';

    // Split the text into words
    const words = text.split(' ');

    // Initialize variables
    let currentLine = '';
    let lines = [];

    for (const word of words) {
      const testLine = currentLine + word + ' ';
      const { width } = ctx.measureText(testLine);

      if (width < maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      }
    }

    // Add the last line
    lines.push(currentLine.trim());

    // Calculate total text height
    const lineHeight = 25;
    const totalTextHeight = lines.length * lineHeight;

    // Calculate starting y-coordinate for center alignment
    let y = canvas.height / 2 - totalTextHeight / 2;

    // Draw each line at the specified y-coordinate
    lines.forEach(line => {
      // Calculate the x-coordinate for center alignment
      const x = canvas.width / 2 - ctx.measureText(line).width / 2;
      
      ctx.fillText(line, x, y-25);
      y += lineHeight;
    });
  }


  drawStamp(color = "red"): string {
    const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d')!;
    const resolution = window.devicePixelRatio || 1;
    console.log('res',resolution);
    
    let dataUrl = '';
    canvas.width = this.canvasWidth * resolution;
    canvas.height = this.canvasHeight * resolution;
    ctx.scale(resolution, resolution);
    
    
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, this.canvasWidth, this.canvasHeight);
    ctx.fillStyle = 'red';
    this.drawMultilineText("มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตบางเขน ภาควิชาวิศวกรรมคอมพิวเตอร์", this.canvasWidth - 50) 
    ctx.font = '16px Arial';
    ctx.fillStyle = 'red'
    ctx.fillText('เลขที่รับ', 30, 70);
    ctx.fillText('00000', 150, 70);
    ctx.fillText('วันที่รับ', 30, 100);
    ctx.fillText('01 / 01 / 2000', 150, 100);
    ctx.fillText('เวลาที่รับ', 30, 130);
    ctx.fillText('00.00', 150, 130);

    dataUrl = canvas.toDataURL('image');
    const downloadLink = document.createElement("a");
    downloadLink.href = dataUrl;
    downloadLink.download = "canvas_image.png";
    downloadLink.click();
    return dataUrl;
  }

  addStamp() {
    let sign_item = new CBImageStamp();
        sign_item.signContent = this.drawStamp();
        sign_item.signWidth = 400
        sign_item.signHeight = 150
        sign_item.x = this.xPosition;
        sign_item.y = this.yPosition;
        sign_item.pageNumber = this._activeIndex;
        sign_item.documentID = this.documentID;
        sign_item.isVisible = true;
        this.imageStampList.push(sign_item);
  }

  detectScrolling(): void {
    const containerElement: HTMLElement =
      this.imageListContainer.nativeElement();
    containerElement.addEventListener("scroll", () => {
      const visibleIndex = Math.floor(
        containerElement.scrollTop / containerElement.clientHeight
      );
      this._activeIndex = visibleIndex;
      console.log("Visible Image Index:", visibleIndex);
    });
  }

  showTextFrame(event: MouseEvent) {
    this.showFrame = true;
    this.frameTop = event.clientY;
    this.frameLeft = event.clientX;
  }

  calculateWidth(): number {
    return this.textStamp.length * 10;
  }

  calculateHeight(): number {
    const lineHeight = 0.5;
    return this.textStamp.split("\n").length * lineHeight;
  }

  openDialog() {
    this.DisplayDialogAddTopic = true;
  }

  submitDialog() {
    console.log(this.textStamp);
    let text_list = new CBTextStamp();
    text_list.message = this.textStamp;
    text_list.x = this.xPosition;
    text_list.y = this.yPosition;
    text_list.pageNumber = this._activeIndex;
    text_list.documentID = this.documentID;
    text_list.isVisible = true;
    this.textStampList.push(text_list);
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
        let sign_item = new CBImageStamp();
        sign_item.signContent = reader.result!.toString();
        sign_item.signWidth = this.scaleX;
        sign_item.signHeight = this.scaleY;
        sign_item.x = this.xPosition;
        sign_item.y = this.yPosition;
        sign_item.pageNumber = this._activeIndex;
        sign_item.documentID = this.documentID;
        sign_item.isVisible = true;
        this.imageStampList.push(sign_item);
      };
    }
    console.log(this.imageStampList);

    // this.visibleStamp();
  }

  onFileRemove(event: UploadEvent) {
    event.files.pop();
  }

  async stamp() {
    // let payload = new HttpParams().set('requestData', JSON.stringify(this.signImageList)
    let stampList = new CBStamp();
    stampList.documentID = this.documentID;
    stampList.imageStampList = this.imageStampList;
    stampList.textStampList = this.textStampList;
    console.log(stampList);

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

  documentDelete() {
    this.documentImageList = []
  }

  showNextImage() {
    // this._activeIndex++;
    this._activeIndex = (this._activeIndex + 1) % this.documentImageList.length;
    this.visibleImageStamp();
    this.visibleTextStamp();
  }

  showPreviousImage() {
    // this._activeIndex--;
    this._activeIndex = (this._activeIndex - 1 + this.documentImageList.length) % this.documentImageList.length;
    this.visibleImageStamp();
    this.visibleTextStamp();
    // console.log(this.imageStampList.at);
    
  }

  visibleImageStamp() {
    for (let i = 0; i < this.imageStampList.length; i++) {
      if (this.imageStampList.at(i)!.pageNumber === this._activeIndex) {
        this.imageStampList.at(i)!.isVisible = true;
        // imgStamp.style.transform = `translate(${this.imageStampList.at(i)!.x}px, ${this.imageStampList.at(i)!.y}px)`;

      } else {
        this.imageStampList.at(i)!.isVisible = false;
      }
    }
  }

  visibleTextStamp() {
    for (let i = 0; i < this.textStampList.length; i++) {
      if (this.textStampList.at(i)!.pageNumber === this._activeIndex) {
        this.textStampList.at(i)!.isVisible = true;
      } else {
        this.textStampList.at(i)!.isVisible = false;
      }
    }
  }



  onMoveEnd(event: any, component: any) {
    component.x = event.x;
    component.y = event.y;
    console.log(event.x, event.y);
  }

  onResizing(event: any, component: CBImageStamp) {
    this.size = event.size;
    console.log(this.size);
    component.signWidth = event.size.width;
    component.signHeight = event.size.height;
  }

  getInfo(component: any) {
    console.log(component);
  }
}
