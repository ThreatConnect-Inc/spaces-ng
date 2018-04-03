import { Injectable, Component, NgModule } from '@angular/core';
import { BowserService, BowserModule } from 'ngx-bowser';
import { Http, QueryEncoder, RequestMethod, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesLoggingService {
    /**
     * @param {?} bowser
     */
    constructor(bowser) {
        this.bowser = bowser;
        this._logLevel = 1;
        this.useColor = true;
        this.defaultBackground = '#fff';
        this.defaultColor = '#000';
        this.criticalBackground = '#F296A1';
        this.criticalColor = '#000';
        this.debugBackground = '#9EBABA';
        this.debugColor = '#FFF';
        this.errorBackground = '#F296A1';
        this.errorColor = '#FFF';
        this.importantBackground = '#FF1493';
        this.importantColor = '#000';
        this.infoBackground = '#CCC691';
        this.infoColor = '#000';
        this.warnBackground = '#F5AD89';
        this.warnColor = '#000';
        this.methodColors = {};
        this.moduleColors = {};
        this.levels = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
            critical: 4,
            important: 5
        };
        this.browser = this.bowser.bowser.name.toLowerCase();
        this.info('Browser', this.browser);
    }
    /**
     * @return {?}
     */
    get logLevel() {
        /**
         * Return the logging level
         * @return The logging level (debug, info, warn, critical)
         */
        let /** @type {?} */ levels = Object.keys(this.levels);
        return levels[this._logLevel];
    }
    /**
     * @param {?} level
     * @return {?}
     */
    set logLevel(level) {
        /**
                 * Set the logging level
                 * @param The logging level (debug, info, warn, critical)
                 */
        if (this.levels[level] !== 'null') {
            this._logLevel = this.levels[level];
        }
    }
    /**
     * @return {?}
     */
    disableColor() {
        /**
                 * Disable colors in console logging
                 */
        this.useColor = false;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    criticalColors(background, color) {
        /**
                 * Set color for critical console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.criticalBackground = background;
        this.criticalColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    debugColors(background, color) {
        /**
                 * Set color for debug console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.debugBackground = background;
        this.debugColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    errorColors(background, color) {
        /**
                 * Set color for error console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.errorBackground = background;
        this.errorColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    importantColors(background, color) {
        /**
                 * Set color for info console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.importantBackground = background;
        this.importantColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    infoColors(background, color) {
        /**
                 * Set color for log console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.infoBackground = background;
        this.infoColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    warnColors(background, color) {
        /**
                 * Set color for warn console messages
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.warnBackground = background;
        this.warnColor = color;
    }
    /**
     * @param {?} background
     * @param {?} color
     * @param {?=} methodName
     * @return {?}
     */
    methodColor(background, color, methodName) {
        /**
                 * Set default color for the title on all logs for the current method
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        if (!methodName) {
            // try to get method name from the stack
            let /** @type {?} */ methodIndex = this.methodIndex();
            const /** @type {?} */ error = new Error;
            let /** @type {?} */ logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                let /** @type {?} */ caller = this.parseLogLine(logStack[methodIndex]);
                methodName = caller.method;
            }
        }
        if (methodName !== 'null') {
            this.methodColors[methodName] = {
                bg: background,
                color: color
            };
        }
    }
    /**
     * @param {?} background
     * @param {?} color
     * @param {?=} moduleName
     * @return {?}
     */
    moduleColor(background, color, moduleName) {
        /**
                 * Set default color for the title on all logs for the current module
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        if (!moduleName) {
            let /** @type {?} */ methodIndex = this.methodIndex();
            const /** @type {?} */ error = new Error;
            let /** @type {?} */ logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                let /** @type {?} */ caller = this.parseLogLine(logStack[methodIndex]);
                moduleName = caller.module;
            }
        }
        if (moduleName !== 'null') {
            this.moduleColors[moduleName] = {
                bg: background,
                color: color
            };
        }
    }
    /**
     * @param {?} level
     * @param {?} title
     * @param {?} msg
     * @param {?=} bg
     * @param {?=} color
     * @param {?=} headerBg
     * @param {?=} headerColor
     * @param {?=} methodIndex
     * @return {?}
     */
    log(level, title, msg, bg = '#fff', color = '#000', headerBg = '#fff', headerColor = '#000', methodIndex = undefined) {
        /**
         * Console Log the message
         * @param level - The logging level
         * @param title - The title or description of the data being logged
         * @param msg - The msg to be logged
         * @param bg - The background color in hex format.
         * @param color - The font color in hex format.
         * @param headerBg - The background color in hex format for the header.
         * @param headerColor - The font color in hex format for the header.
         * @param methodIndex - The index of the method in the stack
         */
        let /** @type {?} */ levelNo = this.levels[level];
        if (levelNo >= this._logLevel) {
            const /** @type {?} */ error = new Error;
            let /** @type {?} */ logStack = error.stack ? error.stack.split('\n') : [];
            if (methodIndex === undefined) {
                methodIndex = this.methodIndex();
            }
            // console.log('methodIndex', methodIndex);
            let /** @type {?} */ caller = this.parseLogLine(logStack[methodIndex]);
            if (this.browser === 'chrome' && caller.module === 'SafeSubscriber') {
                // best try to handle chrome stack manipulation
                caller = this.parseLogLine(logStack[logStack.length - 1]);
            }
            let /** @type {?} */ c = this.useColor ? ' %c ' : ' ';
            let /** @type {?} */ header = [
                level.toUpperCase(),
                c,
                this.getHeader(logStack[methodIndex]),
                c,
                title,
                ' '
            ].join(' ');
            // update colors if module color defined
            if (this.moduleColors[caller.module]) {
                bg = this.moduleColors[caller.module].bg;
                color = this.moduleColors[caller.module].color;
            }
            // update colors if method color defined
            if (this.methodColors[caller.method]) {
                bg = this.methodColors[caller.method].bg;
                color = this.methodColors[caller.method].color;
            }
            // console log
            if (this.useColor) {
                console.log(header, this.css(headerBg, header), this.css(bg, color), msg);
            }
            else {
                console.log(header, msg);
            }
        }
    }
    /**
     * @param {?} logLine
     * @return {?}
     */
    getHeader(logLine) {
        /**
         * Best effor to retrieve module, method, fileName, and line number from error stack.
         * @param logLine - The line from the Error stack
         * @param color - Return header with color
         * @return The module, method, fileName, and line number
         */
        let /** @type {?} */ header;
        let /** @type {?} */ data;
        let /** @type {?} */ line_data;
        let /** @type {?} */ module;
        let /** @type {?} */ method;
        let /** @type {?} */ fileName;
        let /** @type {?} */ line;
        // console.log('logLine', logLine);
        let /** @type {?} */ divider1;
        let /** @type {?} */ divider2;
        switch (this.browser) {
            case 'chrome':
                data = logLine.trim().match(/^at\s(?:new\s)?(\w+)(?:\.)?(\w+)?\s/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                module = data[1];
                method = data[2];
                fileName = line_data[1];
                line = line_data[2];
                header = '';
                divider1 = '';
                if (module) {
                    header += module;
                    divider1 = ':';
                }
                if (method) {
                    header += divider1 + method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            case 'firefox':
                data = logLine.trim().match(/(\w+)\.(?:\w+)\.(\w+)@/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                module = data[1];
                method = data[2];
                fileName = line_data[1];
                line = line_data[2];
                header = '';
                divider1 = '';
                if (module) {
                    header += module;
                    divider1 = ':';
                }
                if (method) {
                    header += divider1 + method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            case 'safari':
                data = logLine.trim().match(/^(\w+)@/) || [];
                line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
                method = data[1];
                fileName = line_data[1];
                line = line_data[2];
                header = '';
                divider1 = '';
                if (method) {
                    header += method;
                }
                divider2 = '';
                if (fileName) {
                    header += ' (' + fileName;
                    divider2 = ':';
                }
                if (line) {
                    header += divider2 + line + ')';
                }
                break;
            default:
                console.warn('Advanced logging is not supported in browser', this.browser);
        }
        return header;
    }
    /**
     * @param {?} logLine
     * @return {?}
     */
    parseLogLine(logLine) {
        /**
         * Best effor to retrieve module, method, fileName, and line number from error stack.
         * @param logLine - The line from the Error stack
         * @return The module, method, fileName, and line number
         */
        let /** @type {?} */ data;
        let /** @type {?} */ line_data;
        let /** @type {?} */ module;
        let /** @type {?} */ method;
        let /** @type {?} */ fileName;
        let /** @type {?} */ line;
        // console.log('logLine', logLine);
        // TODO - switch this to case statement to define regex so data and line_data are only set once.
        if (this.browser === 'chrome') {
            /* best effor at getting module, method, fileName and line number */
            data = logLine.trim().match(/^at\s(?:new\s)?(\w+)(?:\.)?(\w+)?\s/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        }
        else if (this.browser === 'firefox') {
            data = logLine.trim().match(/(\w+)\.(?:\w+)\.(\w+)@/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        }
        else if (this.browser === 'safari') {
            data = logLine.trim().match(/^(\w+)@/) || [];
            line_data = logLine.trim().match(/(\w+\.\w+)\:([0-9]+\:[0-9]+)/) || [];
        }
        if (data) {
            module = data[1] || 'NA';
            method = data[2] || 'NA';
        }
        if (line_data) {
            fileName = line_data[1] || '?';
            line = line_data[2] || '?';
        }
        return {
            module: module,
            method: method,
            fileName: fileName,
            line: line
        };
    }
    /**
     * @return {?}
     */
    methodIndex() {
        /**
         * Return the method index dependent on the browser.
         * @return The index number
         */
        let /** @type {?} */ index = 3;
        switch (this.browser) {
            case 'chrome':
                index = 3;
                break;
            case 'firefox':
                index = 2;
                break;
            case 'safari':
                index = 2;
                break;
            default:
                console.warn('Advanced logging is not supported in browser', this.browser);
        }
        return index;
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    critical(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Critical messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('critical', title, msg, bg, color, this.criticalBackground, this.criticalColor);
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    debug(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Debug messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('debug', title, msg, bg, color, this.debugBackground, this.debugColor);
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    error(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Error messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('error', title, msg, bg, color, this.errorBackground, this.errorColor);
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    info(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Info messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('info', title, msg, bg, color, this.infoBackground, this.infoColor);
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    important(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Warn messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('important', title, msg, bg, color, this.importantBackground, this.importantColor);
    }
    /**
     * @param {?} title
     * @param {?=} msg
     * @param {?=} bg
     * @param {?=} color
     * @return {?}
     */
    warn(title, msg = '', bg = this.defaultBackground, color = this.defaultColor) {
        /**
                 * Console Log Warn messages
                 * @param title - The title or description of the data being logged
                 * @param msg - The msg to be logged
                 * @param bg - The background color in hex format.
                 * @param color - The font color in hex format.
                 */
        this.log('warn', title, msg, bg, color, this.warnBackground, this.warnColor);
    }
    /**
     * @param {?} background
     * @param {?} color
     * @return {?}
     */
    css(background, color) {
        /**
                 * Format the CSS for console colors
                 * @param background - The background color in hex format.
                 * @param color - The font color in hex format.
                 * @return The formatted CSS string for console colors
                 */
        return [
            'background: ',
            background + '; ',
            'color: ',
            color + ';'
        ].join(' ');
    }
}
SpacesLoggingService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesLoggingService.ctorParameters = () => [
    { type: BowserService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesQueryEncoder extends QueryEncoder {
    /**
     * @param {?} k
     * @return {?}
     */
    encodeKey(k) { return encodeURIComponent(k); }
    /**
     * @param {?} v
     * @return {?}
     */
    encodeValue(v) { return encodeURIComponent(v); }
}
class SpacesBaseService {
    /**
     * @param {?} http
     * @param {?} logging
     */
    constructor(http, logging) {
        this.http = http;
        this.logging = logging;
        this._initialized = false;
        /* Set logging module parameters */
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesBaseService');
        this.initPromise = new Promise((resolve, reject) => {
            this.initPromiseResolver = resolve;
            this.initPromiseRejector = reject;
        });
    }
    /**
     * @param {?} route
     * @param {?} state
     * @return {?}
     */
    resolve(route, state) {
        console.log('resolve');
        console.log('route.queryParamMap.keys', route.queryParamMap.keys);
        if (!this._initialized) {
            console.log(`Got params ${route.queryParamMap}`);
            // this.init(route.queryParamMap);
            this._params = route.queryParams;
            console.log('this._params', this._params);
            console.log('route.queryParamMap', route.queryParamMap);
            console.log('route.queryParams', route.queryParams);
            this._tcToken = decodeURIComponent(this._params['tcToken']); // set for token renew
            console.log('this._tcToken', this._tcToken);
            this._tcTokenExpires = this._params['tcTokenExpires']; // set for token renew
            this._initialized = true;
            this.initPromiseResolver();
        }
        return this.initPromise;
    }
    /**
     * @return {?}
     */
    get initialized() {
        /**
                 * Promise resolved when Query String Parameters are parsed
                 */
        return this.initPromise;
    }
    /**
     * @return {?}
     */
    get params() {
        /**
                 * The entire parameters object from initial load of App
                 */
        return this._params;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    param(name) {
        /**
                 * Return the request parameter
                 * @param name The parameter name (key)
                 * @return Decoded URL component
                 */
        if (this.initialized) {
            // spaces need to be un-encoded from '+' before decoding
            let /** @type {?} */ param = this._params[name];
            if (param !== undefined) {
                param = decodeURIComponent(param.replace('+', ' '));
            }
            return param;
        }
        else {
            this.logging.warn('Service is not intialized.', '');
            return '';
        }
    }
    /**
     * @return {?}
     */
    get tcApiPath() {
        /**
                 * Return the ThreatConnect API Path
                 * @return The ThreatConnect API path passed in the query string parameters
                 */
        return this.param('tcApiPath');
    }
    /**
     * @return {?}
     */
    get tcProxyServer() {
        /**
                 * Return the ThreatConnect Proxy Server URL
                 * @return The ThreatConnect Proxy Server URL calculated from tcApiPath
                 */
        // return this.param('tcApiPath').replace(/\/api$/, '');
        /* The proxy server *should* be the same server as is being accessed for the Spaces app. */
        return '';
    }
    /**
     * @return {?}
     */
    get tcSpaceElementId() {
        /**
                 * Return the ThreatConnect Spaces Element Id
                 * @return The Spaces Element Id passed in the query string parameters
                 */
        return this.param('tcSpaceElementId');
    }
    /**
     * @return {?}
     */
    get tcToken() {
        /**
         * Return the ThreatConnect API Token
         * @return The API token passed in the query string parameters
         */
        let /** @type {?} */ buffer = 15;
        let /** @type {?} */ currentSeconds = (new Date).getTime() / 1000 + buffer;
        if (this._tcTokenExpires < currentSeconds) {
            this.tcTokenRenew();
        }
        else {
            return this._tcToken;
        }
    }
    /**
     * @return {?}
     */
    tcTokenRenew() {
        /**
         * Renew ThreatConnect API Token
         * @return The new ThreatConnect Token
         */
        let /** @type {?} */ params = new URLSearchParams('', new SpacesQueryEncoder()); // must be above options
        let /** @type {?} */ options = new RequestOptions({
            method: RequestMethod.Get,
            search: params
        });
        params.set('expiredToken', this._tcToken);
        let /** @type {?} */ url = [
            this._params['tcApiPath'],
            'appAuth'
        ].join('/');
        this.http.request(url, options)
            .subscribe(res => {
            this.logging.debug('res', res);
            let /** @type {?} */ response = res.json();
            if (response.success === true) {
                this._tcToken = response.apiToken;
                this._tcTokenExpires = response.apiTokenExpires;
            }
            return this._tcToken;
        }, err => {
            this.logging.error('Token Renewal Error', err);
            // bcs - should old token be returned
            return this._tcToken;
        });
    }
    /**
     * @param {?} error
     * @return {?}
     */
    handleAjaxError(error) {
        /**
         * Execute the API request
         * @param err - The https Response Object
         */
        const /** @type {?} */ errorText = error.text();
        this.logging.error('spaces_base.service: request to ' + error.url +
            ' failed with: ', errorText);
        // console.error('spaces_base.service: request to ' +
        //     error.url + ' failed with: ' + errorText);
        return Promise.reject(errorText || error);
    }
}
SpacesBaseService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesBaseService.ctorParameters = () => [
    { type: Http, },
    { type: SpacesLoggingService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesMessagesService {
    /**
     * @param {?} logging
     */
    constructor(logging) {
        this.logging = logging;
        this.msgs = [];
        this.logging.moduleColor('#00008b', '#fff', 'SpacesMessagesService');
    }
    /**
     * @param {?} summary
     * @param {?} detail
     * @return {?}
     */
    showSuccess(summary, detail) {
        this.showMessage('success', summary, detail);
    }
    /**
     * @param {?} summary
     * @param {?} detail
     * @return {?}
     */
    showInfo(summary, detail) {
        this.showMessage('info', summary, detail);
    }
    /**
     * @param {?} summary
     * @param {?} detail
     * @return {?}
     */
    showWarning(summary, detail) {
        this.showMessage('warn', summary, detail);
    }
    /**
     * @param {?} summary
     * @param {?} detail
     * @return {?}
     */
    showError(summary, detail) {
        this.showMessage('error', summary, detail);
    }
    /**
     * @param {?} severity
     * @param {?} summary
     * @param {?} detail
     * @return {?}
     */
    showMessage(severity, summary, detail) {
        this.clearMessages();
        this.msgs.push({
            severity: severity,
            summary: summary,
            detail: detail
        });
    }
    /**
     * @return {?}
     */
    clearMessages() {
        this.msgs = [];
    }
}
SpacesMessagesService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesMessagesService.ctorParameters = () => [
    { type: SpacesLoggingService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesParamsResolve {
    /**
     * @param {?} spacesBase
     */
    constructor(spacesBase) {
        /* Empty Block */
        this.spacesBase = spacesBase;
    }
    /**
     * @param {?} route
     * @return {?}
     */
    resolve(route) {
        // this.spacesBase.init(route.queryParams);
        console.log('BCS', this.spacesBase.params);
        return route.queryParams;
    }
}
SpacesParamsResolve.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesParamsResolve.ctorParameters = () => [
    { type: SpacesBaseService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesQueryEncoder$1 extends QueryEncoder {
    /**
     * @param {?} logging
     */
    constructor(logging) {
        super();
        this.logging = logging;
    }
    /**
     * @param {?} k
     * @return {?}
     */
    encodeKey(k) {
        this.logging.info('Query Encoder', `Got key ${k}`);
        return encodeURIComponent(k);
    }
    /**
     * @param {?} v
     * @return {?}
     */
    encodeValue(v) {
        this.logging.info('Query Encoder', `Got value ${v}`);
        return encodeURIComponent(v);
    }
}
class SpacesRequestService {
    /**
     * @param {?} http
     * @param {?} logging
     * @param {?} spacesBase
     */
    constructor(http, logging, spacesBase) {
        this.http = http;
        this.logging = logging;
        this.spacesBase = spacesBase;
        /**
         * Generic Request Module for ThreatConnect API
         */
        this.headers = new Headers();
        this.params = new URLSearchParams('', new SpacesQueryEncoder$1(this.logging));
        this.options = new RequestOptions({
            headers: this.headers,
            method: RequestMethod.Get,
            params: this.params
        });
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesRequestService');
    }
    /**
     * @param {?} data
     * @return {?}
     */
    method(data) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    proxy(data) {
        /**
                 * Use secureProxy
                 * @param data - Enable/Disable proxy
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.useProxy = data;
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    url(data) {
        /**
                 * Set the request URI
                 * @param data - The URL for the request
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.requestUrl = data;
        return this;
    }
    /**
     * @param {?} key
     * @param {?} val
     * @return {?}
     */
    header(key, val) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    authorization(data) {
        /**
                 * Helper method to set common authorization header
                 * @param data - The authorization header
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.header('Authorization', data);
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    contentType(data) {
        /**
                 * Helper method to set common content-type header
                 * @param data - The content-type header
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.header('Content-Type', data);
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    body(data) {
        /**
                 * The body for the request
                 * @param data - The body contents
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.options.body = data;
        return this;
    }
    /**
     * @param {?} key
     * @param {?} val
     * @return {?}
     */
    param(key, val) {
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
    /**
     * @param {?} data
     * @return {?}
     */
    createActivityLog(data) {
        /**
                 * Helper method to set common createActivityLog query string parameter
                 * @param data - The createActivityLog boolean value
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.param('createActivityLog', String(data));
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    modifiedSince(data) {
        /**
                 * Helper method to set common modifiedSince query string parameter
                 * @param data - The modifiedSince value
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.param('modifiedSince', data);
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    owner(data) {
        /**
                 * Helper method to set common owner query string parameter
                 * @param data - The owner value
                 * @return The RequestService Object
                 */
        this.param('owner', data);
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    resultLimit(data) {
        /**
                 * Helper method to set common resultLimit query string parameter
                 * @param data - The resultLimit value for pagination
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.param('resultLimit', String(data));
        return this;
    }
    /**
     * @param {?} data
     * @return {?}
     */
    resultStart(data) {
        /**
                 * Helper method to set common resultStart query string parameter
                 * @param data - The resultStart value for pagination
                 * @return The RequestService Object
                 */
        this.logging.debug('data', data);
        this.param('resultStart', String(data));
        return this;
    }
    /**
     * @return {?}
     */
    proxyUrl() {
        /**
         * Proxify the request using secureProxy
         */
        let /** @type {?} */ params = new URLSearchParams();
        params.set('_targetUrl', this.requestUrl);
        params.appendAll(this.params);
        this.options.search = params;
        // not sure why, but this broke after upgrade. replaced with above ^
        // this.params.replaceAll(params);
        if (this.spacesBase.tcProxyServer) {
            this.requestUrl = this.spacesBase.tcProxyServer + '/secureProxy';
        }
        else {
            this.requestUrl = window.location.protocol + '//' +
                window.location.host + '/secureProxy';
        }
        this.logging.debug('this.requestUrl', this.requestUrl);
    }
    /**
     * @return {?}
     */
    request() {
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
        if (this.useProxy) {
            this.proxyUrl();
        }
        return this.http.request(this.requestUrl, this.options)
            .map(res => {
            this.logging.info('res.url', res.url);
            this.logging.info('res.status', res.status);
            return res;
        }, err => {
            this.logging.error('error', err);
        });
    }
    /**
     * @return {?}
     */
    resetOptions() {
        /**
                 * Reset request options
                 * @return The RequestService Object
                 */
        this.logging.info('resetOptions', 'resetOptions');
        this.headers = new Headers();
        this.headers.set('Accept', 'application/json');
        this.params = new URLSearchParams('', new SpacesQueryEncoder$1(this.logging));
        this.useProxy = false;
        this.options = new RequestOptions({
            headers: this.headers,
            method: RequestMethod.Get,
            search: this.params
        });
        return this;
    }
    /**
     * @param {?} error
     * @return {?}
     */
    handleAjaxError(error) {
        /**
         * Execute the API request
         * @param err - The https Response Object
         */
        var /** @type {?} */ errorText = error.text();
        this.logging.error('Error', 'request to ' + error.url +
            ' failed with: ' + errorText);
        return Promise.reject(errorText || error);
    }
}
SpacesRequestService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesRequestService.ctorParameters = () => [
    { type: Http, },
    { type: SpacesLoggingService, },
    { type: SpacesBaseService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesStorageService {
    /**
     * @param {?} logging
     */
    constructor(logging) {
        this.logging = logging;
        this.storage = {};
        this.logging.moduleColor('#00008b', '#fff', 'SpacesStorageService');
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        /* empty block */
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    create(key, value) {
        this.storage[key] = value;
    }
    /**
     * @param {?} key
     * @return {?}
     */
    read(key) {
        return this.storage[key];
    }
    /**
     * @param {?} key
     * @return {?}
     */
    delete(key) {
        delete this.storage[key];
    }
    /**
     * @param {?} key
     * @param {?} value
     * @return {?}
     */
    update(key, value) {
        this.storage[key] = value;
    }
}
SpacesStorageService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesStorageService.ctorParameters = () => [
    { type: SpacesLoggingService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesUtilityService {
    /**
     * @param {?} logging
     */
    constructor(logging) {
        this.logging = logging;
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesUtilityService');
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    isEmpty(obj) {
        /**
         * Check to see if Object is empty
         * @param obj - The object to check
         */
        let /** @type {?} */ isEmpty = true;
        if (Object.keys(obj).length > 0 && obj.constructor === Object) {
            isEmpty = false;
        }
        return isEmpty;
    }
    /**
     * @param {?} hay
     * @param {?} needle
     * @return {?}
     */
    findIndex(hay, needle) {
        /**
                 * Return the index of a string in an array
                 * @param hay - The array continaing the string
                 * @param needle - The string to find
                 */
        return hay.indexOf(needle);
    }
}
SpacesUtilityService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
SpacesUtilityService.ctorParameters = () => [
    { type: SpacesLoggingService, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesLandingPageComponent {
    /**
     * @param {?} http
     * @param {?} spacesBaseService
     * @param {?} router
     */
    constructor(http, spacesBaseService, router) {
        this.http = http;
        this.spacesBaseService = spacesBaseService;
        this.router = router;
        this.missingParams = [];
        this.done = false;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.spacesBaseService.initialized.then(() => {
            const /** @type {?} */ params = this.spacesBaseService.params;
            if (params.develop === 'true') {
                this.done = true;
                this.router.navigate(['app']);
                return;
            }
            this.http.get('install.json', { responseType: 'json' }).subscribe(installJson => {
                this.missingParams =
                    installJson['params']
                        .filter(param => param.required)
                        .filter(param => !params[param.name]);
                this.done = true;
                if (this.missingParams.length === 0) {
                    this.router.navigate(['app']);
                }
            }, err => {
                console.log(err);
            });
        });
    }
}
SpacesLandingPageComponent.decorators = [
    { type: Component, args: [{
                selector: 'spaces-landing-page',
                template: `<div *ngIf="!done" class="centered">
  <h4>Checking parameters</h4>
</div>
<div *ngIf="done && missingParams.length > 0" class="centered">
  <h4>You must configure parameters to use this app.</h4>
</div>
`,
                styles: [`.centered{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around;margin-top:150px}`]
            },] },
];
/** @nocollapse */
SpacesLandingPageComponent.ctorParameters = () => [
    { type: HttpClient, },
    { type: SpacesBaseService, },
    { type: Router, },
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class SpacesModule {
}
SpacesModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SpacesLandingPageComponent
                ],
                exports: [
                    SpacesLandingPageComponent
                ],
                imports: [
                    BowserModule,
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
            },] },
];
/** @nocollapse */
SpacesModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { SpacesBaseService, SpacesLoggingService, SpacesMessagesService, SpacesParamsResolve, SpacesRequestService, SpacesStorageService, SpacesUtilityService, SpacesModule, SpacesLandingPageComponent as ɵa };
//# sourceMappingURL=spaces-ng.js.map
