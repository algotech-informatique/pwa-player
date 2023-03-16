import { ErrorHandler, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';

@Injectable()
export class MyErrorHandler implements ErrorHandler {

    constructor(private translate: TranslateService, private alertCtrl: AlertController) { }

    handleError(error) {
        if (environment.production) {
            Sentry.captureException(new Error(error.originalError ||
                error));
        } else {
            console.error(error);
        }
        // this.presentAlert(error);
    }

    async presentAlert(error: Error) {

        if (error instanceof HttpErrorResponse) {
            let message: string = this.translate.instant(error.message);

            // error http
            if (error instanceof HttpErrorResponse && error.error && _.isArray(error.error.message)) {
                message = _.toString(error.error.message[0].value); // TODO Gérer les erreurs multilingues
            }

            // construct the alert for error
            const alert = await this.alertCtrl.create({
                message: this.translate.instant(message),
                buttons: ['OK']
            });

            await alert.present();
        }
    }
}
