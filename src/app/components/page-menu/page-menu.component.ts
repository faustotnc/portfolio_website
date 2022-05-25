import { Component, ElementRef, Input, OnChanges, ViewChild } from "@angular/core";
import { gsap } from "gsap";
import {
   hideBackgrounds,
   hideBoxLinks,
   hideLeftBoxInfo,
   showBackgrounds,
   showBoxLinks,
   showLeftBoxInfo,
} from "./MenuAnimations";

@Component({
   selector: "fausto-page-menu",
   templateUrl: "./page-menu.component.html",
   styleUrls: ["./page-menu.component.scss"],
})
export class PageMenuComponent implements OnChanges {
   @Input() isOpen: boolean = false;
   @ViewChild("LeftBox") public LEFT_BOX!: ElementRef;
   @ViewChild("RightBox") public RIGHT_BOX!: ElementRef;

   public readonly MAIN_LINKS = [
      { name: "Home", to: "/" },
      { name: "About Me", to: "/about" },
      { name: "Curriculum", to: "/curriculum" },
      { name: "Contact", to: "/contact" },
   ];

   public readonly SOCIAL_LINKS = [
      { name: "LinkedIn", to: "https://linkedin.com/in/fgerman" },
      { name: "GitHub", to: "https://github.com/faustotnc" },
      { name: "CodePen", to: "https://codepen.io/faustotnc" },
      { name: "Twitter", to: "https://twitter.com/faustotnc" },
   ];

   constructor() {}

   ngOnChanges(): void {
      const mob = window.innerWidth <= 800;

      if (this.LEFT_BOX && this.RIGHT_BOX) {
         const leftBoxQuery = gsap.utils.selector(this.LEFT_BOX.nativeElement);
         const rightBoxQuery = gsap.utils.selector(this.RIGHT_BOX.nativeElement);

         // Open the Menu
         if (this.isOpen === true) {
            showBackgrounds(leftBoxQuery, rightBoxQuery, mob);
            showBoxLinks(leftBoxQuery, rightBoxQuery, mob);
            showLeftBoxInfo(leftBoxQuery, mob);
         }

         // Close the Menu
         if (this.isOpen === false) {
            hideBackgrounds(leftBoxQuery, rightBoxQuery, mob);
            hideBoxLinks(leftBoxQuery, rightBoxQuery, mob);
            hideLeftBoxInfo(leftBoxQuery, mob);
         }
      }
   }
}
