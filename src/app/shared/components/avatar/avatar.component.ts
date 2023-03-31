import { Component, Input, OnChanges } from '@angular/core';
import { WS_USERS_COLORS } from '@algotech-ce/angular';
import { WsUserDto } from '@algotech-ce/core';

const COLOR_CURRENT_USER = '#EC407A';
const COLOR_DEFAULT = '#000000';

@Component({
    selector: 'at-avatar',
    templateUrl: './avatar.component.html',
    styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnChanges {

    @Input() wsUser: WsUserDto;
    @Input() size: number = 40;

    constructor() { }

    color: string;
    name: string[];

    ngOnChanges() {
        if (this.wsUser.color === -1) {
            this.color = COLOR_CURRENT_USER;
        } else {
            if (this.wsUser.color < WS_USERS_COLORS.length) {
                this.color = WS_USERS_COLORS[this.wsUser.color];
            } else {
                this.color = COLOR_DEFAULT;
            }
        }

        this.name = [
            this.wsUser.firstName,
            this.wsUser.lastName
        ];
    }
}
