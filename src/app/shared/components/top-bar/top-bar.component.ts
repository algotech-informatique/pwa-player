import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { WsUserDto, NotificationDto } from '@algotech/core';
import { Application, AuthService, DataService, NotificationsService, SocketManager } from '@algotech/angular';
import { ActivatedRoute, Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuController } from '@ionic/angular';

@Component({
    selector: 'at-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TopBarComponent implements OnInit {

    @Input() authorizedApplications: Application[];
    @Input() currentApplication: Application;
    @Input() wsCurrentUser: WsUserDto;
    @Input() wsUsers: WsUserDto[] = [];
    @Input() displayBoutonApps = true;
    @Input() displayNotifications = true;
    @Input() hiddenBar = false;
    @Input() notificationsPage = false;
    @Output() ongletClicked = new EventEmitter<string>();
    @Output() openNotification = new EventEmitter<NotificationDto>();

    ongletsProfileSelector = [];
    menuAppsOpen = false;
    menuProfileOpen = false;
    menuOnlineOpen = false;
    loadingPage = false;

    title;

    constructor(
        public dataService: DataService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private socketManager: SocketManager,
        private translateService: TranslateService,
        private menuController: MenuController,
        public notificationsService: NotificationsService,
    ) {
        this.activatedRoute.data.subscribe((data) => {
            if (data.title) {
                this.title = this.translateService.instant(data?.title);
            } else {
                this.title = '';
            }
        });

        this.router.events.subscribe((event: Event) => {
            switch (true) {
                case event instanceof NavigationStart: {
                  this.loadingPage = true;
                  break;
                }
                case event instanceof NavigationEnd:
                case event instanceof NavigationCancel:
                case event instanceof NavigationError: {
                  this.loadingPage = false;
                  break;
                }
                default: {
                  break;
                }
              }
        });
    }

    ngOnInit() {
    }

    openOnlineMenu() {
        this.menuAppsOpen = false;
        this.menuProfileOpen = false;
        this.menuOnlineOpen = !this.menuOnlineOpen;
    }

    openAppMenu() {
        this.menuAppsOpen = !this.menuAppsOpen;
        this.menuProfileOpen = false;
        this.menuOnlineOpen = false;
    }

    openMenu() {
        this.menuController.open();
    }

    openProfilMenu() {
        this.menuAppsOpen = false;
        this.menuProfileOpen = !this.menuProfileOpen;
        this.menuOnlineOpen = false;
    }

    onClickedOutside(e) {
        const target: any = e.target;
        if (target.id !== 'boutonApps' && target.id !== 'avatar' && target.id !== 'boutonOnline') {
            this.menuAppsOpen = false;
            this.menuProfileOpen = false;
            this.menuOnlineOpen = false;
        }
    }

    ongletClick(ongletID: string) {
        switch (ongletID) {
            case 'logout': {
                this.socketManager.close();
                this.authService.logout().subscribe();
                break;
            }
            default: {
                this.ongletClicked.emit(ongletID);
            }
        }
    }

    onOpenDefault() {
        this.router.navigate([''], { replaceUrl: true });
    }

    onOpenNotification(notification: NotificationDto) {
        this.openNotification.emit(notification);
    }

    selectApp() {
        this.menuAppsOpen = false;
    }

}
