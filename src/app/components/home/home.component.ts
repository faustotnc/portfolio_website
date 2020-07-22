import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'fausto-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(
        private SILKY_SCROLL: SilkyScrollService,
        private TITLE: Title,
        private META: Meta,
        @Inject(PLATFORM_ID) private platform: object
    ) { }




    /**
     * Fired when the component is initialized
     */
    public ngOnInit() {
        this.setSEOTags();

        if (isPlatformBrowser(this.platform)) {
            // Updates the Silky scroller
            this.SILKY_SCROLL.requestScrollerUpdate();
        }
    }


    /**
     * Sets the SEO meta tags for each one of the routes.
     */
    private setSEOTags() {
        // Sets the title and description for this route
        this.TITLE.setTitle('Fausto - Home');
        this.META.updateTag({ name: 'description', content: 'Creative programmer pursuing a degree in computer science and a specialization in artificial intelligence.' });

        // Sets the rich cards meta tags for this route
        this.META.updateTag({ property: 'og:title', content: 'Fausto German\'s Home Page' });
        this.META.updateTag({ property: 'og:site_name', content: 'Fausto German - Home' });
        this.META.updateTag({ property: 'og:url', content: 'https://faustogerman.com/' });
        this.META.updateTag({ property: 'og:description', content: 'Creative programmer pursuing a degree in computer science and a specialization in artificial intelligence.' });
    }
}
