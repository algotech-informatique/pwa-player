import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'at-notifications-button',
    templateUrl: './notifications-button.component.html',
    styleUrls: ['./notifications-button.component.scss']
})
export class NotificationsButtonComponent {

    @Input() classDisplay = '';
    @Input() unread = 0;
    @Input() unreadMessage;
    @Output() clickNotification = new EventEmitter();

    constructor() {

    }

    onClickNotification() {
        this.clickNotification.emit();
    }

}