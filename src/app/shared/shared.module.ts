import { ModuleWithProviders, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsersService, PipesModule, DirectivesModule, DocumentsService
} from '@algotech/angular';
import { ToastService, WorkflowSyncModule } from '@algotech/business';
import { PipesModule as PlayerPipesModules } from './pipes/pipes.module';
import { MessageService, NotificationsPushService,
    PwaService,
    RouterService } from './services';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { AppSelectorComponent } from './components/top-bar/app-selector/app-selector.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NotificationsListComponent } from './components/notifications/notifications-list/notifications-list.component';
import { NotificationsButtonComponent } from './components/notifications/notifications-button/notifications-button.component';
import { SidebarHeaderComponent } from './components/sidebar/sidebar-header/sidebar-header.component';
import { SidebarContentComponent } from './components/sidebar/sidebar-content/sidebar-content.component';
import { AvatarSelectorComponent } from './components/top-bar/avatar-selector/avatar-selector.component';
import { NotificationsCardComponent } from './components/notifications/notifications-card/notifications-card.component';
import { ProfileSelectorComponent } from './components/top-bar/profile-selector/profile-selector.component';

@NgModule({
    declarations: [
        AppSelectorComponent,
        AvatarSelectorComponent,
        ProfileSelectorComponent,
        TopBarComponent,
        AvatarComponent,
        NotificationsComponent,
        NotificationsListComponent,
        NotificationsButtonComponent,
        NotificationsCardComponent,
        SidebarHeaderComponent,
        SidebarContentComponent,
    ],
    imports: [
        CommonModule,
        TranslateModule,
        HttpClientModule,
        IonicModule,
        DirectivesModule,
        WorkflowSyncModule.forRoot(),
        PlayerPipesModules,
        PipesModule,
    ],
    exports: [
        TopBarComponent,
        AvatarComponent,
        NotificationsComponent,
        SidebarHeaderComponent,
        SidebarContentComponent,
        TranslateModule,
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule,
        DirectivesModule,
        PlayerPipesModules,
    ],
})
export class SharedModule {
    public static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                MessageService,
                NotificationsPushService,
                RouterService,
                ToastService,
                UsersService,
                DocumentsService,
                PwaService,
            ]
        };
    }
}
