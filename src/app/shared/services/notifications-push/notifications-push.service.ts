import { NotificationsService, AuthService, UsersService, NetworkService } from '@algotech-ce/angular';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { Observable, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { NotificationDto } from '@algotech-ce/core';

@Injectable()
export class NotificationsPushService {

    notificationTapped = false;
    notificationsDisplayState: 'all' | 'unread' = 'all';

    constructor(
        private notificationsService: NotificationsService,
        private authService: AuthService,
        private afMessaging: AngularFireMessaging,
        private usersService: UsersService,
        private networkService: NetworkService
    ) { }

    assignToken(): Observable<any> {
        return this.afMessaging.requestToken.pipe(
            mergeMap((token: string) => this.usersService.assignMobileToken(this.authService.localProfil.id, token)),
        );
    }

    getMessages(): Observable<any> {
        return this.afMessaging.messages.pipe(
            tap((message) => {
                if (message?.data) {
                    if (this.authService.localProfil) {
                        const notification: NotificationDto = JSON.parse(message.data.notification);
                        this.notificationsService.addNotification(notification);
                    }
                }
            })
        );
    }

    deleteToken(): Observable<any> {
        if (this.networkService.offline) {
            return of(null);
        }

        return this.usersService.removeMobileToken(this.authService.localProfil.id).pipe(
            mergeMap(() => this.afMessaging.getToken),
            mergeMap((token) => this.afMessaging.deleteToken(token)),
        );
    }

}
