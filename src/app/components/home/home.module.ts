import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HomeSceneComponent } from './home-scene/home-scene.component';


@NgModule({
    declarations: [HomeComponent, HomeSceneComponent],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule { }
