import { isPlatformBrowser } from "@angular/common";
import { AfterContentInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { SilkyScrollService } from "../../components/silky-scroll/service/silky-scroll.service";

@Component({
   selector: "fausto-contact",
   templateUrl: "./contact.component.html",
   styleUrls: ["./contact.component.scss"],
})
export class ContactComponent implements OnInit, AfterContentInit {
   @ViewChild("mainContactSection", { static: true }) ContactSection!: ElementRef;
   @ViewChild("heroTitle", { static: true }) HeroTitle!: ElementRef;
   @ViewChild("emailSpan", { static: true }) EmailSpan!: ElementRef;
   @ViewChild("emailArrow", { static: true }) EmailArrow!: ElementRef;
   public CurrentNCTime = "";

   constructor(
      private TITLE: Title,
      private META: Meta,
      private SILKY_SCROLL: SilkyScrollService,
      @Inject(PLATFORM_ID) private platform: object
   ) {}
   public ngOnInit(): void {
      // Sets the SEO tags
      this.setSEOTags();

      const computeTime = () => {
         window.requestAnimationFrame(computeTime);
         this.CurrentNCTime = this.getNorthCarolinaTime();
      };
      computeTime();
   }

   /**
    * Fired when the contents of the component are rendered
    */
   public ngAfterContentInit(): void {
      // Updates the Silky scroller
      if (isPlatformBrowser(this.platform)) {
         this.SILKY_SCROLL.requestScrollerUpdate();
      }
   }

   /**
    * Sets the SEO meta tags for each one of the routes.
    */
   private setSEOTags() {
      // Sets the title and description for this route
      this.TITLE.setTitle("Fausto - Contact");
      this.META.updateTag({
         name: "description",
         content:
            "To start a new project, or for internship offers, please leave me an email at hello@faustogerman.com",
      });

      // Sets the rich cards meta tags for this route
      this.META.updateTag({ property: "og:title", content: "Fausto German's Contact Page" });
      this.META.updateTag({ property: "og:site_name", content: "Fausto German - Contact" });
      this.META.updateTag({ property: "og:url", content: "https://faustogerman.com/contact" });
      this.META.updateTag({
         property: "og:description",
         content:
            "To start a new project, or for internship offers, please leave me an email at hello@faustogerman.com",
      });
   }

   /**
    * Gets the current time in NC, USA
    * so that it can be displayed to the
    * visitors.
    */
   private getNorthCarolinaTime() {
      // create Date object for current location
      const d = new Date();

      // convert to msec
      // subtract local time zone offset
      // get UTC time in msec
      const utc = d.getTime() + d.getTimezoneOffset() * 60000;

      // create new Date object for different city
      // using supplied offset
      // const offset = 4; // day-light savings time
      const offset = 5; // Non daylight savings time
      const nd = new Date(utc - 3600000 * offset);

      // return time as a string
      return nd.toLocaleString();
   }
}
