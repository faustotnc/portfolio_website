import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class PreloaderService {
    // * Listens for changes in the scroll
    private pageLoaded_listener_source = new Subject<any>(); // event source
    public pageLoaded = this.pageLoaded_listener_source.asObservable(); // listener
    public pageLoadedEmitter() { // emitter
        this.pageLoaded_listener_source.next();
    }
}
