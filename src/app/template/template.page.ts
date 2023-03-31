import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    AuthService, applications, Application, SocketManager,
    TranslateLangDtoService, SettingsDataService,
    DataService,
    NotificationsService,
    NetworkService,
} from '@algotech-ce/angular';
import { WsUserDto, NotificationDto, ApplicationModelDto, GroupDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { SysUtilsService, WorkflowLaunchService } from '@algotech-ce/business';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-template',
    templateUrl: 'template.page.html',
    styleUrls: ['template.page.scss'],
})
export class TemplatePage implements OnInit {

    authorizedApplications: Application[];
    currentApp: Application;
    wsUsers: WsUserDto[] = [];
    wsCurrentUser: WsUserDto;
    workflowInstance: string = null;
    displayBoutonApps = true;
    hiddenBar = false;
    mobile = false;

    constructor(
        private authService: AuthService,
        private socketManager: SocketManager,
        private workflowLaunchService: WorkflowLaunchService,
        private translateLangDtoService: TranslateLangDtoService,
        private settingsDataService: SettingsDataService,
        private route: ActivatedRoute,
        private dataService: DataService,
        private sysUtilsService: SysUtilsService,
        private notificationsService: NotificationsService,
        private network: NetworkService,
        private ref: ChangeDetectorRef,
    ) {
        this.initializeAppSelector();
    }

    ngOnInit() {
        const keyApp: string = this.route.snapshot.paramMap.get('keyApp');
        if (keyApp) {
            const app: ApplicationModelDto = _.find(this.settingsDataService.apps, { key: keyApp });
            this.hiddenBar = app?.snApp?.custom?.hiddenBar;
        }

        this.mobile = this.dataService.mobile;

        this.wsUsers = this.socketManager.getUniqueUsers(); // initialize
        this.socketManager.uniqueUsers.subscribe(users => {
            // on update ... don't replace instance
            this.wsUsers.splice(0, this.wsUsers.length);
            this.wsUsers.push(...users);
        });

        this.wsCurrentUser = {
            firstName: this.authService.localProfil.firstName,
            lastName: this.authService.localProfil.lastName,
            email: this.authService.localProfil.email,
            pictureUrl: this.authService.localProfil.pictureUrl,
            uuid: this.authService.localProfil.id,
            color: -1,
            focus: null
        };

        this.workflowLaunchService.setCurrentUser();

        this.ref.detectChanges();

        if (!this.dataService.mobile) {
            this.socketManager.start(null, environment.production);
        }
    }

    initializeAppSelector() {
        this.currentApp = applications.find(app => app.id === this.authService.appId);

        this.authorizedApplications = _.orderBy(
            _.uniqBy(
                _.flatten(
                    this.authService.localProfil.groups
                        .map((groupKey: string) => _.find(this.settingsDataService.groups, { key: groupKey }))
                        .map((group: GroupDto) => _.reduce(group?.application?.authorized, (res: any[], appKey: string) => {
                            const app: ApplicationModelDto = _.find(this.settingsDataService.apps, { key: appKey });
                            if (app?.environment === 'web') {
                                res.push({
                                    applicationUrl: `/app/${app.key}`,
                                    key: app.key,
                                    category: 'Apps',
                                    groups: app.snApp.securityGroups,
                                    id: app.uuid,
                                    icon: app.snApp.icon,
                                    name: this.translateLangDtoService.transform(app.displayName),
                                });
                            }
                            return res;
                        }, []))
                ),
                'key'),
            'name'
        );

        this.displayBoutonApps = this.authorizedApplications.length > 1;
    }

    openNotification(notification: NotificationDto) {
        if (notification.action.key === 'workflow') {
            this.workflowLaunchService.launchInstance(notification.action.object);
        }
        if (notification.action.key === 'link') {
            window.open(notification.action.object, '_blank');
        }
    }
}
