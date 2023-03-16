import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from '@algotech/angular';

@Injectable()
export class SAdminGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService) { }

    canActivate(route, state): boolean {
        if (this.authService.isAuthenticated && this.authService.localProfil.groups.indexOf('sadmin') !== -1) {
            return true;
        } else {
            this.router.navigate(['/'], { replaceUrl: true });
            return false;
        }
    }
}
