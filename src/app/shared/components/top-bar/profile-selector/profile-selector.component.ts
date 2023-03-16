import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';
import { WsUserDto } from '@algotech/core';

@Component({
    selector: 'at-profile-selector',
    styleUrls: ['./profile-selector.component.scss'],
    template: `
    <div class="pop-up-profile" [@fadeInOut]="isVisible">
        <div class="profile">
            <div class="group">
                <at-avatar
                    [wsUser]="currentUser"
                    class="avatar"
                >
                </at-avatar>
            </div>
            <div class="group border">
                <div class="info bold">
                    {{ userInfo }}
                </div>
                <div class="info mail">
                    {{ currentUser.email }}
                </div>
            </div>
            <div class="group">
                <button class="close" (click)="ongletClick('logout')">
                    {{ 'PROFILE-SELECTOR.TAB.LOGOUT' | translate }}
                </button>
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
    ]
})
export class ProfileSelectorComponent implements OnInit {

    @Input() currentUser: WsUserDto;

    @Output() close = new EventEmitter<string>();

    isVisible = false;
    userInfo = '';

    constructor( ) { }

    ngOnInit() {
        this.userInfo = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }

    ongletClick(route) {
        this.close.emit(route);
    }

}
