import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

// The data emitted by the scroll listener
export interface SilkyScrollData {
    scrollY: number;
    direction: 'up' | 'down';
    contentHeight: number;
}



@Injectable({
    providedIn: 'root'
})
export class SilkyScrollService {

    // * Listens for changes in the scroll
    private scroll_listener_source = new Subject<SilkyScrollData>(); // event source
    public scrollListener = this.scroll_listener_source.asObservable(); // listener
    public scrollListenerEmitter(scrollData: SilkyScrollData) { // emitter
        this.scroll_listener_source.next(scrollData);
    }


    // * Listens for changes in the scroll
    private update_scroller_source = new Subject(); // event source
    public updateScrollerListener = this.update_scroller_source.asObservable(); // listener
    public requestScrollerUpdate() { // emitter
        this.update_scroller_source.next();
    }


    private scroll_to_EventSource = new Subject<{ position: number, isImmediate?: boolean }>(); // event source
    public scrollToListener = this.scroll_to_EventSource.asObservable(); // listener
    public scrollTo(position: number, isImmediate: boolean = false) { // emitter
        this.scroll_to_EventSource.next({ position, isImmediate });
    }
}
