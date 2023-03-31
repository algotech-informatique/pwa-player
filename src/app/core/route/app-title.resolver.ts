import { SettingsDataService, TranslateLangDtoService } from '@algotech-ce/angular';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable()
export class AppTitleResolver implements Resolve<string> {
    constructor(
        private translateLangDto: TranslateLangDtoService,
        private settingsDataService: SettingsDataService) { }

    resolve(
        route: ActivatedRouteSnapshot,
    ): Observable<any> | Promise<any> | any {
        const findApp = this.settingsDataService.apps.find((app) => app.key === route.paramMap.get('keyApp'));
        if (!findApp) {
            return of('SETTINGS.WORKFLOWS.APP');
        }
        return of(this.translateLangDto.transform(findApp.displayName));
    }
}
