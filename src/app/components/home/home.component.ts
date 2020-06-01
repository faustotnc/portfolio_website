import { Component, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { PreloaderService } from '../../services/preloader.service';
import { TweenLite, Expo } from 'gsap/dist/gsap';

@Component({
    selector: 'fausto-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    @ViewChild('homeWrapper', { static: true }) HomeWrapper: ElementRef

    constructor(
        private PRELOADER: PreloaderService,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object) { }
    ngOnInit() {
        if (isPlatformBrowser(this.platform)) {
            this.PRELOADER.pageLoaded.subscribe(() => {
                TweenLite.to(this.HomeWrapper.nativeElement, {
                    opacity: 1,
                    y: 0,
                    duration: 2,
                    ease: Expo.easeOut
                })
            })
        }
    }

}
