import { NotificationsPushService } from '../shared/services/notifications-push/notifications-push.service';
import { FilterNotificationsComponent } from './filter-notifications/filter-notifications.component';
import { PopoverController } from '@ionic/angular';
import { DataService, NotificationsService } from '@algotech-ce/angular';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { WorkflowLaunchService } from '@algotech-ce/business';
import { NotificationDto } from '@algotech-ce/core';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { NotificationsComponent } from '../shared/components/notifications/notifications.component';

@Component({
    selector: 'at-notifications-page',
    templateUrl: './notifications.page.html',
    styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

    @ViewChild(NotificationsComponent) notificationsCmp: NotificationsComponent;
    backButtonAction: any;
    mobile = false;

    constructor(
        private workflowLaunchService: WorkflowLaunchService,
        public notificationsService: NotificationsService,
        private popoverController: PopoverController,
        private notificationsPushService: NotificationsPushService,
        private dataService: DataService,
    ) { }

    ngOnInit(): void {
        this.mobile = this.dataService.mobile;
    }

    ionViewWillEnter() {
        // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT).then(() => {}, (err) => { console.error(err) });
    }

    onOpenNotification(notification: NotificationDto) {
        this.notificationsService.removeNotification(notification.uuid);
        if (notification.action.key === 'workflow') {
            this.workflowLaunchService.launchInstance(notification.action.object);
        }
        if (notification.action.key === 'link') {
            window.open(notification.action.object, '_blank');
        }
    }

    onFilterNotifications(ev: any) {
        const emitter = new EventEmitter<'all' | 'unread'>();
        from(this.popoverController.create({
            component: FilterNotificationsComponent,
            event: ev,
            componentProps: {
                emitter,
                state: this.notificationsPushService.notificationsDisplayState,
            },
        })).pipe(
            mergeMap((popover: HTMLIonPopoverElement) => from(popover.present())),
            mergeMap(() => emitter),
            map((state: 'all' | 'unread') => {
                this.notificationsCmp.onStateClick(state);
                this.popoverController.dismiss();
                this.notificationsPushService.notificationsDisplayState = state;
            }),
        ).subscribe();
    }

}
