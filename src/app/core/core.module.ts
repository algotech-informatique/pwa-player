import { NgModule, ErrorHandler } from '@angular/core';
import { MyErrorHandler } from './error.service';
import { I18nService, SignInGuard } from '@algotech-ce/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { SAdminGuard } from './route/sadmin.guard';
import { RedirectGuard } from './route/redirect.guard';
import { AppTitleResolver } from './route/app-title.resolver';
import { EncodeGuard } from '@algotech-ce/business';

@NgModule({
    imports: [
        TranslateModule,
        SharedModule,
    ],
    providers: [
        I18nService,
        SAdminGuard,
        RedirectGuard,
        AppTitleResolver,
        SignInGuard,
        EncodeGuard,
        { provide: ErrorHandler, useClass: MyErrorHandler },
    ]
})
export class CoreModule { }
