import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild } from "@angular/core";
import { Expo, gsap } from "gsap";
import { PageTransitionService } from "./page-transition.service";

@Component({
   selector: "fausto-page-transition",
   templateUrl: "./page-transition.component.html",
   styleUrls: ["./page-transition.component.scss"],
})
export class PageTransitionComponent implements OnInit {
   @ViewChild("TransitionWrapper") TRANSITION_WRAPPER!: ElementRef;

   constructor(
      public readonly NAV_TRANSMITTER: PageTransitionService,
      public RENDER: Renderer2,
      @Inject(DOCUMENT) private DOC: Document,
      @Inject(PLATFORM_ID) private platform: object
   ) {}

   ngOnInit(): void {
      this.NAV_TRANSMITTER.NavigationRequestListener.subscribe((resolver) => this.doTransition(resolver));
   }

   private doTransition(resolver: (value: boolean | PromiseLike<boolean>) => void) {
      if (isPlatformBrowser(this.platform)) {
         const timeline = gsap.timeline();
         const wrapperQuery = gsap.utils.selector(this.TRANSITION_WRAPPER.nativeElement);
         const titleEl = wrapperQuery("p");

         // Makes the title come into the screen
         timeline.fromTo(
            this.TRANSITION_WRAPPER.nativeElement,
            { y: "-101%" },
            {
               y: 0,
               duration: 1,
               ease: Expo.easeInOut,
               onComplete: () => resolver(true),
            }
         );

         timeline.fromTo(
            titleEl,
            { y: "-103%", opacity: 0 },
            {
               y: 0,
               opacity: 1,
               duration: 1,
               ease: Expo.easeOut,
               delay: -0.3,
            }
         );

         timeline.to(titleEl, {
            y: "101%",
            opacity: 0,
            duration: 1,
            ease: Expo.easeIn,
         });

         timeline.to(this.TRANSITION_WRAPPER.nativeElement, {
            y: "103%",
            duration: 1,
            ease: Expo.easeInOut,
            delay: -0.3,
         });
      }
   }
}
