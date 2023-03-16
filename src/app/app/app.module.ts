import { NgModule } from '@angular/core';
import { AppPreviewComponent, AppPreviewModule } from '@algotech/business';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        component: AppPreviewComponent,
    },
];

@NgModule({
    imports: [
        AppPreviewModule,
        RouterModule.forChild(routes),
    ]
})
export class AppPageModule { }
