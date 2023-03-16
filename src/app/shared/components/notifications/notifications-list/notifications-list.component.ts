import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { NotificationDto } from '@algotech/core';
import { AuthService } from '@algotech/angular';

@Component({
    selector: 'at-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss'],
})
export class NotificationsListComponent implements OnInit, OnChanges {

    @Input()
    mobile = false;
    @Input()
    notifications: NotificationDto[];
    @Input()
    lang: string;
    @Input()
    unreadFullMessage = '';
    @Input()
    state: 'all' | 'unread' = 'all';

    @Output()
    selectNotification = new EventEmitter<NotificationDto>();
    @Output()
    openNotification = new EventEmitter<NotificationDto>();
    @Output()
    endNotification = new EventEmitter();
    @Output()
    stateClick = new EventEmitter<'all' | 'unread'>();

    login = '';
    event;

    constructor(private authService: AuthService) { }

    ngOnInit() {
        this.login = this.authService.localProfil.login;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.notifications && this.mobile) {
            this.event?.target?.complete();
        }
    }

    doInfiniteWeb(event) {
        if (!this.mobile && (event.target.offsetHeight + event.target.scrollTop) >= event.target.scrollHeight) {
            this.endNotification.emit();
        }
    }

    doInfiniteMobile(event) {
        if (this.mobile) {
            this.event = event;
            this.endNotification.emit();
        }
    }

    onSelectNotification(notification: NotificationDto) {
        this.selectNotification.emit(notification);
    }

    onContinue(notification: NotificationDto) {
        this.openNotification.emit(notification);
    }

    onChangeState(state: 'all' | 'unread') {
        this.stateClick.emit(state);
    }

}
