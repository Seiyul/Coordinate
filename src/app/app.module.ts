import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { DialogComponent } from './dialog/dialog.component';
import { CreateComponent } from './create/create.component';
import { BlockedComponent } from './blocked/blocked.component';
import { CustomSnackbarComponent } from './custom-snackbar/custom-snackbar.component';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        SettingsComponent,
        DialogComponent,
        CreateComponent,
        BlockedComponent,
        CustomSnackbarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MaterialModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
