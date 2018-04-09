import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { SpacesBaseService } from './spaces_base.service';
import { SpacesLoggingService } from './spaces_logging.service';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpObserve } from '@angular/common/http/src/client';

@Injectable()
export class SpacesRequestService {
    /**
     * Generic Request Module for ThreatConnect API
     */

    private _method = 'GET';
    private _body;

    private _headers = new HttpHeaders();
    private _params = new HttpParams();
    private useProxy: boolean;
    private _url: string;

    constructor(
        private http: HttpClient,
        private logging: SpacesLoggingService,
        private spacesBase: SpacesBaseService
    ) {
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesRequestService');
        this.resetOptions();
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
                this._method = 'DELETE';
                break;
            case 'GET':
                this._method = 'GET';
                break;
            case 'POST':
                this._method = 'POST';
                break;
            case 'PUT':
                this._method = 'PUT';
                break;
            default:
                // todo handle this as an exception
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
        this._url = data;
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
        this._headers.set(key, val);
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
        this._body = data;
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
        this._params.set(key, val);
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
        this._params.set('_targetUrl', this._url);

        // not sure why, but this broke after upgrade. replaced with above ^
        // this.params.replaceAll(params);
        
        if (this.spacesBase.tcProxyServer) {
            this._url = this.spacesBase.tcProxyServer + '/secureProxy';
        } else {
            this._url = window.location.protocol + '//' +
                window.location.host + '/secureProxy';
        }
        this.logging.debug('this.requestUrl', this._url);
    }

    public request(): Observable<HttpResponse<Object>> {
        /**
         * Execute the API request
         * @param data - The resultStart value for pagination
         * @return The http Response Object
         */
        if (this.useProxy) { this.proxyUrl(); }


        const options =

        this.logging.debug('this.requestUrl', this._url);
        this.logging.debug('this.options', options);
        this.logging.debug('this.useProxy', this.useProxy);

        let returnable: Observable<HttpResponse<Object>>;

        switch (this._method) {
            case 'GET':
                returnable = this.http.get(this._url, {
                    headers: this._headers,
                    params: this._params,
                    responseType: 'json',
                    observe: 'response'
                });
            case 'POST':
                returnable = this.http.post(this._url, this._body, {
                    headers: this._headers,
                    params: this._params,
                    responseType: 'json',
                    observe: 'response'
                });
            case 'PUT':
                returnable = this.http.put(this._url, this._body, {
                    headers: this._headers,
                    params: this._params,
                    responseType: 'json',
                    observe: 'response'
                });
            case 'DELETE':
                returnable = this.http.delete(this._url, {
                    headers: this._headers,
                    params: this._params,
                    responseType: 'json',
                    observe: 'response'
                });
        }


        return returnable.map(
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
        this.useProxy = false;
        this._method = 'GET';
        this._body = null;
        this._headers = new HttpHeaders();
        this._params = new HttpParams();

        this._headers.set('Accept', 'application/json');
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