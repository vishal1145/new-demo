import { Routes } from '@angular/router';
import { UsersComponent } from './Users/Users.component';
import { CustomerComponent } from './Customer/Customer.component';
import { BusinessComponent } from './Business/Business.component';


export const PagesRoutes: Routes = [
  { path: '', redirectTo: 'users' }, 
  { path: 'users', component: UsersComponent },
  { path: 'business', component: BusinessComponent },
  { path: 'customer', component: CustomerComponent },
];


