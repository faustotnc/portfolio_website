import { Component, OnInit } from "@angular/core";
import { SilkyScrollService } from "src/app/components/silky-scroll";

@Component({
   selector: "fausto-about",
   templateUrl: "./about.component.html",
   styleUrls: ["./about.component.scss"],
})
export class AboutComponent implements OnInit {
   constructor(private SilkyScroller: SilkyScrollService) {}

   ngOnInit(): void {
      this.SilkyScroller.requestScrollerUpdate();
   }
}
