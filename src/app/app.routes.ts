import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { MyAccountComponent } from "./my-account/my-account.component";

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'my-account', component: MyAccountComponent },
    { path: '**', redirectTo:'dashboard'}, //default route
    
];