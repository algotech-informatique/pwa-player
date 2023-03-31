import { Component, ViewChild, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash';
import { NotificationsService, AuthService, DataService } from '@algotech-ce/angular';
import { NotificationsListComponent } from './notifications-list/notifications-list.component';
import { NotificationDto } from '@algotech-ce/core';

@Component({
    selector: 'at-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

    @Input() mobile = false;
    @Input() classDisplay;

    @ViewChild(NotificationsListComponent) notificationsListComponent: NotificationsListComponent;
    @Output() openNotification = new EventEmitter<NotificationDto>();

    lang = 'fr-FR';
    notificationsOpen = false;
    state: 'all' | 'unread' = 'all';
    notifications: NotificationDto[];

    constructor(
        private authService: AuthService,
        private dataService: DataService,
        public notificationsService: NotificationsService,
    ) {
    }

    ngOnInit() {
        if (this.dataService.mobile && !this.dataService.networkService.offline) {
            this.notificationsService.initialize('mobile');
        }
        this.lang = this.authService.localProfil.preferedLang;
    }

    onClickNotification() {
        this.notificationsOpen = true;
    }

    onClickedOutside(e) {
        const target: any = e.target;
        if (target.id !== 'notification-button') {
            this.notificationsOpen = false;
        }
    }

    onSelectNotification(notification: NotificationDto) {
        const login = this.authService.localProfil.login;
        if (notification.state.read.indexOf(login) === -1) {
            this.notificationsService.patchProperty(notification.uuid, [{
                op: 'add',
                path: '/state/read/[?]',
                value: login
            }
            ]).subscribe(
                () => {
                    notification.state.read = [...notification.state.read, login];
                    this.notificationsService.unread--;
                }
            );
        }
    }

    onOpenNotification(notification: NotificationDto) {
        const login = this.authService.localProfil.login;
        if (!notification.state.execute || notification.state.execute === login) {
            this.notificationsService.patchProperty(notification.uuid, [{
                op: 'replace',
                path: '/state/execute',
                value: login
            }
            ]).subscribe(
                () => {
                    notification.state.execute = login;
                    this.openNotification.emit(notification);
                    this.notificationsOpen = false;
                }
            );
        }
    }

    onEndNotification() {
        this.notificationsService.loadNotifications(this.state).subscribe(() => {
            this.notifications = [].concat(this.notificationsService.notifications);
        });
    }

    onStateClick(state: 'all' | 'unread') {
        this.notificationsService.reset();
        this.notificationsService.loadNotifications(state, true).subscribe(() => {
            this.notifications = [].concat(this.notificationsService.notifications);
        });
        this.state = state;
    }

}
