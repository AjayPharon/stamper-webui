import { TestComponent } from './test/test.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignStamperComponent } from './sign-stamper/sign-stamper.component';
import { TestCodeComponent } from './test-code/test-code.component';

const routes: Routes = [
  {path:'stamper', component:SignStamperComponent},
  {path:'test', component:TestComponent},
  {path:'testcode', component:TestCodeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
