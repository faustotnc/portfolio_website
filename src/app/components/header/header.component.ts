import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
   selector: "fausto-header",
   templateUrl: "./header.component.html",
   styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
   public isMenuOpen = false;

   constructor(private router: Router) {}

   ngOnInit(): void {
      this.router.events.subscribe((event) => {
         if (event instanceof NavigationEnd) {
            this.isMenuOpen = false;
         }
      });
   }
}
