import { Injectable } from '@angular/core';
import {
    Headers,
    Http,
    QueryEncoder,
    RequestMethod,
    RequestOptions,
    Response,
    URLSearchParams
}
    from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { SpacesBaseService } from './spaces_base.service';
import { SpacesLoggingService } from './spaces_logging.service';


class SpacesQueryEncoder extends QueryEncoder {
    constructor(private logging: SpacesLoggingService) {
        super();
    }

    encodeKey(k: string): string {
        this.logging.info('Query Encoder', `Got key ${k}`);
        return encodeURIComponent(k);
    }
    encodeValue(v: string): string {
        this.logging.info('Query Encoder', `Got value ${v}`);
        return encodeURIComponent(v);
    }
}


@Injectable()
export class SpacesRequestService {
    /**
     * Generic Request Module for ThreatConnect API
     */

    private headers = new Headers();
    private params = new URLSearchParams('', new SpacesQueryEncoder(this.logging));  // must be above options
    private options = new RequestOptions({
        headers: this.headers,
        method: RequestMethod.Get,
        params: this.params
    });
    private useProxy: boolean;
    private requestUrl: string;

    constructor(
        private http: Http,
        private logging: SpacesLoggingService,
        private spacesBase: SpacesBaseService
    ) {
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesRequestService');
    }

    public method(data: string) {
        /**
         * Set the HTTP method
         * @param data - The HTTP Method (DELETE, GET, POST, PUT)
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        switch (data.toUpperCase()) {
            case 'DELETE':
                this.options.method = RequestMethod.Delete;
                break;
            case 'GET':
                this.options.method = RequestMethod.Get;
                break;
            case 'POST':
                this.options.method = RequestMethod.Post;
                break;
            case 'PUT':
                this.options.method = RequestMethod.Put;
                break;
            default:
                this.options.method = RequestMethod.Get;
                break;
        }
        return this;
    }

    public proxy(data: boolean) {
        /**
         * Use secureProxy
         * @param data - Enable/Disable proxy
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.useProxy = data;
        return this;
    }

    public url(data: string) {
        /**
         * Set the request URI
         * @param data - The URL for the request
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.requestUrl = data;
        return this;
    }

    //
    // headers
    //

    public header(key: string, val: any) {
        /**
         * Add a header to the request
         * @param key - The header key
         * @param val - The header value
         * @return The RequestService Object
         */
        this.headers.set(key, val);
        this.logging.debug('key', key);
        this.logging.debug('val', val);
        return this;
    }

    // common headers

    public authorization(data: string) {
        /**
         * Helper method to set common authorization header
         * @param data - The authorization header
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.header('Authorization', data);
        return this;
    }

    public contentType(data: string) {
        /**
         * Helper method to set common content-type header
         * @param data - The content-type header
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.header('Content-Type', data);
        return this;
    }

    //
    // body
    //

    public body(data: any) {
        /**
         * The body for the request
         * @param data - The body contents
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.options.body = data;
        return this;
    }

    //
    // params
    //

    public param(key: string, val: any) {
        /**
         * Add a query string parameter to the request
         * @param key - The parameter key
         * @param val - The parameter value
         * @return The RequestService Object
         */
        this.logging.debug('key', key);
        this.logging.debug('val', val);
        this.params.set(key, val);
        return this;
    }

    // common paramaeters

    public createActivityLog(data: boolean) {
        /**
         * Helper method to set common createActivityLog query string parameter
         * @param data - The createActivityLog boolean value
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.param('createActivityLog', String(data));
        return this;
    }

    public modifiedSince(data: string) {
        /**
         * Helper method to set common modifiedSince query string parameter
         * @param data - The modifiedSince value
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.param('modifiedSince', data);
        return this;
    }

    public owner(data: string) {
        /**
         * Helper method to set common owner query string parameter
         * @param data - The owner value
         * @return The RequestService Object
         */
        this.param('owner', data);
        return this;
    }

    public resultLimit(data: number) {
        /**
         * Helper method to set common resultLimit query string parameter
         * @param data - The resultLimit value for pagination
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.param('resultLimit', String(data));
        return this;
    }

    public resultStart(data: number) {
        /**
         * Helper method to set common resultStart query string parameter
         * @param data - The resultStart value for pagination
         * @return The RequestService Object
         */
        this.logging.debug('data', data);
        this.param('resultStart', String(data));
        return this;
    }

    private proxyUrl() {
        /**
         * Proxify the request using secureProxy
         */
        let params = new URLSearchParams();
        params.set('_targetUrl', this.requestUrl);
        params.appendAll(this.params);
        this.options.search = params;

        // not sure why, but this broke after upgrade. replaced with above ^
        // this.params.replaceAll(params);

        if (this.spacesBase.tcProxyServer) {
            this.requestUrl = this.spacesBase.tcProxyServer + '/secureProxy';
        } else {
            this.requestUrl = window.location.protocol + '//' +
                window.location.host + '/secureProxy';
        }
        this.logging.debug('this.requestUrl', this.requestUrl);
    }

    public request(): Observable<Response> {
        /**
         * Execute the API request
         * @param data - The resultStart value for pagination
         * @return The http Response Object
         */
        this.logging.debug('this.requestUrl', this.requestUrl);
        this.logging.debug('this.options', this.options);
        this.logging.debug('this.useProxy', this.useProxy);

        this.options.params = this.params;
        this.options.headers = this.headers;

        if (this.useProxy) { this.proxyUrl(); }
        return this.http.request(this.requestUrl, this.options)
            .map(
                res => {
                    this.logging.info('res.url', res.url);
                    this.logging.info('res.status', res.status);
                    return res;
                },
                err => {
                    this.logging.error('error', err);
                }
            );
    }

    public resetOptions() {
        /**
         * Reset request options
         * @return The RequestService Object
         */
        this.logging.info('resetOptions', 'resetOptions');
        this.headers = new Headers();
        this.headers.set('Accept', 'application/json');
        this.params = new URLSearchParams('', new SpacesQueryEncoder(this.logging));
        this.useProxy = false;
        this.options = new RequestOptions({
            headers: this.headers,
            method: RequestMethod.Get,
            search: this.params
        });
        return this;
    }

    private handleAjaxError(error: Response) {
        /**
         * Execute the API request
         * @param err - The https Response Object
         */
        var errorText = error.text();
        this.logging.error('Error', 'request to ' + error.url +
            ' failed with: ' + errorText);
        return Promise.reject(errorText || error);
    }
}