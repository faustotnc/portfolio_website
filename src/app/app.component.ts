import { DOCUMENT } from "@angular/common";
import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter, map, mergeMap, Subscription } from "rxjs";
import { calculateVH } from "../Helpers";
import { PageTransitionService } from "./components/page-transition/page-transition.service";
import * as ThemeColors from "./PageThemeColors";

@Component({
   selector: "fausto-root",
   templateUrl: "./app.component.html",
   styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
   public pageLoaded = false;
   public scrollMomentum = window.devicePixelRatio > 2 ? 12 : 16;
   private pageLoadedSubscriber!: Subscription;

   constructor(
      @Inject(DOCUMENT) public DOC: Document,
      private PRELOADER: PageTransitionService,
      private router: Router,
      private route: ActivatedRoute
   ) {
      calculateVH();
   }

   ngOnInit(): void {
      // https://stackoverflow.com/a/58654690/7407086
      this.router.events
         .pipe(
            filter((event) => event instanceof NavigationEnd),
            map(() => this.route),
            map((route) => {
               while (route.firstChild) route = route.firstChild;
               return route;
            }),
            filter((route) => route.outlet === "primary"),
            mergeMap((route) => route.data)
         )
         .subscribe((data) => this.setPageTheme(data["routeName"]));

      this.pageLoadedSubscriber = this.PRELOADER.PreloaderFinishedListener.subscribe(() => {
         setTimeout(() => {
            this.pageLoaded = true;
            this.pageLoadedSubscriber.unsubscribe();
         }, 1000);
      });
   }

   @HostListener("window:resize")
   private windowResize() {
      calculateVH();
   }

   private setPageTheme(id: string) {
      let theme: ThemeColors.PageTheme;

      if (id === "home" || id === "contact") {
         theme = ThemeColors.DARK_THEME_COLORS;
      } else {
         theme = ThemeColors.LIGHT_THEME_COLORS;
      }

      Object.entries(theme).forEach((c) => {
         this.DOC.documentElement.style.setProperty(...c);
      });
   }
}
