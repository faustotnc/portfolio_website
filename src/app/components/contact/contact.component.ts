import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { TweenLite, Quart } from 'gsap/dist/gsap';

@Component({
    selector: 'fausto-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
    // @ViewChild('mainContactSection', { static: true }) ContactSection: ElementRef;
    @ViewChild('heroTitle', { static: true }) HeroTitle: ElementRef;
    @ViewChild('emailSpan', { static: true }) EmailSpan: ElementRef;
    @ViewChild('emailArrow', { static: true }) EmailArrow: ElementRef;

    constructor(
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object) { }
    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            setTimeout(() => {
                this.doHeroAnimation();
            }, 5000);
        }
    }



    /**
       * Transitions in the hero title and the email when
       * the page is loaded. More specifically, when the
       * REQ_INIT_ANIMATION send an event though the dataStream.
       */
    private doHeroAnimation() {
        // Animation for the Hero Title and the Email
        TweenLite.to(this.EmailSpan.nativeElement, {
            y: 0,
            duration: 1.50,
            ease: Quart.easeOut
        });

        // Animation for the middle tick of the arrow
        TweenLite.to(this.EmailArrow.nativeElement.children[2], {
            width: '140%',
            duration: 0.375,
            ease: 'linear',
            onComplete: () => {
                let width = this.EmailArrow.nativeElement.children[0].parentElement.offsetWidth;
                // Animation for the end ticks of the arrow.
                TweenLite.to([this.EmailArrow.nativeElement.children[1], this.EmailArrow.nativeElement.children[0]], {
                    width,
                    duration: 0.750,
                    ease: Quart.easeOut
                });
            }
        });
    }

}
