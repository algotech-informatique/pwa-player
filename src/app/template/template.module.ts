import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ResponsiveModule } from 'ngx-responsive';
import { TemplatePage } from './template.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    IonicModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ResponsiveModule.forRoot(),
  ],
  declarations: [TemplatePage],
})
export class TemplateModule { }
