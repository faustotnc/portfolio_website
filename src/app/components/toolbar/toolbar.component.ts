import { Component, OnInit, Renderer2, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'fausto-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
    @ViewChild('toolbar') TOOLBAR: ElementRef;
    public currentScrollPos = 0;
    public isMenuActive = false;

    constructor(
        private readonly SILKY_SCROLL: SilkyScrollService,
        private readonly RENDER: Renderer2,
        @Inject(PLATFORM_ID) private platform: object
    ) { }

    public ngOnInit(): void {
        const logistic_ramp = (x: number) => (64 * 0.009 * Math.exp(x / 24)) / (2 + (0.009 * Math.exp(x / 24)));

        if (isPlatformBrowser(this.platform)) {
            this.SILKY_SCROLL.scrollListener.subscribe(m => {
                this.currentScrollPos = m.scrollY;
                this.RENDER.setStyle(this.TOOLBAR.nativeElement, 'transform', `translateY(${64 - logistic_ramp(m.scrollY)}px)`);
            });
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

        // Set the hoverPercent of the menu item for the current route
        // to 100% so that it is always visible.
        // this.Routes[this.currentRoutePosition].hoverPercent = 100;

        // Changes the theme of the toolbar to white while the menu is open,
        // and then back to the previous theme when the menu gets closed.
        // if (this.isMenuActive) {
        //     this.prevToolbarTheme = this.currentToolbarTheme;
        //     this.currentToolbarTheme = 'light';
        // } else {
        //     this.currentToolbarTheme = this.prevToolbarTheme;
        // }

        // Sets the user-clicked-menu-button cookie when the user click on the menu button
        // if (!this.COOKIES.check(this.CTACookieName)) { this.COOKIES.set(this.CTACookieName, 'true'); }

        // Animations
        // anime({
        //     targets: this.mainMenuCylinder.nativeElement,
        //     opacity: (this.isMenuActive) ? 1 : 0,
        //     easing: 'easeOutExpo',
        //     duration: 700
        // });
        // anime({
        //     targets: this.MenuItemsList.nativeElement.children,
        //     opacity: [(this.isMenuActive) ? 0 : 1, 1],
        //     translateY: [(this.isMenuActive) ? 50 : 0, 0],
        //     easing: 'easeOutExpo',
        //     duration: 1500,
        //     delay: anime.stagger(100)
        // });
        // anime({
        //     targets: this.MoreInfoContainer.nativeElement,
        //     opacity: [(this.isMenuActive) ? 0 : 1, 1],
        //     translateY: [(this.isMenuActive) ? 50 : 0, 0],
        //     easing: 'easeOutExpo',
        //     duration: 1500
        // });
    }

}
