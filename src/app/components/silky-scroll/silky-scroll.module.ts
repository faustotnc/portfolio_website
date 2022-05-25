import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { SilkyScrollComponent } from "./component/silky-scroll.component";

@NgModule({
   declarations: [SilkyScrollComponent],
   imports: [CommonModule],
   exports: [SilkyScrollComponent],
})
export class SilkyScrollModule {}
