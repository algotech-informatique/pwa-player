import { DataService } from '@algotech-ce/angular';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { PwaService } from '../../shared/services';

@Injectable()
export class RedirectGuard implements CanActivate {

    constructor(
        private dataService: DataService,
        private router: Router,
        private pwaService: PwaService
    ) { }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        if (this.dataService.mobile && !window.matchMedia('(display-mode: standalone)').matches && !this.pwaService.continueWebsite) {
            this.router.navigate([''], { queryParams: { redirectUrl: state.url }, replaceUrl: true });
        }
        return true;
    }
}
