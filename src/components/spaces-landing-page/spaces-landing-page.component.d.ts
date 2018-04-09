import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SpacesBaseService } from '../../services/spaces_base.service';
import { Router } from '@angular/router';
export declare class SpacesLandingPageComponent implements OnInit {
    private http;
    private spacesBaseService;
    private router;
    missingParams: any[];
    done: boolean;
    constructor(http: HttpClient, spacesBaseService: SpacesBaseService, router: Router);
    ngOnInit(): void;
}
