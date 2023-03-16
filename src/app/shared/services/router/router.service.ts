import { Router, NavigationExtras, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class RouterService {

    constructor(private router: Router) {
    }

    private buildExtras(extras?: NavigationExtras) {
        if (!extras) {
            extras = {};
        }

        extras.queryParams = extras.queryParams ? extras.queryParams : {};
        extras.queryParams.none = new Date().getTime();
        extras.replaceUrl = true;
        return extras;
    }

    navigate(commands: any[], extras?: NavigationExtras): Promise<boolean> {
        return this.router.navigate(commands, this.buildExtras(extras));
    }

    navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
        return this.router.navigateByUrl(url, this.buildExtras(extras));
    }

    get url() {
        return this.router.url;
    }
}
