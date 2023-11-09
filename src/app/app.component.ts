import { Component, NgZone, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import {
    AuthService, SettingsDataService, LoaderService,
    NetworkService, I18nService, DataService, NotificationsService
} from '@algotech-ce/angular';
import {
    WorkflowSyncService,
    ToastService
} from '@algotech-ce/business';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import { NotificationsPushService } from './shared/services';
import moment from 'moment';
import { SwUpdate } from '@angular/service-worker';
import { from, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { mergeMap, tap } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

    lastUpdate = null;

    constructor(
        public dataService: DataService,
        public authService: AuthService,
        public settingsDataService: SettingsDataService,
        private platform: Platform,
        private network: NetworkService,
        protected http: HttpClient,
        private i18nService: I18nService,
        private loader: LoaderService,
        private workflowSyncService: WorkflowSyncService,
        private notificationsPushService: NotificationsPushService,
        private notificationsService: NotificationsService,
        private updates: SwUpdate,
        private toastService: ToastService,
        private translate: TranslateService,
        private zone: NgZone,
    ) {
        this.notificationsPushService.getMessages();
        this.initializeApp();
    }

    synchronize(updateToken = true) {
        if (this.network.offline) {
            return of(null);
        }
        return (!updateToken ? of({}) : this.authService.updateToken()).pipe(
            mergeMap(() => this.authService.isAuthenticated ? this.workflowSyncService.getInstances() : of([])),
            tap((instances) => {
                if (instances.filter((wfi) => wfi.state !== 'running').length === 0) {
                    return;
                }
                this.toastService.presentToast(this.translate.instant('SYNCHRONIZE'), 0);
                this.workflowSyncService.synchronize((err) => {
                    this.toastService.presentToast(err.message, 2000, 'danger');
                }, () => {
                    this.toastService.dismiss();
                });
            })
        );
    }

    update() {
        if (this.network.offline) {
            return;
        }
        if (this.dataService.mobile) {
            this.notificationsPushService.assignToken().subscribe();
        }
        if (this.updates.isEnabled) {
            this.updates.available.subscribe(event => {
                this.updates.activateUpdate().then(() => {

                    this.toastService.presentToast(this.translate.instant('UPDATE-COMPLETED'), 2000);
                    setTimeout(() => {
                        document.location.reload();
                    }, 2000);
                });
            });
            from(this.updates.checkForUpdate()).subscribe();
        }
    }

    initializeApp() {
        this.lastUpdate = moment().toDate().getTime();
        this.network.onConnect.subscribe(() => this.synchronize().subscribe());

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState !== 'visible' || this.network.offline) {
                return;
            }

            const updateToken$ = this.dataService.mobile ? this.authService.updateToken() : of(null);
            updateToken$.subscribe(() => {
                // delay > 1hour : reload
                const reload = +moment().toDate().getTime() > this.lastUpdate + 3600000;
                if (reload) {
                    this.lastUpdate = +moment().toDate().getTime();
                    this.update();
                }

                if (!this.authService.isAuthenticated) {
                    return;
                }

                if (this.dataService.mobile && !this.network.offline) {
                    this.notificationsService.initialize('mobile');
                }
                this.synchronize(false).pipe(
                    mergeMap(() => reload ? this.loader.Initialize() : of(null))
                ).subscribe();
            });
        });

        this.platform.ready().then(() => {
            this.zone.runOutsideAngular(() => {
                this.notificationsPushService.getMessages().subscribe();
                if (!this.network.offline && this.authService.isAuthenticated) {
                    this.notificationsService.initialize(this.dataService.mobile ? 'mobile' : 'web');
                }
                this.synchronize(false).subscribe();
                moment.locale(this.i18nService.language);
            });
        });
    }

    ngOnInit() {
        if (!this.authService.isAuthenticated) {
            return;
        }
        this.update();
    }
}
