import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



/**
 * @Injectable -> PageTransitionService
 *
 * @Visit https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
 * for more information on how services can provide interaction between components.
 */
@Injectable({
    providedIn: 'root'
})
export class PageTransitionService {
    // Observable object sources
    private RequestNavigationObservable = new Subject<(value?: boolean | PromiseLike<boolean>) => void>();
    private PreloaderFinishedObservable = new Subject<(value?: boolean | PromiseLike<boolean>) => void>();


    /**
     * Listens for events emitted through the
     * RequestNavigationAnimation observable.
     */
    public NavigationRequestListener = this.RequestNavigationObservable.asObservable();


    /**
     * Listens for when the preloaded has finished
     * trough the EmitPreloaderFinished observable.
     */
    public PreloaderFinishedListener = this.PreloaderFinishedObservable.asObservable();


    /**
     * Requests the page transition animation
     */
    public async RequestNavigationAnimation(): Promise<boolean> {
        return new Promise(resolver => this.RequestNavigationObservable.next(resolver));
    }


    /**
     * Emits an event when the preloader has finished
    */
    public EmitPreloaderFinished() {
        this.PreloaderFinishedObservable.next();
    }
}

