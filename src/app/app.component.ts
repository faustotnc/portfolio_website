import { Component, ViewChild, ElementRef, OnInit, HostListener, Renderer2, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
// import { SwUpdate } from '@angular/service-worker';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SilkyScrollService } from './silky-scroll';
import { PreloaderService } from './services/preloader.service';
import { Subscription } from 'rxjs';
import { HelperService } from './services/helper.service'


@Component({
    selector: 'fausto-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    public cursorCanvasHeight = 0;
    private pageLoadedSubscriber: Subscription;
    public pageLoaded = false;
    public isIE = false;

    constructor(
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object,
        private elementRef: ElementRef,
        private PRELOADER: PreloaderService,
        private HELPER: HelperService,
        private SCROLLER: SilkyScrollService
    ) {
        // This needs to be executed as soon as the component loads, hence,
        // it is being executed from the constructor
        if (isPlatformBrowser(this.platform)) {
            this.setTrueViewportHeight();
            this.isIE = (this.HELPER.isIEorEdge() && this.HELPER.isIEorEdge() <= 11) ? true : false;;
        }
    }
    ngOnInit() {
        this.pageLoadedSubscriber = this.PRELOADER.pageLoaded.subscribe(() => {
            setTimeout(() => {
                this.pageLoaded = true;
                this.pageLoadedSubscriber.unsubscribe();
            }, 1000);
        })
    }


    /**
     * Makes elements with heights of 100vh have the
     * actual height of the viewport.
     */
    @HostListener('window:resize') public setTrueViewportHeight() {
        this.SCROLLER.requestScrollerUpdate();

        const calculateVH = () => {
            // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
            const vh = this.DOC.documentElement.clientHeight * 0.01;
            // Then we set the value in the --vh custom property to the root of the document
            this.elementRef.nativeElement.style.setProperty('--vh', `${vh}px`);
        };

        // Initial Calculation right after the viewport is resized
        calculateVH();
        // // And a second calculation 350ms after to ensure we are
        // // setting the right value. This targets a problem with
        // // Safari in which, for some reason, after resizing the
        // // viewport, it still sets the previous value.
        // setTimeout(() => calculateVH(), 350);
    }

    public updateCanvasHeight(height: number) {
        this.cursorCanvasHeight = height;
    }
}
