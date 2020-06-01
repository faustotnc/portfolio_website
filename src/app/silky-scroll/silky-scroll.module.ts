import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SilkyScrollComponent } from './component/silky-scroll.component';


@NgModule({
    declarations: [SilkyScrollComponent],
    imports: [
        CommonModule
    ],
    exports: [SilkyScrollComponent]
})
export class SilkyScrollModule { }
