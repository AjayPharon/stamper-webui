import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignStamperComponent } from './sign-stamper/sign-stamper.component';

const routes: Routes = [
  {path:'stamper', component:SignStamperComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
