import { AuthService, DataService, SettingsDataService } from '@algotech/angular';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PwaService } from '../shared/services';

@Component({
    selector: 'app-launch',
    templateUrl: './launch.page.html',
    styleUrls: ['./launch.page.scss'],
})
export class LaunchPage {

    openButtonDisabled = true;
    display = false;
    pwaLaunch = false;

    constructor(
        private authService: AuthService,
        private settingsDataService: SettingsDataService,
        public dataService: DataService,
        private router: Router,
        private route: ActivatedRoute,
        public pwaService: PwaService,
    ) {
        if (this.dataService.mobile) {

            // Launched directly from App icons ?
            if (window.matchMedia('(display-mode: standalone)').matches) {
                console.log('Launched from App', window.matchMedia('(display-mode: standalone)'));
                pwaService.browserLaunched = false;
                pwaService.appInstalled = true;
                this.redirection();
                // set a variable to be used when calling something
                // e.g. call Google Analytics to track standalone use
            } else {

                const pwaLaunch = localStorage.getItem('pwaLaunch');
                switch(pwaLaunch) {
                    case 'app':
                        this.openPWA();
                        break;
                    case 'browser':
                        this.continueWebsite();
                        break;
                }

                this.display = true;
                pwaService.appInstalled = !pwaService.deferredPrompt;
                if (pwaService.appInstalled) {
                    this.openButtonDisabled = false;
                }
                pwaService.browserLaunched = true;
                console.log('Launched from browser');
            }
        } else {
            this.continueWebsite();
        }
    }

    redirection() {
        if (this.authService.isAuthenticated) {
            let defaultWeb: string;
            for (const group of this.authService.localProfil.groups) {
                for (const grp of this.settingsDataService.groups) {

                    if (this.dataService.mobile) {
                        if (grp.key === group && grp.application.default.mobile.length > 0) {
                            defaultWeb = grp.application.default.mobile === 'plan' ? '/home' : `/app/${grp.application.default.mobile}`;
                            break;
                        }
                    } else {
                        if (grp.key === group && grp.application.default.web.length > 0) {
                            defaultWeb = grp.application.default.web === 'plan' ? '/home' : `/app/${grp.application.default.web}`;
                            break;
                        }
                    }
                }
                if (defaultWeb) { break; }
            }
            defaultWeb = defaultWeb || '/home';

            const redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl');
            this.router.navigateByUrl(redirectUrl ? redirectUrl : defaultWeb);
        }
    }

    continueWebsite() {
        console.log('Continue on website');
        this.pwaService.continueWebsite = true;
        if (this.pwaLaunch) {
            localStorage.setItem('pwaLaunch','browser');
        }
        this.redirection();
    }

    openPWA() {
        console.log('Open PWA');
        if (this.pwaLaunch) {
            localStorage.setItem('pwaLaunch','app');
        }
        this.pwaService.openPWA();
    }

    showInstallBanner() {
        console.log('deferredPrompt', this.pwaService.deferredPrompt);
        if (this.pwaService.deferredPrompt !== undefined && this.pwaService.deferredPrompt !== null) {
            // Show the prompt
            this.pwaService.deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            this.pwaService.deferredPrompt.userChoice
                .then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the A2HS prompt');
                    } else {
                        console.log('User dismissed the A2HS prompt');
                    }

                    setTimeout(() => {
                        this.openButtonDisabled = false;
                    }, 5000);
                    // We no longer need the prompt.  Clear it up.
                    this.pwaService.deferredPrompt = null;
                });
        }
    }

}
