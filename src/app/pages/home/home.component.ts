import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { SphericBlob } from "./SphericBlob";

// The 3D Scene
const homeBlob = new SphericBlob();

@Component({
   selector: "fausto-home",
   templateUrl: "./home.component.html",
   styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
   @ViewChild("SCENE_CONTAINER") private HomeScene!: ElementRef;

   constructor() {}
   ngOnInit(): void {}

   ngAfterViewInit(): void {
      const parent = this.HomeScene.nativeElement as HTMLDivElement;
      homeBlob.mountOn(parent);
      homeBlob.updateCanvasSize(parent.clientWidth, parent.clientHeight);
   }

   @HostListener("window:resize")
   private windowResize() {
      const parent = this.HomeScene.nativeElement as HTMLDivElement;
      homeBlob.updateCanvasSize(parent.clientWidth, parent.clientHeight);
   }
}
