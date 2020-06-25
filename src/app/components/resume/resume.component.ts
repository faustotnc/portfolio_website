import { Component, AfterContentInit, OnInit, ViewChild, ElementRef, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/service/silky-scroll.service';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'fausto-resume',
    templateUrl: './resume.component.html',
    styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit, AfterContentInit {

    constructor(
        private readonly SILKY_SCROLL: SilkyScrollService,
        private readonly RENDER: Renderer2,
        private TITLE: Title,
        private META: Meta,
        @Inject(PLATFORM_ID) private platform: object
    ) { }



    /**
     * Fired when the component is initialized
     */
    public ngOnInit(): void {
        this.setSEOTags();
    }


    /**
     * Fired when the contents of the components are initialized
     */
    public ngAfterContentInit(): void {
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
        this.TITLE.setTitle('Fausto - Resume');
        this.META.updateTag({ name: 'description', content: 'An in-depth summary of my accomplishments and experiences.' });

        // Sets the rich cards meta tags for this route
        this.META.updateTag({ property: 'og:title', content: 'Fausto German\'s Resume Page' });
        this.META.updateTag({ property: 'og:site_name', content: 'Fausto German - Resume' });
        this.META.updateTag({ property: 'og:url', content: 'https://faustogerman.com/' });
        this.META.updateTag({ property: 'og:description', content: 'An in-depth summary of my accomplishments and experiences.' });
    }
}
