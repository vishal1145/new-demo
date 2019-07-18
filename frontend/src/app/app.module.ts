import { BrowserModule } from "@angular/platform-browser";
import { NgModule, Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { AppRoutes } from "./app.routing";
import { FooterModule } from "./shared/footer/footer.module";
import { NavbarModule } from "./shared/navbar/navbar.module";
import { SidebarModule } from "./shared/sidebar/sidebar.module";
import { HttpModule } from "@angular/http";
import { PagesLayoutComponent } from "./layouts/pages/pages-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { ToastrModule } from 'ngx-toastr';
import { RlTagInputModule } from 'angular2-tag-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Angular2CsvModule } from 'angular2-csv';
import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    PagesLayoutComponent
  
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCa6ozCIbcApFNdHrp3KYLFb8zoc6ZktcA&libraries=places'
    }),
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes),
    NavbarModule,
    FooterModule,
    RlTagInputModule,
    Angular2CsvModule,
    SidebarModule,
    ToastrModule.forRoot(),
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
