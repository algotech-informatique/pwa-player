import { AuthService } from '@algotech-ce/angular';
import { ApplicationModelDto, GroupDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({ name: 'buildApps' })
export class BuildAppsPipe implements PipeTransform {

    constructor(
        private authService: AuthService,
    ) { }

    transform(applications: ApplicationModelDto[], groups: GroupDto[]): any[] {
        if (!applications) {
            return [];
        }

        return _.orderBy(
            _.uniqBy(
                _.flatten(this.authService.localProfil.groups
                    .map((groupKey: string) => _.find(groups, { key: groupKey }))
                    .map((group: GroupDto) => _.reduce(group?.application?.authorized, (res: any[], appKey: string) => {
                        const app: ApplicationModelDto = _.find(applications, { key: appKey });
                        if (app?.environment === 'mobile') {
                            res.push({
                                url: `/app/${app.key}`,
                                icon: app.snApp.icon,
                                title: app.displayName,
                            });
                        }
                        return res;
                    }, [])
                    ),
                ),
                'url'
            ),
            'title'
        );
    }
}
