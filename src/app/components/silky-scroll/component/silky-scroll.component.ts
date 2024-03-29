import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
   AfterViewInit,
   Component,
   ElementRef,
   EventEmitter,
   HostListener,
   Inject,
   Input,
   Output,
   PLATFORM_ID,
   Renderer2,
   ViewChild,
} from "@angular/core";
import { Event, NavigationEnd, Router } from "@angular/router";
import { ScrollerCore } from "../scroller-core";
import { SilkyScrollService } from "../service/silky-scroll.service";

@Component({
   selector: "silky-scroll",
   template: `
      <div class="page-superwrapper">
         <div class="scrolling-view" #scrollElement>
            <ng-content></ng-content>
         </div>
      </div>
   `,
   styleUrls: ["./silky-scroll.component.scss"],
})
export class SilkyScrollComponent implements AfterViewInit {
   @ViewChild("scrollElement", { static: true }) SCROLL_ELEMENT!: ElementRef;
   @Output() onScroll = new EventEmitter();

   private SCROLLER!: ScrollerCore;
   private touchY: number = 0;

   constructor(
      @Inject(DOCUMENT) public DOC: Document,
      @Inject(PLATFORM_ID) private platform: object,
      private elementRef: ElementRef,
      public RENDER: Renderer2,
      public SCROLLER_SERVICE: SilkyScrollService,
      private router: Router
   ) {
      if (isPlatformBrowser(platform)) {
         this.SCROLLER = new ScrollerCore(DOC, RENDER, isPlatformBrowser(this.platform));
      }
   }

   /**
    * Life-cycle hook activated when
    * the children views of this component
    * are created.
    */
   ngAfterViewInit() {
      if (isPlatformBrowser(this.platform)) {
         this.SCROLLER._SCROLL_ELEMENT = this.SCROLL_ELEMENT;

         // Listens for when there is a request to update the scroller
         this.SCROLLER_SERVICE.updateScrollerListener.subscribe(() => {
            // sets the body's height equal to
            // the scrolling container's height
            this.onWindowResized();
         });

         this.SCROLLER.scrollListener((scrollData) => {
            this.SCROLLER_SERVICE.scrollListenerEmitter(scrollData);
            this.onScroll.emit(scrollData);
         });

         this.SCROLLER_SERVICE.scrollToListener.subscribe((to) => {
            this.SCROLLER.scrollTo(to.position, to.isImmediate);
         });

         // We also need to listen to route changes so that
         // we can update the state of the scroller every time
         // the user navigates to a new route.
         this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
               this.SCROLLER.updateScroller();
               this.SCROLLER_SERVICE.scrollTo(0, true);
            }
         });
      }
   }

   /**
    * Sets the momentum for the scroll
    * @param m The passed momentum
    */
   @Input("momentum") set momentumSet(m: string | number) {
      if (isPlatformBrowser(this.platform)) {
         this.SCROLLER.setMomentum = typeof m === "string" ? Number.parseFloat(m) : m;
      }
   }

   /**
    * Listens for the resize events on the window
    */
   @HostListener("window:resize") onWindowResized() {
      if (isPlatformBrowser(this.platform)) {
         this.SCROLLER.updateScroller();
      }
   }

   /**
    * Listens for the scroll events on the window
    */
   @HostListener("window:wheel", ["$event"]) onWindowScrolled(event: WheelEvent) {
      if (isPlatformBrowser(this.platform)) {
         this.SCROLLER.setScrollDelta(event.deltaY);
      }
   }

   /**
    * Listens for touchstart events on the browser
    * @param event The touch event
    */
   @HostListener("window:touchstart", ["$event"]) onTouchStarted(event: TouchEvent) {
      if (isPlatformBrowser(this.platform)) {
         this.touchY = event.touches[0].screenY;
      }
   }

   /**
    * Listens for touchmove events on the browser
    * @param event The touch event
    */
   @HostListener("window:touchmove", ["$event"]) onTouchScrolled(event: TouchEvent) {
      if (isPlatformBrowser(this.platform)) {
         this.SCROLLER.setScrollDelta((this.touchY - event.touches[0].screenY) * 2);
         this.touchY = event.touches[0].screenY;
      }
   }
}
