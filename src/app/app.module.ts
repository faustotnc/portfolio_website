import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// to build the static app, run
// ng build --prod true --extract-css true --named-chunks false --optimization true --aot true

// To build the server-side rendered app, run
// npm run build:ssr
// npm run serve:ssr

// To deploy to GCP, run
// npm run deploy:gcp

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { FilmGrainComponent } from './components/film-grain/film-grain.component';
import { SilkyScrollModule } from "./silky-scroll/silky-scroll.module";
import { HelperService } from './services/helper.service';
import { MouseCursorComponent } from './components/mouse-cursor/mouse-cursor.component';
import { PageTransitionComponent } from './components/page-transition/page-transition.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
    declarations: [
        AppComponent, ToolbarComponent, FilmGrainComponent, PreloaderComponent,
        PageTransitionComponent, MouseCursorComponent
    ],
    imports: [
        HammerModule, BrowserModule.withServerTransition({ appId: 'serverApp' }), AppRoutingModule, SilkyScrollModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [HelperService],
    bootstrap: [AppComponent]
})
export class AppModule { }
