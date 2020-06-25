import { Component, OnInit, HostListener, Inject, ElementRef, PLATFORM_ID, ViewChild, AfterContentInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { PageTransitionService } from "./components/page-transition/page-transition.service";
import { Subscription } from 'rxjs';
import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { SilkyScrollService } from "./silky-scroll";
import { HelperService } from "./services/helper.service";


@Component({
    selector: 'fausto-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit {
    @ViewChild('contentWrapper') ContentWrapper: ElementRef;
    public pageLoaded = false;
    private pageLoadedSubscriber: Subscription;
    public isIE = false;
    private isFirstLoad = true;

    constructor(
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object,
        private elementRef: ElementRef,
        private PRELOADER: PageTransitionService,
        private HELPER: HelperService,
        private SCROLLER: SilkyScrollService,
        private router: Router
    ) {
        // This needs to be executed as soon as the component loads,
        // that is why it is being executed from the constructor
        if (isPlatformBrowser(this.platform)) {
            this.setTrueViewportHeight();
            this.isIE = (this.HELPER.isIEorEdge() && this.HELPER.isIEorEdge() <= 11);
        }
    }

    /**
     * Fired when the contents of the component are initialized
     */
    public ngAfterContentInit() {
        this.router.events.subscribe((event: Event) => {
            if (this.isFirstLoad) {
                this.isFirstLoad = false;
                this.setThemeColors((event as NavigationStart).url);
            }

            if (event instanceof NavigationEnd) {
                if (!this.isFirstLoad) this.setThemeColors(event.url)
            }
        });


        this.pageLoadedSubscriber = this.PRELOADER.PreloaderFinishedListener.subscribe(() => {
            setTimeout(() => {
                this.pageLoaded = true;
                this.pageLoadedSubscriber.unsubscribe();
            }, 1000);
        });
    }

    private setThemeColors(url: string) {
        if (url === '/about') {
            this.DOC.documentElement.style.setProperty('--color-primary', '#e3e0d2');
            this.DOC.documentElement.style.setProperty('--color-toolbar', '#ba6107');
        } else if (url === "/contact") {
            this.DOC.documentElement.style.setProperty('--color-primary', '#736752');
            this.DOC.documentElement.style.setProperty('--color-toolbar', '#e4e8e2');
        } else if (url === "/resume") {
            this.DOC.documentElement.style.setProperty('--color-primary', '#f5f5f4');
            this.DOC.documentElement.style.setProperty('--color-toolbar', '#813f18');
        } else {
            this.DOC.documentElement.style.setProperty('--color-primary', '#282c47');
            this.DOC.documentElement.style.setProperty('--color-toolbar', '#f0e6c3');
        }
    }

    /**
       * Makes elements with heights of 100vh have the
       * actual height of the viewport.
       */
    @HostListener("window:resize") public setTrueViewportHeight() {
        if (isPlatformBrowser(this.platform)) {
            this.SCROLLER.requestScrollerUpdate();

            const calculateVH = () => {
                // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
                const vh = this.DOC.documentElement.clientHeight * 0.01;
                // Then we set the value in the --vh custom property to the root of the document
                this.elementRef.nativeElement.style.setProperty("--vh", `${vh}px`);
            };

            // Initial Calculation right after the viewport is resized
            calculateVH();
            // And a second calculation 350ms after to ensure we are
            // setting the right value. This targets a problem with
            // Safari in which, for some reason, after resizing the
            // viewport, it still sets the previous value.
            setTimeout(() => calculateVH(), 350);
        }
    }
}





// import { Component } from '@angular/core';

// @Component({
//     selector: 'fausto-root',
//     templateUrl: './app.component.html',
//     styleUrls: ['./app.component.scss']
// })
// export class AppComponent {

// }