import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncodeGuard, SmartLinkComponent, ThemeResolver } from '@algotech-ce/business';
import { TemplatePage } from './template/template.page';
import { AppTitleResolver } from './core/route/app-title.resolver';
import { SignInGuard } from '@algotech-ce/angular';
import { RedirectGuard } from './core/route/redirect.guard';

const routes: Routes = [
    {
      path: '',
      loadChildren: () => import('./launch/launch.module').then( m => m.LaunchPageModule),
      canActivate: [SignInGuard],
    },
    {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
        canActivate: [SignInGuard, RedirectGuard],
        runGuardsAndResolvers: 'always',
        component: TemplatePage,
        data: {
            title: 'Vision (by Algo\'Tech)'
        },
        resolve: {
            theme: ThemeResolver
        }
    }, {
        path: 'smartlink/:token',
        canActivate: [SignInGuard, RedirectGuard],
        component: SmartLinkComponent,
        resolve: {
            theme: ThemeResolver
        }
    },
    {
        path: 'notifications',
        loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule),
        canActivate: [SignInGuard, RedirectGuard],
        runGuardsAndResolvers: 'always',
        data: {
            title: 'NOTIFICATIONS.TITLE',
        },
        resolve: {
            theme: ThemeResolver
        }
    },
    {
        path: 'app/:keyApp',
        loadChildren: () => import('./app/app.module').then(m => m.AppPageModule),
        canActivate: [SignInGuard, RedirectGuard, EncodeGuard],
        runGuardsAndResolvers: 'always',
        component: TemplatePage,
        resolve: {
            title: AppTitleResolver,
            theme: ThemeResolver
        }
    },
    {
        path: 'app/:keyApp/:keyPage',
        loadChildren: () => import('./app/app.module').then(m => m.AppPageModule),
        canActivate: [SignInGuard, RedirectGuard, EncodeGuard],
        runGuardsAndResolvers: 'always',
        component: TemplatePage,
        resolve: {
            title: AppTitleResolver,
            theme: ThemeResolver
        }
    },
    {
        path: 'page-not-found',
        loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundPageModule),
        canActivate: [SignInGuard, RedirectGuard],
        runGuardsAndResolvers: 'always',
        data: {
            title: 'PAGE.NOT_FOUND',
            reuse: true,
        },
        resolve: {
            theme: ThemeResolver
        },
        component: TemplatePage,
    },
    { path: '**', redirectTo: '/page-not-found', pathMatch: 'full' },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes,
            {
                enableTracing: false
            }),
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
