import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FooterModule } from "src/app/components/footer/footer.module";
import { ContactRoutingModule } from "./contact-routing.module";
import { ContactComponent } from "./contact.component";

@NgModule({
   declarations: [ContactComponent],
   imports: [CommonModule, FooterModule, ContactRoutingModule],
})
export class ContactModule {}
