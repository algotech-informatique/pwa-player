import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LaunchPageRoutingModule } from './launch-routing.module';

import { LaunchPage } from './launch.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    LaunchPageRoutingModule
  ],
  declarations: [LaunchPage]
})
export class LaunchPageModule {}
