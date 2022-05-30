import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageTransitionGuard } from "./components/page-transition/page-transition.guard";

const routes: Routes = [
   {
      path: "",
      loadChildren: () => import("./pages/home/home.module").then((m) => m.HomeModule),
      canActivate: [PageTransitionGuard],
      data: { routeName: "home" },
   },
   {
      path: "contact",
      loadChildren: () => import("./pages/contact/contact.module").then((m) => m.ContactModule),
      canActivate: [PageTransitionGuard],
      data: { routeName: "contact" },
   },
   {
      path: "about",
      loadChildren: () => import("./pages/about/about.module").then((m) => m.AboutModule),
      canActivate: [PageTransitionGuard],
      data: { routeName: "about" },
   },
   {
      path: "curriculum",
      loadChildren: () => import("./pages/curriculum/curriculum.module").then((m) => m.CurriculumModule),
      canActivate: [PageTransitionGuard],
      data: { routeName: "curriculum" },
   },
   {
      path: "**",
      redirectTo: "/",
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule],
})
export class AppRoutingModule {}
