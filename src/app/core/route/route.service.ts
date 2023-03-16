import { Route as ngRoute, Routes } from '@angular/router';

/**
 * Provides helper methods to create routes.
 */
export class Route {

    /**
   * Creates routes using the shell component and authentication.
   * @param routes The routes to add.
   * @return {Route} The new route using shell as the base.
   */
    static withComponent(routes: Routes, component: any, guard: any): ngRoute {
        return {
            path: '',
            component: component,
            children: routes,
            canActivate: [guard],
            runGuardsAndResolvers: 'always',
            data: { reuse: true }
        };
    }

}
