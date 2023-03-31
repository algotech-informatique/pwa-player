import { Component, OnInit } from '@angular/core';
import { WsUserDto } from '@algotech-ce/core';
import { AuthService, NetworkService } from '@algotech-ce/angular';

@Component({
    selector: 'app-sidebar-header',
    templateUrl: './sidebar-header.component.html',
    styleUrls: ['./sidebar-header.component.scss'],
})
export class SidebarHeaderComponent implements OnInit {

    wsCurrentUser: WsUserDto;

    constructor(public networkService: NetworkService, private authService: AuthService) { }

    ngOnInit() {
        if (this.authService.isAuthenticated) {
            this.wsCurrentUser = {
                firstName: this.authService.localProfil.firstName,
                lastName: this.authService.localProfil.lastName,
                email: this.authService.localProfil.email,
                pictureUrl: this.authService.localProfil.pictureUrl,
                uuid: this.authService.localProfil.id,
                color: -1,
                focus: null
            };
        }
    }
}
