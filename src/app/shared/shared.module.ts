import { ModalUploadComponent } from './../components/modal-upload/modal-upload.component';
import { PipesModule } from './../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BreadscrumbsComponent } from './breadscrumbs/breadscrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';



@NgModule({
  declarations: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadscrumbsComponent,
    ModalUploadComponent
  ],
  imports:[
    CommonModule,
    RouterModule,
    PipesModule
  ],
  exports: [
    NopagefoundComponent,
    HeaderComponent,
    SidebarComponent,
    BreadscrumbsComponent,
    ModalUploadComponent
  ]
})
export class SharedModule { }
