import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { RainbowCursorComponent } from './rainbow-cursor/rainbow-cursor.component'


@NgModule({
  declarations: [HomeComponent, RainbowCursorComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
