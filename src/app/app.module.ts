import { APP_INITIALIZER, ErrorHandler, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import moment from 'moment';
import { catchError, mergeMap, tap, timeout } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';
import {
    AuthService, AuthModule, EnvService,
    ATAngularModule, I18nService, LoaderService, DataService,
} from '@algotech-ce/angular';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import {
    AppPreviewModule, WorkflowContainerModule, ThemeEngloberModule
} from '@algotech-ce/business';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './core/core.module';
import * as Sentry from '@sentry/browser';
import { MyErrorHandler } from './core/error.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { APP_BASE_HREF, CommonModule, PlatformLocation } from '@angular/common';
import { TemplateModule } from './template/template.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { KeycloakAngularModule } from 'keycloak-angular';
import { PwaService } from './shared/services/pwa/pwa.service';
import { DocxTemplaterModulesService } from '@algotech-ce/business';
import { DocxTemplaterService } from './shared/services/docx-templater/docx-templater.service';

// Initialise l'authentification en phase amont, avant de passer dans les guards
export const authInitialize = (
    env: EnvService,
    authService: AuthService,
    injector: Injector,
    i18nService: I18nService,
    translateService: TranslateService,
    pwaService: PwaService,
    appBaseRef: string,
) => async () => {
    env.initialize(environment);
    const dataService = injector.get(DataService); // create instance

    i18nService.init(environment.defaultLanguage, environment.supportedLanguages);
    moment.locale(i18nService.language);

    /* if (environment.production) {
        Sentry.init({
            dsn: 'https://4954d20371a243c9b3a54d5c2a41e4b2@sentry.myalgotech.io/12',
        });
    } */

    return await new Promise((resolve) => {
        new Observable((observer) => {
            // app installed ?
            window.addEventListener('beforeinstallprompt', (event) => {
                pwaService.appInstalled = false;
                // Prevent the mini-infobar from appearing on mobile.
                event.preventDefault();
                console.log('App not installed', '(beforeinstallprompt)', '👎', event);
                // Stash the event so it can be triggered later.
                pwaService.deferredPrompt = event;
                observer.next(true);
                observer.complete();
            });
            window.addEventListener('appinstalled', (event) => {
                // pwaService.appInstalled = true;
                pwaService.installedFromPrompt = true;
                console.log('App installed', '👍', event);
                // Clear the deferredPrompt so it can be garbage collected
                pwaService.deferredPrompt = null;
            });
        }).pipe(
            timeout(3000),
            catchError((err) => of(null)),
            mergeMap(() =>
                authService.initialize('pwa-player', window.location.origin + appBaseRef, environment.KC_URL, dataService.mobile)),
            mergeMap(() => {
                if (authService.isAuthenticated) {
                    Sentry.configureScope((scope) => {
                        scope.setUser(authService.localProfil);
                    });
                    return injector.get(LoaderService).Initialize().pipe(
                        tap(() => document.body.removeChild(document.getElementById('splashscreen-vision')))
                    );
                }
                return of(null);
            }),
            mergeMap(() => translateService.get('init')),
        ).subscribe(() => {
            resolve(true);
        });
    });
};

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        CoreModule,
        TemplateModule,
        SharedModule.forRoot(),
        TranslateModule.forRoot(),
        AuthModule,
        ATAngularModule.forRoot(),
        KeycloakAngularModule,
        ServiceWorkerModule.register(
            'combined-sw.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the app is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        WorkflowContainerModule,
        AppPreviewModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireMessagingModule,
        ThemeEngloberModule,
    ],
    providers: [
        StatusBar,
        I18nService,
        {
            provide: APP_INITIALIZER,
            useFactory: authInitialize,
            deps: [EnvService, AuthService, Injector, I18nService, TranslateService, PwaService, APP_BASE_HREF],
            multi: true
        },
        {
            provide: APP_BASE_HREF,
            useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
            deps: [PlatformLocation]
        },
        {
            provide: DocxTemplaterModulesService,
            useExisting: DocxTemplaterService,
        },
        {
            provide: RouteReuseStrategy,
            useClass: IonicRouteStrategy
        },
        { provide: ErrorHandler, useClass: MyErrorHandler },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
