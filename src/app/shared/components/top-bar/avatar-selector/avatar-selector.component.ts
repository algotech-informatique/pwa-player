import { Component, Input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { WsUserDto } from '@algotech/core';

@Component({
    selector: 'at-avatar-selector',
    styleUrls: ['./avatar-selector.component.scss'],
    template: `
    <div class="pop-up-users" [@fadeInOut]="isVisible">
        <div class="item" *ngFor="let user of users">
            <at-avatar class="avatar" [wsUser]="user"></at-avatar>
            <div class="label">
                {{user.firstName}} {{user.lastName}}
            </div>
        </div>
    </div>
    `,
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(250, style({ opacity: 1 }))
            ]),
            transition(':leave', [animate(500, style({ opacity: 0 }))])
        ])
    ],
})
export class AvatarSelectorComponent {
    @Input() users: WsUserDto[];
    isVisible = false;
}
