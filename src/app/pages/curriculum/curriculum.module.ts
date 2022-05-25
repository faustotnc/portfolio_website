import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FooterModule } from "src/app/components/footer/footer.module";
import { CurriculumRoutingModule } from "./curriculum-routing.module";
import { CurriculumComponent } from "./curriculum.component";

@NgModule({
   declarations: [CurriculumComponent],
   imports: [CommonModule, FooterModule, CurriculumRoutingModule],
})
export class CurriculumModule {}
