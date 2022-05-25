import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FancyUnderlineComponent } from "./components/fancy-underline/fancy-underline.component";
import { FilmGrainComponent } from "./components/film-grain/film-grain.component";
import { HeaderComponent } from "./components/header/header.component";
import { PageMenuComponent } from "./components/page-menu/page-menu.component";
import { PageTransitionComponent } from "./components/page-transition/page-transition.component";
import { PreloaderComponent } from "./components/preloader/preloader.component";
import { SilkyScrollModule } from "./components/silky-scroll/silky-scroll.module";

@NgModule({
   declarations: [
      AppComponent,
      HeaderComponent,
      FancyUnderlineComponent,
      FilmGrainComponent,
      PageMenuComponent,
      PageTransitionComponent,
      PreloaderComponent,
   ],
   imports: [BrowserModule, AppRoutingModule, SilkyScrollModule],
   providers: [],
   bootstrap: [AppComponent],
})
export class AppModule {}
