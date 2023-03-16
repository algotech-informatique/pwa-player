import { NavParams } from '@ionic/angular';
import { Component, EventEmitter } from '@angular/core';

@Component({
    selector: 'filter-notifications',
    template: `
        <ion-list lines="none">
            <ion-radio-group [value]="state">
                <ion-item (click)="select('all')">
                    <ion-label>
                        {{'NOTIFICATIONS.ALL' | translate}}
                    </ion-label>
                    <ion-radio slot="start" value="all"></ion-radio>
                </ion-item>
                <ion-item (click)="select('unread')">
                    <ion-label>
                        {{'NOTIFICATIONS.UNREAD' | translate}}
                    </ion-label>
                    <ion-radio slot="start" value="unread"></ion-radio>
                </ion-item>
            </ion-radio-group>
        </ion-list>
    `,
})
export class FilterNotificationsComponent {

    state: 'all' | 'unread' = 'all';
    emitter: EventEmitter<'all' | 'unread'>;

    constructor(
        private navParams: NavParams,
    ) {
        this.emitter = navParams.data.emitter;
        this.state = navParams.data.state;
    }

    select(state: 'all' | 'unread') {
        this.emitter.emit(state);
    }

}