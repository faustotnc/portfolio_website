import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TimelineLite, Expo } from 'gsap/dist/gsap';

import { PageTransitionService } from '../page-transition/page-transition.service';

@Component({
    selector: 'fausto-preloader',
    templateUrl: './preloader.component.html',
    styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements OnInit {
    @ViewChild('title', { static: true }) TITLE: ElementRef;
    @ViewChild('rainbow', { static: true }) RAINBOW: ElementRef;
    @ViewChild('background', { static: true }) BACKGROUND: ElementRef;

    constructor(
        private RENDER: Renderer2,
        private PRELOADER: PageTransitionService,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object
    ) { }


    /**
     * Fired when the component is initialized
     */
    public ngOnInit(): void {
        if (isPlatformBrowser(this.platform)) {
            this.performAnimation()
        } else {
            this.PRELOADER.EmitPreloaderFinished();
        }
    }


    /**
     * Performs the preloader animation
     */
    private performAnimation() {
        let timeline = new TimelineLite();

        // Makes the title come into the screen
        timeline.to([...this.TITLE.nativeElement.children], {
            opacity: 1,
            y: 0,
            duration: 2,
            stagger: 0.1,
            ease: Expo.easeInOut
        });

        // timeline.timeScale(0.5);

        let titleOut = 1.5;

        // Makes the title go out of the screen slowly
        timeline.to(this.TITLE.nativeElement, {
            y: '-100%',
            duration: titleOut,
            ease: Expo.easeIn
        }, '-=0.3')

        // timeline.pause()

        // At the same time the title is going out of
        // the screen, the rainbow comes in
        timeline.to(this.RAINBOW.nativeElement, {
            y: 0,
            duration: titleOut,
            ease: Expo.easeInOut,
            onComplete: () => {
                // Once the rainbow is fully shown, we make the title disappear
                this.RENDER.setStyle(this.TITLE.nativeElement, 'display', 'none');
            }
        }, `-=${titleOut * 0.75}`);


        let t_0 = 0;
        let t_m = 0;
        // Makes the rainbow have a smaller width
        timeline.to(this.RAINBOW.nativeElement, {
            width: '15px',
            duration: 1.3,
            ease: Expo.easeInOut,
            onUpdate: () => {
                if (t_0 === 0) {
                    t_0 = timeline.time();
                    t_m = timeline.time() + 1.3;
                }

                // Changes the orientation of the rainbow gradient
                let prog = 1 - ((t_m - timeline.time()) / (t_m - t_0));
                let angle = 90 + (prog * 90);
                let rainbowColors = `linear-gradient(${angle}deg, rgba(224,171,11,1) 0%, rgba(231,84,91,1) 17%,
                            rgba(218,34,33,1) 33%, rgba(35,32,82,1) 50%, rgba(48,90,72,1) 67%, rgba(80,123,219,1) 83%,
                            rgba(220,185,159,1) 100%)`;
                this.RENDER.setStyle(this.RAINBOW.nativeElement, 'background', rainbowColors);
            },
            onComplete: () => {
                t_0 = 0;
                t_m = 0;
            }
        }, '-=0.7');

        // At the same time the rainbow is transforming to a
        // smaller width, it will also be transformed to a
        // higher height
        timeline.to(this.RAINBOW.nativeElement.parentElement, {
            height: '175px',
            duration: 1.3,
            ease: Expo.easeInOut,
        }, '-=1.3');


        // Makes the rainbow disappear
        timeline.to(this.RAINBOW.nativeElement, {
            height: 0,
            duration: 1,
            ease: Expo.easeInOut
        }, '-=0.2');

        let firedLoaderEnd = false;

        // Makes the entire screen disappear
        timeline.to(this.BACKGROUND.nativeElement, {
            height: 0,
            duration: 1.6,
            ease: Expo.easeInOut,
            onUpdate: () => {
                if (t_0 === 0) {
                    t_0 = timeline.time();
                    t_m = timeline.time() + 1.6;
                }

                // Changes the orientation of the rainbow gradient
                let prog = 1 - ((t_m - timeline.time()) / (t_m - t_0));

                // If 30 percent of the loading screen had disappeared,
                // we fire the PRELOADER.pageLoaded() event
                // if (prog >= 0.3 && !firedLoaderEnd) {
                if (!firedLoaderEnd) {
                    firedLoaderEnd = true;
                    this.PRELOADER.EmitPreloaderFinished();

                    // Removes the loading cover
                    this.DOC.body.removeChild(this.DOC.getElementById('loading-cover'))
                }
            }
        }, '-=1');
    }
}
