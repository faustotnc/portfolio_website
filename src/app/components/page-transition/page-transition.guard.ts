import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PageTransitionService } from './page-transition.service';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';


@Injectable({
    providedIn: 'root'
})
export class PageTransitionGuard implements CanActivate {
    constructor(
        private NAV_TRANSMITTER: PageTransitionService,
        @Inject(PLATFORM_ID) private platform: object
    ) { }

    public isFirstLoad = true;


    /**
     * The core function of the canActivate route guard. This
     * will be called automatically by the canActivate guard in
     * the route definitions object inside app-routing.module.ts
     * 
     * @param next A snapshot of the requested route
     * @param state The state of the requested route
     */
    public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> | boolean {
        // if on the server, we return the route right away
        if (isPlatformServer(this.platform)) { return true; }

        // When the page first loads
        if (this.isFirstLoad) {
            this.isFirstLoad = false;
            return true
        }

        // After the page is loaded, we show an animation every time there is
        // navigation to a new page.
        return new Promise(res => this.NAV_TRANSMITTER.RequestNavigationAnimation().then(res));
    }

}
