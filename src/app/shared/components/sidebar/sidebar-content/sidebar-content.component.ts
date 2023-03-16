import { Component } from '@angular/core';
import { AuthService, NotificationsService, SettingsDataService } from '@algotech/angular';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { catchError, finalize, mergeMap, tap } from 'rxjs/operators';
import { NotificationsPushService } from 'src/app/shared/services';
import { of, zip } from 'rxjs';

@Component({
    selector: 'app-sidebar-content',
    templateUrl: './sidebar-content.component.html',
    styleUrls: ['./sidebar-content.component.scss'],
})
export class SidebarContentComponent {

    constructor(
        public router: Router,
        public settingsDataService: SettingsDataService,
        public notificationsService: NotificationsService,
        private menuController: MenuController,
        private authService: AuthService,
        private notificationsPushService: NotificationsPushService,
    ) { }

    logout() {
        this.menuController.close();
        this.notificationsPushService.deleteToken().pipe(
            catchError(() => of(null)),
            mergeMap(() => this.authService.logout())
        ).subscribe();
    }

    openRouterLink(route: string) {
        this.router.navigate([route], {replaceUrl: true });
    }
}
