import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { SpacesBaseService } from './services/spaces_base.service';
import { SpacesLoggingService } from './services/spaces_logging.service';
import { SpacesMessagesService } from './services/spaces_messages.service';
import { SpacesParamsResolve } from './services/spaces_params.resolve';
import { SpacesRequestService } from './services/spaces_request.service';
import { SpacesStorageService } from './services/spaces_storage.service';
import { SpacesUtilityService } from './services/spaces_utilities.service';

// Third part
import { BowserModule } from 'ngx-bowser';
import { SpacesLandingPageComponent } from './components/spaces-landing-page/spaces-landing-page.component';

@NgModule({
    declarations: [
        SpacesLandingPageComponent
    ],
    exports: [
        SpacesLandingPageComponent
    ],
    imports: [
        BowserModule,
        CommonModule,
        BrowserModule,
        HttpClientModule
    ],
    providers: [
        SpacesBaseService,
        SpacesLoggingService,
        SpacesMessagesService,
        SpacesParamsResolve,
        SpacesRequestService,
        SpacesStorageService,
        SpacesUtilityService,
    ]
})
export class SpacesModule { }