import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LaunchPage } from './launch.page';

const routes: Routes = [
  {
    path: '',
    component: LaunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LaunchPageRoutingModule {}
