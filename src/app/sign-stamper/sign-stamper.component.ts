import { CommonService } from './../_services/common.service';
import { Component, OnInit } from '@angular/core';
import { CBImageStamp } from '../Context/CBImageStamp';
import { HttpParams } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { HttpConnectService } from '../_services/httpConnectService.service';
import { environment as env } from '../../environments/environment';
import { CBDocumentImage } from '../Context/CBDocumentImage';
import { CBTextStamp } from '../Context/CBTextStamp';
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-sign-stamper',
  templateUrl: './sign-stamper.component.html',
  styleUrls: ['./sign-stamper.component.scss']
})

export class SignStamperComponent implements OnInit {
  xPosition: number = 0;
  yPosition: number = 0;
  scaleX: number = 100;
  scaleY: number = 100;
  documentID: string = "";
  _activeIndex: number = 0;
  documentImageList: any[] = [];
  imageStampList: CBImageStamp[] = []
  textStampList: CBTextStamp[] = []
  signVisible = false;
  images: any[] = [];
  size: any = null;
  zoom: number = 1.0;
  showImage = false;
  degree: number = 0;
  showGallery = false;
  position: string = 'bottom';
  textStamp: string = '';

  showFrame = false;
  textValue = '';
  frameTop = 0;
  frameLeft = 0;

  
  DisplayDialogAddTopic: boolean = false;

  showText = false;

  constructor(   
    private httpService: HttpConnectService,
    private commonService : CommonService) { }

    showTextFrame(event: MouseEvent) {
      this.showFrame = true;
      this.frameTop = event.clientY;
      this.frameLeft = event.clientX;
    }

    calculateWidth(): number {
      // คำนวณความกว้างของ textarea จากความยาวของข้อความที่กรอก
      return this.textStamp.length * 10; // ปรับตัวคูณตามความต้องการ
    }
  
    calculateHeight(): number {
      // คำนวณความสูงของ textarea จากความยาวของข้อความที่กรอก
      const lineHeight = 0.5; // ปรับตัวคูณตามความต้องการ
      return this.textStamp.split('\n').length * lineHeight;
    }

    openDialog() {
      this.DisplayDialogAddTopic = true;
    }

    submitDialog() {
      console.log(this.textStamp);
      let text_list = new CBTextStamp();
      text_list.message = this.textStamp
      text_list.x = this.xPosition;
      text_list.y = this.yPosition;
      text_list.pageNumber = this._activeIndex;
      text_list.documentID = this.documentID;
      this.textStampList.push(text_list);
      this.textStamp = '';
      this.showText = true
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
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];
  ngOnInit() {

  }
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
        sign_item.textStamp =  this.textStamp;
        this.imageStampList.push(sign_item);
      }
    }
    console.log(this.imageStampList);

    this.signVisible = true;
  }

  onFileRemove(event: UploadEvent) {
    event.files.pop();
  }

  async stamp() {
    console.log(this.imageStampList);
    // let payload = new HttpParams().set('requestData', JSON.stringify(this.signImageList)
    let response = await lastValueFrom(this.httpService.ConnectByPOST_JSON(`${env.localhost}/stamper/stampDocument`, this.imageStampList));
    if (response != null) {
      console.log('image edited');
    }
  }
  documentUpload(event: UploadEvent) {
    const reader = new FileReader();
    for (let file of event.files) {
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        this.upload(file,100);
        // let document_item = new CBDocumentImage();
        // document_item.fileContent = reader.result!.toString();
        // document_item.scaleX = this.scaleX;
        // document_item.scaleY = this.scaleY;
        // document_item.xPosition = this.xPosition;
        // document_item.yPosition = this.yPosition;
        // document_item.imageId = this.li_CBImage[this.activeIndex].id
        // this.documentImageList.push(document_item);
      }
    }

  }

  async upload(file: File, ai_letterType: number){
    const methodName = "multiupload";
    console.log("START " + methodName);
    let urlPath: string = env.localhost + "/stamper/convert";
    let formData = new FormData();
    formData.append('file', file);
    formData.append('filename',file.name)
    formData.append('letterType', ai_letterType.toString());
    console.log("ทดสอบ",formData.getAll('file'));
    try {
        const response = await this.httpService.ConnectByPOSTFormData(urlPath, formData).toPromise();
        console.log("Upload response:", response);
        let documentCB = new CBDocumentImage(this.commonService);
        documentCB.JSONToCB(response);
        this.documentID = documentCB.documentID;
        this.documentImageList = documentCB.imageBase64;
        console.log('id' , this.documentID);
        
    } catch (error) {
        console.error("Upload error:", error);
    }
  }

  showNextImage() {
    this._activeIndex++;
    // this.currentImageIndex = (this.currentImageIndex + 1) % this.li_CBScanImage.length;

    // for (let i = 0; i < this.documentImageList.length; i++) {
    //   console.log('image id: ',this.documentImageList.at(i)['imageId']);
    //   console.log('image index: ',this.activeIndex);
    //   if (this.documentImageList.at(this.activeIndex) === this.documentImageList.at(i)) {
    //     this.signVisible = true;
    //   } else {
    //     this.signVisible = false;
    //   }
    // }
  }

  showPreviousImage() {
    this._activeIndex--;
    // this.currentImageIndex = (this.currentImageIndex - 1 + this.li_CBScanImage.length) % this.li_CBScanImage.length;
    // for (let i = 0; i < this.documentImageList.length; i++) {
    //   console.log('image id: ',this.documentImageList.at(i)['imageId']);
    //   console.log('image index: ',this.activeIndex);
    //   if (this.documentImageList.at(this.activeIndex) === this.documentImageList.at(i)) {
    //     this.signVisible = true;
    //     console.log(this.documentImageList.at(i));


    //   } else {
    //     this.signVisible = false;
    //   }
    // }
  }

  clickComponent(component: CBImageStamp) {
    console.log('click', component);
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
}
