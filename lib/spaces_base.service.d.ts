import { Http } from '@angular/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SpacesLoggingService } from './spaces_logging.service';
export declare class SpacesBaseService implements Resolve<any> {
    private http;
    private logging;
    private _params;
    private _tcToken;
    private _tcTokenExpires;
    private _initialized;
    private initPromise;
    private initPromiseResolver;
    private initPromiseRejector;
    constructor(http: Http, logging: SpacesLoggingService);
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any>;
    readonly initialized: Promise<boolean>;
    readonly params: any;
    param(name: any): string;
    readonly tcApiPath: string;
    readonly tcProxyServer: string;
    readonly tcSpaceElementId: string;
    readonly tcToken: string;
    private tcTokenRenew();
    private handleAjaxError(error);
}
