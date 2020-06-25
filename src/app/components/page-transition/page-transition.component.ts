import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PageTransitionService } from './page-transition.service';
import { TimelineLite, Expo } from 'gsap/dist/gsap';

@Component({
    selector: 'fausto-page-transition',
    templateUrl: './page-transition.component.html',
    styleUrls: ['./page-transition.component.scss']
})
export class PageTransitionComponent implements OnInit {
    @ViewChild('transitionCylinder') TransitionCylinder: ElementRef;
    @ViewChild('title') Title: ElementRef;

    constructor(
        public readonly NAV_TRANSMITTER: PageTransitionService,
        public RENDER: Renderer2,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object
    ) { }

    ngOnInit(): void {
        this.NAV_TRANSMITTER.NavigationRequestListener.subscribe(resolver => this.doTransition(resolver));
    }

    doTransition(resolver: (value?: boolean | PromiseLike<boolean>) => void) {
        if (isPlatformBrowser(this.platform)) {
            let timeline = new TimelineLite();

            // Makes the title come into the screen
            timeline.fromTo(this.TransitionCylinder.nativeElement, { y: '100%' }, {
                y: 0,
                duration: 1.25,
                // stagger: 0.1,
                ease: Expo.easeInOut,
                onComplete: () => {
                    resolver(true)
                }
            });

            timeline.fromTo(this.Title.nativeElement, { y: '101%', opacity: 0 }, {
                y: 0,
                opacity: 1,
                duration: 1.25,
                ease: Expo.easeInOut,
            }, '-=1.1')

            timeline.to(this.Title.nativeElement, {
                y: '-101%',
                opacity: 0,
                duration: 1,
                ease: Expo.easeInOut,
                delay: 0.5
            })

            timeline.to(this.TransitionCylinder.nativeElement, {
                y: '-100%',
                duration: 1,
                ease: Expo.easeInOut,
            }, '-=0.5')
        }
    }

}
