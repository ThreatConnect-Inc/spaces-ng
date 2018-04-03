import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { SpacesBaseService } from './spaces_base.service';
import { SpacesLoggingService } from './spaces_logging.service';
export declare class SpacesRequestService {
    private http;
    private logging;
    private spacesBase;
    /**
     * Generic Request Module for ThreatConnect API
     */
    private headers;
    private params;
    private options;
    private useProxy;
    private requestUrl;
    constructor(http: Http, logging: SpacesLoggingService, spacesBase: SpacesBaseService);
    method(data: string): this;
    proxy(data: boolean): this;
    url(data: string): this;
    header(key: string, val: any): this;
    authorization(data: string): this;
    contentType(data: string): this;
    body(data: any): this;
    param(key: string, val: any): this;
    createActivityLog(data: boolean): this;
    modifiedSince(data: string): this;
    owner(data: string): this;
    resultLimit(data: number): this;
    resultStart(data: number): this;
    private proxyUrl();
    request(): Observable<Response>;
    resetOptions(): this;
    private handleAjaxError(error);
}
