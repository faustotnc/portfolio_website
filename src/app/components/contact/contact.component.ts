import { Component, OnInit, AfterContentInit, OnDestroy, ViewChild, ElementRef, Renderer2, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';

// import Scrollbar from 'smooth-scrollbar';
import { AnimationLoop } from '../../animation-loop';



@Component({
    selector: 'fausto-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('mainContactSection', { static: true }) ContactSection: ElementRef;
    @ViewChild('heroTitle', { static: true }) HeroTitle: ElementRef;
    @ViewChild('emailSpan', { static: true }) EmailSpan: ElementRef;
    @ViewChild('emailArrow', { static: true }) EmailArrow: ElementRef;


    // A subscription to the
    // RequestInitialPageAnimationService.DataStream Function
    RequestInitAnimationStream: Subscription;
    public CurrentNCTime = '';
    skewScrollCurrentPixel = 0;
    currentScrollDown = 0;


    constructor(
        private RENDER: Renderer2,
        private TITLE: Title,
        private META: Meta,
        private SILKY_SCROLL: SilkyScrollService,
        @Inject(PLATFORM_ID) private platform: object,
        @Inject(NgZone) private NG_ZONE: NgZone,
    ) { }
    public ngOnInit(): void {
        // Sets the SEO tags
        this.setSEOTags();


        this.NG_ZONE.runOutsideAngular(() => {
            // Sets up the smoovy scroller module
            // if (isPlatformBrowser(this.platform)) this.setUpSmoovyScroller();

            const loop = new AnimationLoop(this.platform, 60, () => {
                this.CurrentNCTime = this.getNorthCarolinaTime();

                // Makes the hero title 'skew' as the user scrolls down
                // const skewTransform = (this.currentScrollDown - this.skewScrollCurrentPixel) * 0.09;
                // this.RENDER.setStyle(this.HeroTitle.nativeElement, 'transform', 'skewY(' + skewTransform + 'deg)');
                // this.skewScrollCurrentPixel = this.currentScrollDown;
            });
        });



        // Performs an animation every time this page is requested
        // to load. Usually when there is navigation involved.
        // if (isPlatformBrowser(this.platform)) setTimeout(() => this.doHeroAnimation(), 1000);
    }

    /**
     * Fired when the contents of the component are rendered
     */
    public ngAfterContentInit(): void {
        // Updates the Silky scroller
        if (isPlatformBrowser(this.platform)) {
            this.SILKY_SCROLL.requestScrollerUpdate();
        }
    }


    public ngOnDestroy(): void {
        // this.silkyScrollObserver.unsubscribe();
    }


    /**
     * Sets the SEO meta tags for each one of the routes.
     */
    private setSEOTags() {
        // Sets the title and description for this route
        this.TITLE.setTitle('Fausto - Contact');
        this.META.updateTag({ name: 'description', content: 'To start a new project, or for internship offers, please leave me an email at hello@faustogerman.com' });

        // Sets the rich cards meta tags for this route
        this.META.updateTag({ property: 'og:title', content: 'Fausto German\'s Contact Page' });
        this.META.updateTag({ property: 'og:site_name', content: 'Fausto German - Contact' });
        this.META.updateTag({ property: 'og:url', content: 'https://faustogerman.com/contact' });
        this.META.updateTag({ property: 'og:description', content: 'To start a new project, or for internship offers, please leave me an email at hello@faustogerman.com' });
    }


    /**
     * Sets up the smooth scrollbar plugin for
     * a soft, artificial scroll experience.
     */
    // private setUpSmoovyScroller() {
    //     import('@smoovy/scroller').then(scroller => {
    //         const Scroller = scroller.Scroller;

    //         import('@smoovy/tween/m/easing').then(easing => {
    //             // Smooth Scrollbar to make the website feel a little
    //             // elaborate. Makes scrolling throughout the page feel soft.
    //             const scroll = new Scroller(this.ContactSection.nativeElement, {
    //                 on: {
    //                     output: (position) => this.currentScrollDown = position.y
    //                 },
    //                 transformer: {
    //                     tween: {
    //                         duration: 1700,
    //                         easing: easing.Cubic.out
    //                     }
    //                 },
    //                 input: {
    //                     mouseWheel: {
    //                         multiplier: 1
    //                     }
    //                 }
    //             });
    //         });
    //     });
    // }



    /**
     * Transitions in the hero title and the email when
     * the page is loaded. More specifically, when the
     * REQ_INIT_ANIMATION send an event though the dataStream.
     */
    // private doHeroAnimation() {
    //     // Animation for the Hero Title and the Email
    //     anime({
    //         targets: [this.HeroTitle.nativeElement.children[0], this.EmailSpan.nativeElement],
    //         translateY: ['110%', '0'],
    //         duration: 1500,
    //         delay: anime.stagger(300),
    //         easing: 'easeOutQuart'
    //     });

    //     // Animation for the middle tick of the arrow
    //     anime({
    //         targets: this.EmailArrow.nativeElement.children[2],
    //         width: 27,
    //         duration: 375,
    //         easing: 'linear',
    //         complete: () => {
    //             // Animation for the end ticks of the arrow.
    //             anime({
    //                 targets: [this.EmailArrow.nativeElement.children[0], this.EmailArrow.nativeElement.children[1]],
    //                 width: '100%',
    //                 duration: 750,
    //                 easing: 'easeOutQuart'
    //             });
    //         }
    //     });
    // }



    /**
     * Gets the current time in NC, USA
     * so that it can be displayed to the
     * visitors.
     */
    private getNorthCarolinaTime() {
        // create Date object for current location
        const d = new Date();

        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        const utc = d.getTime() + (d.getTimezoneOffset() * 60000);

        // create new Date object for different city
        // using supplied offset
        const offset = 4; // day-light savings time
        // const offset = 5; // Non daylight savings time
        const nd = new Date(utc - (3600000 * offset));

        // return time as a string
        return nd.toLocaleString();
    }
}
