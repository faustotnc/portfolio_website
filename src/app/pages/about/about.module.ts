import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FooterModule } from "src/app/components/footer/footer.module";
import { AboutRoutingModule } from "./about-routing.module";
import { AboutComponent } from "./about.component";

@NgModule({
   declarations: [AboutComponent],
   imports: [CommonModule, FooterModule, AboutRoutingModule],
})
export class AboutModule {}
