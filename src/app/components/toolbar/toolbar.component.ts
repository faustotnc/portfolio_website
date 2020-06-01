import { Component, OnInit, ViewChild, ElementRef, HostListener, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SilkyScrollService } from '../../silky-scroll';
import { PreloaderService } from '../../services/preloader.service';
import { TweenLite, Expo } from 'gsap/dist/gsap';

@Component({
    selector: 'fausto-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    @ViewChild('logo', { static: true }) Logo: ElementRef;
    @ViewChild('scrollIndicator', { static: true }) ScrollIndicator: ElementRef;
    @ViewChild('menuListItems', { static: true }) MenuListItems: ElementRef;
    public currentElement = 0;
    private page_sections: NodeListOf<Element>;
    private iLogoTop = 0;

    private scrollPos = 0;

    constructor(
        private SILKY: SilkyScrollService,
        private RENDER: Renderer2,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object,
        private PRELOADER: PreloaderService
    ) { }
    ngOnInit() {
        this.page_sections = this.DOC.querySelectorAll('section.page-section');

        this.doLogoTransform();


        if (isPlatformBrowser(this.platform)) {
            this.PRELOADER.pageLoaded.subscribe(() => {
                this.showMenuItems();
            });
        }

        this.SILKY.scrollListener.subscribe(scroll => {
            this.scrollPos = scroll.scrollY;
            this.doVariableMenuSize();
            this.doLogoTransform();

            // Show the scroll indicator with a clip-path
            let scrollInd = 100 - (scroll.scrollY / (scroll.contentHeight + window.innerHeight)) * 100;
            let clipPath = `inset(0 0 ${scrollInd}% 0)`;
            this.RENDER.setStyle(this.ScrollIndicator.nativeElement, 'clip-path', clipPath);
            this.RENDER.setStyle(this.ScrollIndicator.nativeElement, '-webkit-clip-path', clipPath);
        })
    }



    private doVariableMenuSize() {

        let isSectionTopAboveScreenMiddle = (el: Element) => {
            return el.getBoundingClientRect().top < (window.innerHeight / 1.5);
        }
        let isSectionBottomAboveScreenMiddle = (el: Element) => {
            return el.getBoundingClientRect().bottom < (window.innerHeight / 1.5);
        }

        let isSectionOnScreen = (el: Element) => {
            return isSectionTopAboveScreenMiddle(el) && !isSectionBottomAboveScreenMiddle(el);
        }

        if (isSectionOnScreen(this.page_sections[0])) this.currentElement = 0;
        if (isSectionOnScreen(this.page_sections[1])) this.currentElement = 1;
        if (isSectionOnScreen(this.page_sections[2])) this.currentElement = 2;
        if (isSectionOnScreen(this.page_sections[3])) this.currentElement = 3;
    }


    @HostListener('window:resize') doLogoTransform() {
        if (isPlatformBrowser(this.platform)) {
            if (window.innerHeight <= 430) {
                this.iLogoTop = 0;
            } else if (window.innerHeight <= 550) {
                this.iLogoTop = 64;
            } else {
                this.iLogoTop = 96;
            }

            let logoY = this.iLogoTop - (-this.iLogoTop * Math.exp(-(this.scrollPos * this.scrollPos) / 130000) + this.iLogoTop);
            this.RENDER.setStyle(this.Logo.nativeElement, 'transform', `translateY(${logoY}px)`);
        }
    }


    public requestNavigation(section: string, event) {
        event.preventDefault();
        let el = document.getElementsByClassName(section)[0];
        this.SILKY.scrollTo(el.getBoundingClientRect().top)
    }



    private showMenuItems() {
        let menuListItems = [...this.MenuListItems.nativeElement.getElementsByClassName('slide')]
        TweenLite.to(menuListItems, {
            opacity: 1,
            y: 0,
            ease: Expo.easeOut,
            duration: 1.7,
            stagger: 0.2,
            delay: 0.7,
        })

        let logoItems = [...this.Logo.nativeElement.getElementsByTagName('span')]
        TweenLite.to(logoItems, {
            opacity: 1,
            y: 0,
            ease: Expo.easeOut,
            duration: 1.7,
            stagger: 0.2,
            delay: 0.3
        })
    }
}
