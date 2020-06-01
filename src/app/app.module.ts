import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// to build the static app, run
// ng build --prod true --extract-css true --named-chunks false --optimization true --aot true

// To build the server-side rendered app, run
// npm run build:ssr
// npm run serve:ssr

// To deploy to GCP, run
// npm run deploy:gcp

import { HelperService } from './services/helper.service';

import { AppComponent } from './app.component';
import { SilkyScrollModule } from './silky-scroll/silky-scroll.module';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { FilmGrainComponent } from './components/film-grain/film-grain.component';
import { CursorTrailComponent } from './components/cursor-trail/cursor-trail.component';
import { FooterComponent } from './components/footer/footer.component';
import { KnowledgeComponent } from './components/knowledge/knowledge.component';
import { GameComponent } from './components/game/game.component';
import { ContactComponent } from './components/contact/contact.component';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { ScreenRestrictionsComponent } from './components/screen-restrictions/screen-restrictions.component'

import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        ToolbarComponent,
        FilmGrainComponent,
        CursorTrailComponent,
        FooterComponent,
        KnowledgeComponent,
        GameComponent,
        ContactComponent,
        PreloaderComponent,
        ScreenRestrictionsComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        SilkyScrollModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ],
    providers: [HelperService],
    bootstrap: [AppComponent]
})
export class AppModule { }
