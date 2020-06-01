import { Component, OnInit, ViewChild, ElementRef, Renderer2, Output, EventEmitter, Inject, PLATFORM_ID, AfterContentInit, AfterViewInit } from '@angular/core';
import { SilkyScrollService } from '../../silky-scroll/index';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'fausto-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
    // @ViewChild('imgWrapper', { static: true }) IMGWrapper: ElementRef;
    @ViewChild('parentCylinder', { static: true }) ParentCylinder: ElementRef;
    @Output() ContentBottom = new EventEmitter();


    constructor(
        public SCROLLER: SilkyScrollService,
        private RENDER: Renderer2,
        @Inject(DOCUMENT) private DOC: Document,
        @Inject(PLATFORM_ID) private platform: object,
    ) { }
    ngOnInit() {
        setTimeout(() => {
            this.heroImageLoaded();
        }, 200);
        if (isPlatformBrowser(this.platform)) {
            // let bout = [...this.Backdrop.nativeElement.children];
            this.SCROLLER.scrollListener.subscribe(scroll => {
                // let tenPercent = (window.innerHeight * 35) / 100;
                // if (scroll.scrollY > (window.innerHeight - tenPercent)) {
                //     let scale = this.scaleFunction(scroll.scrollY - (window.innerHeight - tenPercent));

                //     this.RENDER.setStyle(this.IMGWrapper.nativeElement, 'transform', `scale(${(scale * 0.2) + 0.8})`);
                //     this.RENDER.setStyle(this.IMGWrapper.nativeElement, 'filter', `grayscale(${100 - (scale * 100)}%) contrast(${(scale * 10) + 90}%)`);
                // }
            })
        }
    }

    heroImageLoaded() {
        if (isPlatformBrowser(this.platform)) {
            this.SCROLLER.requestScrollerUpdate();
            this.ContentBottom.emit(this.ParentCylinder.nativeElement.getBoundingClientRect().bottom)
        }
    }

    scaleFunction(x: number) {
        return (-Math.exp(-(x * x) / 200000) + 1)
    }

}
