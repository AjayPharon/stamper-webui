import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { SignStamperComponent } from './sign-stamper/sign-stamper.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TestComponent } from './test/test.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import { CheckboxModule } from 'primeng/checkbox';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TestCodeComponent } from './test-code/test-code.component';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [
    AppComponent,
    SignStamperComponent,
    TestComponent,
    TestCodeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularDraggableModule,
    ButtonModule,
    FileUploadModule,
    GalleriaModule,
    HttpClientModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ScrollingModule,
    CheckboxModule,
    DragDropModule,
    ColorPickerModule,
    FontAwesomeModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
