import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject, AfterViewInit } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'fausto-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
    @ViewChild('toolbar') TOOLBAR: ElementRef;
    @ViewChild('homeLink') HomeLink: ElementRef;
    public currentScrollPos = 0;
    public isMenuActive = false;

    constructor(
        private readonly SILKY_SCROLL: SilkyScrollService,
        private readonly RENDER: Renderer2,
        @Inject(PLATFORM_ID) private platform: object
    ) { }

    public ngOnInit(): void {
        const logistic_ramp = (x: number, max: number) => max - ((max * 0.009 * Math.exp(x / 24)) / (2 + (0.009 * Math.exp(x / 24))));

        if (isPlatformBrowser(this.platform)) {
            this.SILKY_SCROLL.scrollListener.subscribe(m => {
                this.currentScrollPos = m.scrollY;

                if (window.innerWidth > 650) {
                    this.RENDER.setStyle(this.TOOLBAR.nativeElement, 'transform', `translateY(${logistic_ramp(m.scrollY, 64)}px)`);
                } else {
                    this.RENDER.setStyle(this.TOOLBAR.nativeElement, 'transform', `translateY(${logistic_ramp(m.scrollY, 32)}px)`);
                }
            });
        }
    }


    public ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platform)) {
            // Force the redraw of the home-link in the toolbar's header.
            // This fixes an issue where, for some reason, the browser would not
            // render the color of the link properly.
            setTimeout(() => {
                this.HomeLink.nativeElement.style.display = 'none';
                this.HomeLink.nativeElement.offsetHeight; // no need to store this anywhere, the reference is enough
                this.HomeLink.nativeElement.style.display = 'block';
            }, 1000);
        }
    }


    /**
    * Toggles the main menu of the website.
    * This function is in charge of showing the menu
    * upon user request, set the userClickedMenuButton
    * cookie, and make the CTA arrow disappear.
    */
    public toggleMenu(source?: string) {
        // Toggles the 'active' state of the menu
        this.isMenuActive = !this.isMenuActive;
    }
}
