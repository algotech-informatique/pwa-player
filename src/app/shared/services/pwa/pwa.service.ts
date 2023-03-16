import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class PwaService {

    deferredPrompt;
    appInstalled;
    browserLaunched;
    continueWebsite;
    installedFromPrompt;

    constructor() { }

    openPWA() {
        const nav: any = window.navigator;
        nav.getInstalledRelatedApps().then((relatedApps) => {

            console.log('relatedApps : ', relatedApps);

            this.appInstalled = relatedApps.length > 0;
            if (this.appInstalled) {
                window.open('./', '_blank');
            }
        });
    }
}
