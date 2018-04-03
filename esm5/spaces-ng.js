import { __extends } from 'tslib';
import { Injectable, Component, NgModule } from '@angular/core';
import { BowserService, BowserModule } from 'ngx-bowser';
import { Http, QueryEncoder, RequestMethod, RequestOptions, URLSearchParams, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

var SpacesLoggingService = (function () {
    function SpacesLoggingService(bowser) {
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
    Object.defineProperty(SpacesLoggingService.prototype, "logLevel", {
        get: function () {
            var levels = Object.keys(this.levels);
            return levels[this._logLevel];
        },
        set: function (level) {
            if (this.levels[level] !== 'null') {
                this._logLevel = this.levels[level];
            }
        },
        enumerable: true,
        configurable: true
    });
    SpacesLoggingService.prototype.disableColor = function () {
        this.useColor = false;
    };
    SpacesLoggingService.prototype.criticalColors = function (background, color) {
        this.criticalBackground = background;
        this.criticalColor = color;
    };
    SpacesLoggingService.prototype.debugColors = function (background, color) {
        this.debugBackground = background;
        this.debugColor = color;
    };
    SpacesLoggingService.prototype.errorColors = function (background, color) {
        this.errorBackground = background;
        this.errorColor = color;
    };
    SpacesLoggingService.prototype.importantColors = function (background, color) {
        this.importantBackground = background;
        this.importantColor = color;
    };
    SpacesLoggingService.prototype.infoColors = function (background, color) {
        this.infoBackground = background;
        this.infoColor = color;
    };
    SpacesLoggingService.prototype.warnColors = function (background, color) {
        this.warnBackground = background;
        this.warnColor = color;
    };
    SpacesLoggingService.prototype.methodColor = function (background, color, methodName) {
        if (!methodName) {
            var methodIndex = this.methodIndex();
            var error = new Error;
            var logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                var caller = this.parseLogLine(logStack[methodIndex]);
                methodName = caller.method;
            }
        }
        if (methodName !== 'null') {
            this.methodColors[methodName] = {
                bg: background,
                color: color
            };
        }
    };
    SpacesLoggingService.prototype.moduleColor = function (background, color, moduleName) {
        if (!moduleName) {
            var methodIndex = this.methodIndex();
            var error = new Error;
            var logStack = error.stack ? error.stack.split('\n') : [];
            if (logStack.length > 0) {
                var caller = this.parseLogLine(logStack[methodIndex]);
                moduleName = caller.module;
            }
        }
        if (moduleName !== 'null') {
            this.moduleColors[moduleName] = {
                bg: background,
                color: color
            };
        }
    };
    SpacesLoggingService.prototype.log = function (level, title, msg, bg, color, headerBg, headerColor, methodIndex) {
        if (bg === void 0) { bg = '#fff'; }
        if (color === void 0) { color = '#000'; }
        if (headerBg === void 0) { headerBg = '#fff'; }
        if (headerColor === void 0) { headerColor = '#000'; }
        if (methodIndex === void 0) { methodIndex = undefined; }
        var levelNo = this.levels[level];
        if (levelNo >= this._logLevel) {
            var error = new Error;
            var logStack = error.stack ? error.stack.split('\n') : [];
            if (methodIndex === undefined) {
                methodIndex = this.methodIndex();
            }
            var caller = this.parseLogLine(logStack[methodIndex]);
            if (this.browser === 'chrome' && caller.module === 'SafeSubscriber') {
                caller = this.parseLogLine(logStack[logStack.length - 1]);
            }
            var c = this.useColor ? ' %c ' : ' ';
            var header = [
                level.toUpperCase(),
                c,
                this.getHeader(logStack[methodIndex]),
                c,
                title,
                ' '
            ].join(' ');
            if (this.moduleColors[caller.module]) {
                bg = this.moduleColors[caller.module].bg;
                color = this.moduleColors[caller.module].color;
            }
            if (this.methodColors[caller.method]) {
                bg = this.methodColors[caller.method].bg;
                color = this.methodColors[caller.method].color;
            }
            if (this.useColor) {
                console.log(header, this.css(headerBg, header), this.css(bg, color), msg);
            }
            else {
                console.log(header, msg);
            }
        }
    };
    SpacesLoggingService.prototype.getHeader = function (logLine) {
        var header;
        var data;
        var line_data;
        var module;
        var method;
        var fileName;
        var line;
        var divider1;
        var divider2;
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
    };
    SpacesLoggingService.prototype.parseLogLine = function (logLine) {
        var data;
        var line_data;
        var module;
        var method;
        var fileName;
        var line;
        if (this.browser === 'chrome') {
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
    };
    SpacesLoggingService.prototype.methodIndex = function () {
        var index = 3;
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
    };
    SpacesLoggingService.prototype.critical = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('critical', title, msg, bg, color, this.criticalBackground, this.criticalColor);
    };
    SpacesLoggingService.prototype.debug = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('debug', title, msg, bg, color, this.debugBackground, this.debugColor);
    };
    SpacesLoggingService.prototype.error = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('error', title, msg, bg, color, this.errorBackground, this.errorColor);
    };
    SpacesLoggingService.prototype.info = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('info', title, msg, bg, color, this.infoBackground, this.infoColor);
    };
    SpacesLoggingService.prototype.important = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('important', title, msg, bg, color, this.importantBackground, this.importantColor);
    };
    SpacesLoggingService.prototype.warn = function (title, msg, bg, color) {
        if (msg === void 0) { msg = ''; }
        if (bg === void 0) { bg = this.defaultBackground; }
        if (color === void 0) { color = this.defaultColor; }
        this.log('warn', title, msg, bg, color, this.warnBackground, this.warnColor);
    };
    SpacesLoggingService.prototype.css = function (background, color) {
        return [
            'background: ',
            background + '; ',
            'color: ',
            color + ';'
        ].join(' ');
    };
    return SpacesLoggingService;
}());
SpacesLoggingService.decorators = [
    { type: Injectable },
];
SpacesLoggingService.ctorParameters = function () { return [
    { type: BowserService, },
]; };
var SpacesQueryEncoder = (function (_super) {
    __extends(SpacesQueryEncoder, _super);
    function SpacesQueryEncoder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpacesQueryEncoder.prototype.encodeKey = function (k) { return encodeURIComponent(k); };
    SpacesQueryEncoder.prototype.encodeValue = function (v) { return encodeURIComponent(v); };
    return SpacesQueryEncoder;
}(QueryEncoder));
var SpacesBaseService = (function () {
    function SpacesBaseService(http, logging) {
        var _this = this;
        this.http = http;
        this.logging = logging;
        this._initialized = false;
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesBaseService');
        this.initPromise = new Promise(function (resolve, reject) {
            _this.initPromiseResolver = resolve;
            _this.initPromiseRejector = reject;
        });
    }
    SpacesBaseService.prototype.resolve = function (route, state) {
        console.log('resolve');
        console.log('route.queryParamMap.keys', route.queryParamMap.keys);
        if (!this._initialized) {
            console.log("Got params " + route.queryParamMap);
            this._params = route.queryParams;
            console.log('this._params', this._params);
            console.log('route.queryParamMap', route.queryParamMap);
            console.log('route.queryParams', route.queryParams);
            this._tcToken = decodeURIComponent(this._params['tcToken']);
            console.log('this._tcToken', this._tcToken);
            this._tcTokenExpires = this._params['tcTokenExpires'];
            this._initialized = true;
            this.initPromiseResolver();
        }
        return this.initPromise;
    };
    Object.defineProperty(SpacesBaseService.prototype, "initialized", {
        get: function () {
            return this.initPromise;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpacesBaseService.prototype, "params", {
        get: function () {
            return this._params;
        },
        enumerable: true,
        configurable: true
    });
    SpacesBaseService.prototype.param = function (name) {
        if (this.initialized) {
            var param = this._params[name];
            if (param !== undefined) {
                param = decodeURIComponent(param.replace('+', ' '));
            }
            return param;
        }
        else {
            this.logging.warn('Service is not intialized.', '');
            return '';
        }
    };
    Object.defineProperty(SpacesBaseService.prototype, "tcApiPath", {
        get: function () {
            return this.param('tcApiPath');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpacesBaseService.prototype, "tcProxyServer", {
        get: function () {
            return '';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpacesBaseService.prototype, "tcSpaceElementId", {
        get: function () {
            return this.param('tcSpaceElementId');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpacesBaseService.prototype, "tcToken", {
        get: function () {
            var buffer = 15;
            var currentSeconds = (new Date).getTime() / 1000 + buffer;
            if (this._tcTokenExpires < currentSeconds) {
                this.tcTokenRenew();
            }
            else {
                return this._tcToken;
            }
        },
        enumerable: true,
        configurable: true
    });
    SpacesBaseService.prototype.tcTokenRenew = function () {
        var _this = this;
        var params = new URLSearchParams('', new SpacesQueryEncoder());
        var options = new RequestOptions({
            method: RequestMethod.Get,
            search: params
        });
        params.set('expiredToken', this._tcToken);
        var url = [
            this._params['tcApiPath'],
            'appAuth'
        ].join('/');
        this.http.request(url, options)
            .subscribe(function (res) {
            _this.logging.debug('res', res);
            var response = res.json();
            if (response.success === true) {
                _this._tcToken = response.apiToken;
                _this._tcTokenExpires = response.apiTokenExpires;
            }
            return _this._tcToken;
        }, function (err) {
            _this.logging.error('Token Renewal Error', err);
            return _this._tcToken;
        });
    };
    SpacesBaseService.prototype.handleAjaxError = function (error) {
        var errorText = error.text();
        this.logging.error('spaces_base.service: request to ' + error.url +
            ' failed with: ', errorText);
        return Promise.reject(errorText || error);
    };
    return SpacesBaseService;
}());
SpacesBaseService.decorators = [
    { type: Injectable },
];
SpacesBaseService.ctorParameters = function () { return [
    { type: Http, },
    { type: SpacesLoggingService, },
]; };
var SpacesMessagesService = (function () {
    function SpacesMessagesService(logging) {
        this.logging = logging;
        this.msgs = [];
        this.logging.moduleColor('#00008b', '#fff', 'SpacesMessagesService');
    }
    SpacesMessagesService.prototype.showSuccess = function (summary, detail) {
        this.showMessage('success', summary, detail);
    };
    SpacesMessagesService.prototype.showInfo = function (summary, detail) {
        this.showMessage('info', summary, detail);
    };
    SpacesMessagesService.prototype.showWarning = function (summary, detail) {
        this.showMessage('warn', summary, detail);
    };
    SpacesMessagesService.prototype.showError = function (summary, detail) {
        this.showMessage('error', summary, detail);
    };
    SpacesMessagesService.prototype.showMessage = function (severity, summary, detail) {
        this.clearMessages();
        this.msgs.push({
            severity: severity,
            summary: summary,
            detail: detail
        });
    };
    SpacesMessagesService.prototype.clearMessages = function () {
        this.msgs = [];
    };
    return SpacesMessagesService;
}());
SpacesMessagesService.decorators = [
    { type: Injectable },
];
SpacesMessagesService.ctorParameters = function () { return [
    { type: SpacesLoggingService, },
]; };
var SpacesParamsResolve = (function () {
    function SpacesParamsResolve(spacesBase) {
        this.spacesBase = spacesBase;
    }
    SpacesParamsResolve.prototype.resolve = function (route) {
        console.log('BCS', this.spacesBase.params);
        return route.queryParams;
    };
    return SpacesParamsResolve;
}());
SpacesParamsResolve.decorators = [
    { type: Injectable },
];
SpacesParamsResolve.ctorParameters = function () { return [
    { type: SpacesBaseService, },
]; };
var SpacesQueryEncoder$1 = (function (_super) {
    __extends(SpacesQueryEncoder$1, _super);
    function SpacesQueryEncoder$1(logging) {
        var _this = _super.call(this) || this;
        _this.logging = logging;
        return _this;
    }
    SpacesQueryEncoder$1.prototype.encodeKey = function (k) {
        this.logging.info('Query Encoder', "Got key " + k);
        return encodeURIComponent(k);
    };
    SpacesQueryEncoder$1.prototype.encodeValue = function (v) {
        this.logging.info('Query Encoder', "Got value " + v);
        return encodeURIComponent(v);
    };
    return SpacesQueryEncoder$1;
}(QueryEncoder));
var SpacesRequestService = (function () {
    function SpacesRequestService(http, logging, spacesBase) {
        this.http = http;
        this.logging = logging;
        this.spacesBase = spacesBase;
        this.headers = new Headers();
        this.params = new URLSearchParams('', new SpacesQueryEncoder$1(this.logging));
        this.options = new RequestOptions({
            headers: this.headers,
            method: RequestMethod.Get,
            params: this.params
        });
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesRequestService');
    }
    SpacesRequestService.prototype.method = function (data) {
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
    };
    SpacesRequestService.prototype.proxy = function (data) {
        this.logging.debug('data', data);
        this.useProxy = data;
        return this;
    };
    SpacesRequestService.prototype.url = function (data) {
        this.logging.debug('data', data);
        this.requestUrl = data;
        return this;
    };
    SpacesRequestService.prototype.header = function (key, val) {
        this.headers.set(key, val);
        this.logging.debug('key', key);
        this.logging.debug('val', val);
        return this;
    };
    SpacesRequestService.prototype.authorization = function (data) {
        this.logging.debug('data', data);
        this.header('Authorization', data);
        return this;
    };
    SpacesRequestService.prototype.contentType = function (data) {
        this.logging.debug('data', data);
        this.header('Content-Type', data);
        return this;
    };
    SpacesRequestService.prototype.body = function (data) {
        this.logging.debug('data', data);
        this.options.body = data;
        return this;
    };
    SpacesRequestService.prototype.param = function (key, val) {
        this.logging.debug('key', key);
        this.logging.debug('val', val);
        this.params.set(key, val);
        return this;
    };
    SpacesRequestService.prototype.createActivityLog = function (data) {
        this.logging.debug('data', data);
        this.param('createActivityLog', String(data));
        return this;
    };
    SpacesRequestService.prototype.modifiedSince = function (data) {
        this.logging.debug('data', data);
        this.param('modifiedSince', data);
        return this;
    };
    SpacesRequestService.prototype.owner = function (data) {
        this.param('owner', data);
        return this;
    };
    SpacesRequestService.prototype.resultLimit = function (data) {
        this.logging.debug('data', data);
        this.param('resultLimit', String(data));
        return this;
    };
    SpacesRequestService.prototype.resultStart = function (data) {
        this.logging.debug('data', data);
        this.param('resultStart', String(data));
        return this;
    };
    SpacesRequestService.prototype.proxyUrl = function () {
        var params = new URLSearchParams();
        params.set('_targetUrl', this.requestUrl);
        params.appendAll(this.params);
        this.options.search = params;
        if (this.spacesBase.tcProxyServer) {
            this.requestUrl = this.spacesBase.tcProxyServer + '/secureProxy';
        }
        else {
            this.requestUrl = window.location.protocol + '//' +
                window.location.host + '/secureProxy';
        }
        this.logging.debug('this.requestUrl', this.requestUrl);
    };
    SpacesRequestService.prototype.request = function () {
        var _this = this;
        this.logging.debug('this.requestUrl', this.requestUrl);
        this.logging.debug('this.options', this.options);
        this.logging.debug('this.useProxy', this.useProxy);
        this.options.params = this.params;
        this.options.headers = this.headers;
        if (this.useProxy) {
            this.proxyUrl();
        }
        return this.http.request(this.requestUrl, this.options)
            .map(function (res) {
            _this.logging.info('res.url', res.url);
            _this.logging.info('res.status', res.status);
            return res;
        }, function (err) {
            _this.logging.error('error', err);
        });
    };
    SpacesRequestService.prototype.resetOptions = function () {
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
    };
    SpacesRequestService.prototype.handleAjaxError = function (error) {
        var errorText = error.text();
        this.logging.error('Error', 'request to ' + error.url +
            ' failed with: ' + errorText);
        return Promise.reject(errorText || error);
    };
    return SpacesRequestService;
}());
SpacesRequestService.decorators = [
    { type: Injectable },
];
SpacesRequestService.ctorParameters = function () { return [
    { type: Http, },
    { type: SpacesLoggingService, },
    { type: SpacesBaseService, },
]; };
var SpacesStorageService = (function () {
    function SpacesStorageService(logging) {
        this.logging = logging;
        this.storage = {};
        this.logging.moduleColor('#00008b', '#fff', 'SpacesStorageService');
    }
    SpacesStorageService.prototype.ngOnInit = function () {
    };
    SpacesStorageService.prototype.create = function (key, value) {
        this.storage[key] = value;
    };
    SpacesStorageService.prototype.read = function (key) {
        return this.storage[key];
    };
    SpacesStorageService.prototype.delete = function (key) {
        delete this.storage[key];
    };
    SpacesStorageService.prototype.update = function (key, value) {
        this.storage[key] = value;
    };
    return SpacesStorageService;
}());
SpacesStorageService.decorators = [
    { type: Injectable },
];
SpacesStorageService.ctorParameters = function () { return [
    { type: SpacesLoggingService, },
]; };
var SpacesUtilityService = (function () {
    function SpacesUtilityService(logging) {
        this.logging = logging;
        this.logging.moduleColor('#2878b7', '#fff', 'SpacesUtilityService');
    }
    SpacesUtilityService.prototype.isEmpty = function (obj) {
        var isEmpty = true;
        if (Object.keys(obj).length > 0 && obj.constructor === Object) {
            isEmpty = false;
        }
        return isEmpty;
    };
    SpacesUtilityService.prototype.findIndex = function (hay, needle) {
        return hay.indexOf(needle);
    };
    return SpacesUtilityService;
}());
SpacesUtilityService.decorators = [
    { type: Injectable },
];
SpacesUtilityService.ctorParameters = function () { return [
    { type: SpacesLoggingService, },
]; };
var SpacesLandingPageComponent = (function () {
    function SpacesLandingPageComponent(http, spacesBaseService, router) {
        this.http = http;
        this.spacesBaseService = spacesBaseService;
        this.router = router;
        this.missingParams = [];
        this.done = false;
    }
    SpacesLandingPageComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.spacesBaseService.initialized.then(function () {
            var params = _this.spacesBaseService.params;
            if (params.develop === 'true') {
                _this.done = true;
                _this.router.navigate(['app']);
                return;
            }
            _this.http.get('install.json', { responseType: 'json' }).subscribe(function (installJson) {
                _this.missingParams =
                    installJson['params']
                        .filter(function (param) { return param.required; })
                        .filter(function (param) { return !params[param.name]; });
                _this.done = true;
                if (_this.missingParams.length === 0) {
                    _this.router.navigate(['app']);
                }
            }, function (err) {
                console.log(err);
            });
        });
    };
    return SpacesLandingPageComponent;
}());
SpacesLandingPageComponent.decorators = [
    { type: Component, args: [{
                selector: 'spaces-landing-page',
                template: "<div *ngIf=\"!done\" class=\"centered\">\n  <h4>Checking parameters</h4>\n</div>\n<div *ngIf=\"done && missingParams.length > 0\" class=\"centered\">\n  <h4>You must configure parameters to use this app.</h4>\n</div>\n",
                styles: [".centered{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around;margin-top:150px}"]
            },] },
];
SpacesLandingPageComponent.ctorParameters = function () { return [
    { type: HttpClient, },
    { type: SpacesBaseService, },
    { type: Router, },
]; };
var SpacesModule = (function () {
    function SpacesModule() {
    }
    return SpacesModule;
}());
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
SpacesModule.ctorParameters = function () { return []; };

export { SpacesBaseService, SpacesLoggingService, SpacesMessagesService, SpacesParamsResolve, SpacesRequestService, SpacesStorageService, SpacesUtilityService, SpacesModule, SpacesLandingPageComponent as ɵa };
//# sourceMappingURL=spaces-ng.js.map
