import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { Subscription } from 'rxjs';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'fausto-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('heroImage') private HeroImage: ElementRef;
    @ViewChild('wrapper') private Wrapper: ElementRef;

    // Observers
    private silkyScrollObserver: Subscription;
    private pagePageTransitionObserver: Subscription;


    constructor(
        private readonly SILKY_SCROLL: SilkyScrollService,
        private TITLE: Title,
        private META: Meta,
        private readonly RENDER: Renderer2,
        @Inject(PLATFORM_ID) private platform: object
    ) { }



    /**
     * Fired when the component is initialized
     */
    public ngOnInit(): void { this.setSEOTags(); }


    /**
     * Fired when the contents of the component are rendered
     */
    public ngAfterViewInit(): void {

        if (isPlatformBrowser(this.platform)) {
            // Updates the Silky scroller
            this.SILKY_SCROLL.requestScrollerUpdate();

            this.silkyScrollObserver = this.SILKY_SCROLL.scrollListener.subscribe(m => {
                this.RENDER.setStyle(this.HeroImage.nativeElement, 'transform', `translateY(${m.scrollY / 5.75}px)`);
            });
        }

    }


    /**
     * Fired when the component is destroy (by navigating to another route, for example)
     */
    public ngOnDestroy(): void {
        if (this.silkyScrollObserver) this.silkyScrollObserver.unsubscribe();
    }


    /**
     * Sets the SEO meta tags for each one of the routes.
     */
    private setSEOTags() {
        // Sets the title for this route
        this.TITLE.setTitle('Fausto - About');
        this.META.updateTag({ name: 'description', content: 'My name is Fausto German. I\'m a creative programmer pursuing a degree in computer science and machine learning engineering.' });

        // Sets the rich cards meta tags for this route
        this.META.updateTag({ property: 'og:title', content: 'Fausto German\'s About Page' });
        this.META.updateTag({ property: 'og:site_name', content: 'Fausto German - About' });
        this.META.updateTag({ property: 'og:url', content: 'https://faustogerman.com/about' });
        this.META.updateTag({ property: 'og:description', content: 'My name is Fausto German. I\'m a creative programmer pursuing a degree in computer science and machine learning engineering.' });
    }


    /**
     * Fired when the hero images are loaded
     * @param $event The event emitted when the image loads
     * @param img Which image has loaded
     */
    public heroImagesLoaded($event: any, img: string) {
        // Updates the Silky scroller
        this.SILKY_SCROLL.requestScrollerUpdate();
    }
}
