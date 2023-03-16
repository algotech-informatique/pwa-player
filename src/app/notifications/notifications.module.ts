import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NotificationsPage } from './notifications.page';
import { IonicModule } from '@ionic/angular';
import { FilterNotificationsComponent } from './filter-notifications/filter-notifications.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: NotificationsPage
    }
];

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        TranslateModule,
    ],
    declarations: [
        NotificationsPage,
        FilterNotificationsComponent,
    ],
    exports: [],
})
export class NotificationsPageModule { }
