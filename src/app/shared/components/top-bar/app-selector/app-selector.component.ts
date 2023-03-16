import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { style, animate, transition, trigger } from '@angular/animations';
import { Application } from '@algotech/angular';
import * as _ from 'lodash';

@Component({
    selector: 'at-app-selector',
    styleUrls: ['./app-selector.component.scss'],
    template: `
    <div class="pop-up-apps" [ngStyle]="{'grid-template-columns': applications.length > 2 ? '1fr 1fr 1fr' : '1fr 1fr'}">
        <a
            class="app"
            *ngFor="let application of applications"
            [ngClass]="{ 'current' : selectedAppId === application.id  }"
            (click)="appClick(application.applicationUrl)">
            <img *ngIf="application.logoUrl" [src]="application.logoUrl" alt="">
            <i *ngIf="application.icon" [class]="application.icon"></i>
            <span>{{application.name}}</span>
        </a>
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
export class AppSelectorComponent implements OnInit {

    @Output() openApp = new EventEmitter<string>();
    @Input() currentApp: Application;
    @Input() applications: any[];

    isVisible = false;
    selectedAppId: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit() {
        const pageKey: string =  this.route.snapshot.paramMap.get('keyApp');
        if (pageKey) {
            this.currentApp = _.find(this.applications, { key: pageKey });
        }
        if (this.currentApp?.id) {
            this.selectedAppId = this.currentApp.id;
        }
    }

    appClick(applicationUrl: string) {
        this.selectedAppId = this.applications.find(app => app.applicationUrl === applicationUrl).id;

        history.pushState({}, '', window.location.href);
        this.router.navigateByUrl(applicationUrl, { replaceUrl: true });
        this.openApp.emit();
    }
}
