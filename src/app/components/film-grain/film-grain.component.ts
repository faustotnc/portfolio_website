import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";
import { GrainScene } from "./GrainScene";

@Component({
   selector: "fausto-film-grain",
   templateUrl: "./film-grain.component.html",
   styleUrls: ["./film-grain.component.scss"],
})
export class FilmGrainComponent implements AfterViewInit {
   @ViewChild("GrainCanvas") public GRAIN_CANVAS!: ElementRef;

   constructor() {}

   ngAfterViewInit(): void {
      const grain = new GrainScene(this.GRAIN_CANVAS.nativeElement);

      window.addEventListener("resize", () => {
         grain.windowResize();
      });
   }
}
