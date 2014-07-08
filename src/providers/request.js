'use strict';

alia.defineProvider({
    name: '$request',
    dependencies: ['$']
}, function($) {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions

    function compose(url, params, query) {
        for (var p in params) {
            url = url.replace(':' + p, params[p]);
        }
        var q = [];
        if (Array.isArray(query)) {
            for (var i = 0; i < query.length; ++i) {
                if (query[i].hasOwnProperty('key') && query[i].hasOwnProperty('value')) {
                    q.push(query[i].key + '=' + query[i].value);
                }
            }
        } else {
            for (var p in query) {
                if (query.hasOwnProperty(p)) {
                    q.push(p + '=' + query[p].toString());
                }
            }
        }
        if (q.length > 0) {
            url += "?" + q.join('&');
        }
        return url;
    }

    // function fromAjax(ajax, verbose) {
    //     return Bacon.fromBinder(function(sink) {
    //         ajax.then(function(data, textStatus, jqXHR) {
    //             if (verbose === true) {
    //                 return sink({
    //                     body: data,
    //                     status: textStatus,
    //                     res: jqXHR
    //                 });
    //             } else {
    //                 return sink(data);
    //             }
    //         }, function(jqXHR, textStatus, errorThrown) {
    //             return sink(new Bacon.Error(jqXHR));
    //         });
    //         return function() {};
    //     });
    // };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Provider

    var $request = function(options) {
        var settings = {
            url: compose(options.url, options.params, options.query),
            type: (options.method) ? options.method : 'GET'
        };
        if (options.json) {
            settings.data = JSON.stringify(options.json);
            settings.contentType = 'application/json';
            settings.processData = false;
        }
        $.extend(true, options, settings);
        var promise = $.ajax(options);
        return alia.deferred(function(resolve, reject) {
            promise.then(function(data, textStatus, jqXHR) {
                resolve({
                    body: data,
                    status: textStatus,
                    statusCode: jqXHR.status,
                    xhr: jqXHR
                });
            }, function(jqXHR, textStatus, errorThrown) {
                var res = {
                    error: errorThrown,
                    status: textStatus,
                    statusCode: jqXHR.status,
                    xhr: jqXHR
                };
                var event = alia.broadcast('requestError', [res]);
                if (event.defaultPrevented) {
                    //parse(currBrowserUrl);
                } else {
                    //subject.onError(res);
                }
                reject(new Bacon.Error(res));
            });
        });

        // return Bacon.fromBinder(function(sink) {
        //     promise.then(function(data, textStatus, jqXHR) {
        //         sink({
        //             body: data,
        //             status: textStatus,
        //             statusCode: jqXHR.status,
        //             xhr: jqXHR
        //         });
        //     }, function(jqXHR, textStatus, errorThrown) {
        //         var res = {
        //             error: errorThrown,
        //             status: textStatus,
        //             statusCode: jqXHR.status,
        //             xhr: jqXHR
        //         };
        //         var event = alia.broadcast('requestError', [res]);
        //         if (event.defaultPrevented) {
        //             //parse(currBrowserUrl);
        //         } else {
        //             //subject.onError(res);
        //         }
        //         sink(new Bacon.Error(res));
        //     });
        // });
    };

    $request.get = function(url, params, query) {
        return $request({
            url: url,
            method: 'GET',
            params: params,
            query: query,
            xhrFields: {
                withCredentials: true
            }
        });
    };

    $request.post = function(url, params, query, body) {
        switch (arguments.length) {
            case 2:
                body = params;
                params = null;
                break;
            case 3:
                body = query;
                query = null;
                break;
            case 4:
                break;
        }
        return $request({
            url: url,
            method: 'POST',
            params: params,
            query: query,
            json: body,
            xhrFields: {
                withCredentials: true
            }
        });
    };

    $request.put = function(url, params, query, body) {
        switch (arguments.length) {
            case 2:
                body = params;
                params = null;
                break;
            case 3:
                body = query;
                query = null;
                break;
            case 4:
                break;
        }
        return $request({
            url: url,
            method: 'PUT',
            params: params,
            query: query,
            json: body
        });
    };

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Return provider

    return $request;
});