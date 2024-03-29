import { ElementRef, Renderer2 } from "@angular/core";
import { SilkyScrollData } from "./service/silky-scroll.service";

export class ScrollerCore {
   public _SCROLL_ELEMENT!: ElementRef;

   private canScroll = true;
   private momentum = 0;
   private ScrollObject = {
      y: 0,
      scrollRequest: 0,
   };

   // Stores the value for how much the user has
   // "scrolled down the website"
   private scrollY = 0;
   private documentHeight = 0;
   private scrollListenerCallback: (arg0: SilkyScrollData) => void = () => {};

   constructor(
      private readonly _DOC: Document,
      private readonly _RENDER: Renderer2,
      private readonly isPlatformBrowser: boolean
   ) {
      if (isPlatformBrowser) {
         const anim = () => {
            this.doSoftScroll();
            window.requestAnimationFrame(anim);
         };
         window.requestAnimationFrame(anim);
      }
   }

   public lockScroll() {
      this.canScroll = false;
   }

   public unlockScroll() {
      this.canScroll = true;
   }

   public set setMomentum(m: number) {
      this.momentum = (m <= 1 ? 1.1 : 1 / m) || 0.5;
   }

   /**
    * Makes elements with heights of 100vh have the
    * actual height of the viewport.
    */
   public setBodyStyles() {
      // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
      const vh = this._DOC.documentElement.clientHeight * 0.01;
      this._RENDER.setStyle(this._DOC.body, "height", `calc(${vh}px * 100)`);
      this._RENDER.setStyle(this._DOC.body, "overflow", "hidden");
      this._RENDER.setStyle(this._DOC.body, "-webkit-overflow-scrolling", "touch");
   }

   /**
    * Performs the necessary calculations to create a virtual, smooth scroll
    * @param delta the amount by which the scroll should change
    */
   public setScrollDelta(delta: number) {
      if (this.canScroll) {
         // Does not let the content scroll past the top
         // or the bottom of the website
         if (delta < 0 && this.scrollY <= 0) {
            this.scrollY = 0;
         } else if (delta > 0 && this.scrollY >= this.documentHeight - window.innerHeight) {
            this.scrollY = this.documentHeight - window.innerHeight;
         } else {
            this.scrollY += delta;
         }
      }
   }

   /**
    * Updates the translate position of the scroll
    * container based on an ease.
    *
    * This code is a modification of the algorithm provided by
    * OSUblake at https://greensock.com/forums/topic/17300-smooth-page-scroll/
    */
   public doSoftScroll() {
      if (this.canScroll && this.isPlatformBrowser) {
         // gets the current scroll of the window/body
         let scrollY = this.scrollY;

         // updates the current y-value of the main container until is it
         // equal to this.scrollY
         this.ScrollObject.y += (scrollY - this.ScrollObject.y) * this.momentum;

         // If there is less than 0.05px until this.ScrollObject.y = scrollY, we just set them equal
         if (Math.abs(scrollY - this.ScrollObject.y) < 0.05) this.ScrollObject.y = scrollY;

         // Every time we scroll, we check that the documentHeight variable
         // is storing the correct value for the maximum scrolling view
         let elementHeight = this._SCROLL_ELEMENT.nativeElement.scrollHeight;
         if (elementHeight !== this.documentHeight) this.updateScroller();

         if (this.ScrollObject.y !== scrollY) {
            let scrollData: SilkyScrollData = {
               scrollY: this.ScrollObject.y,
               direction: scrollY - this.ScrollObject.y > 0 ? "down" : "up",
               contentHeight: this.documentHeight - window.innerHeight,
            };
            this.scrollListenerCallback(scrollData);
            this._RENDER.setStyle(
               this._SCROLL_ELEMENT.nativeElement,
               "transform",
               `translate3d(0px, ${-this.ScrollObject.y}px, 0px)`
            );
         }
      }
   }

   /**
    * Scrolls to a given position on the page
    * @param position the end position in px
    * @param isImmediate when true, the scroller will scroll to the provided position without an animation
    */
   public scrollTo(position: number, isImmediate: boolean = false) {
      // When the resulting scroll position is outside the top of the page,
      // we set the scroll position to be at the top of the page
      // When the resulting scroll position is outside the bottom of the page,
      // we set the scroll position to be at the bottom of the page
      // Otherwise, we keep the passed position
      const pos = position < 0 ? 0 : position > this.documentHeight ? this.documentHeight : position;

      if (isImmediate) {
         this.ScrollObject.y = pos;
         this._RENDER.setStyle(this._SCROLL_ELEMENT.nativeElement, "transform", `translate3d(0px, ${pos}px, 0px)`);
      }

      this.scrollY = pos;

      // Request a scroll
      this.setScrollDelta(1);
   }

   /**
    * Updates the properties of the scroller on demand
    */
   public updateScroller() {
      if (this.isPlatformBrowser) {
         this.documentHeight = this._SCROLL_ELEMENT.nativeElement.scrollHeight;

         // Lock the scroll if the content's height is smaller
         // than the window's height
         if (this.documentHeight < window.innerHeight) {
            this.documentHeight = this._SCROLL_ELEMENT.nativeElement.scrollHeight;
            this.lockScroll();
         } else {
            this.unlockScroll();
         }

         this.setBodyStyles();
      }
   }

   /**
    * Listens for when there is a scroll event
    * @param callback the callback function
    */
   public scrollListener(callback: (arg0: SilkyScrollData) => void) {
      this.scrollListenerCallback = callback;
   }
}
