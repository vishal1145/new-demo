import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// import { MdIconModule, MdCardModule, MdInputModule, MdCheckboxModule, MdButtonModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { PagesRoutes } from './pages.routing';
import { RlTagInputModule } from 'angular2-tag-input';
import { UsersComponent } from './Users/Users.component';
import { CustomerComponent } from './Customer/Customer.component';
import { BusinessComponent } from './Business/Business.component';
import { Angular2CsvModule } from 'angular2-csv';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    RlTagInputModule,
    ReactiveFormsModule,
    Angular2CsvModule
  ],
  declarations: [
    UsersComponent,
    BusinessComponent,
    CustomerComponent
  ],
  exports: [
  ]
})

export class PagesModule { }
