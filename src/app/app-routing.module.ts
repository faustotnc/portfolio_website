import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageTransitionGuard } from './components/page-transition/page-transition.guard';


const routes: Routes = [
    { path: '', pathMatch: "full", loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule), canActivate: [PageTransitionGuard] },
    { path: 'about', loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule), canActivate: [PageTransitionGuard] },
    { path: 'resume', loadChildren: () => import('./components/resume/resume.module').then(m => m.ResumeModule), canActivate: [PageTransitionGuard] },
    { path: 'contact', loadChildren: () => import('./components/contact/contact.module').then(m => m.ContactModule), canActivate: [PageTransitionGuard] },
    { path: '**', redirectTo: "/" },
    // { path: 'about', loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule) },
    // { path: 'resume', loadChildren: () => import('./components/resume/resume.module').then(m => m.ResumeModule) },
    // { path: 'contact', loadChildren: () => import('./components/contact/contact.module').then(m => m.ContactModule) },
    // { path: '**', redirectTo: "/" },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        initialNavigation: 'enabled'
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
