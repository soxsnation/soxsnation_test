alia.defineProvider({
    name: '$route',
    dependencies: ['$', '$location']
}, function($, $location) {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private variables

    var routes = {};

    var current = null;

    //var viewport = new Element();
    //var viewport = $('#alia-viewport');

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Private functions

    function load(path) {
        if (routes.hasOwnProperty(current.path)) {
            var route = routes[current.path];
            // console.log(route);
            if (route.workspace) {
                // console.log("$route.load: workspace", current.path);
                current.context = alia.stageWorkspaceContext();
                current.type = 'workspace'
            } else if (route.multiview) {
                // console.log("$route.load: multiview", current.path);
                current.context = alia.stageMultiviewContext();
                current.type = 'multiview'
            } else {
                // console.log("$route.load: view", current.path);
                current.context = alia.stageViewContext();
                current.type = 'view'
            }
            // console.log("resolve");
            alia.resolve(route.dependencies, [current.context], {
                $params: current.params,
                $query: current.query
            }).onResolve(function(args) {
                // console.log("nope");
                route.ctor.apply(null, args);
                if (current.type === 'workspace' && typeof current.query.task === 'string') {
                    var workspace = current.context;
                    var signature = workspace.signature(current.query.task, current.query);
                    if (workspace.currentSignature() !== signature) {
                        workspace.push(current.query.task, current.query);
                    }
                } else if (current.type === 'multiview' && typeof current.query.view === 'string') {
                    var multiview = current.context;
                    var signature = multiview.signature(current.query.view, current.query);
                    if (multiview.currentSignature() !== signature) {
                        multiview.push(current.query.view, current.query);
                    }
                }
            });
        }
    }

    function matcher(on, route) {
        if (!route.regex) {
            return null;
        }
        var m = route.regex.re.exec(on);
        if (!m) {
            return null;
        }
        var keys = route.regex.keys;
        var params = {};
        for (var i = 1, len = m.length; i < len; ++i) {
            var key = keys[i - 1];
            var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
            if (key && val) {
                params[key.name] = val;
            }
        }
        return params;
    }

    function parseRoute() {
        var params, match;
        for (var path in routes) {
            var params = matcher($location.path(), routes[path]);
            if (params) {
                match = {
                    path: path,
                    params: params,
                    query: $location.search()
                };
                break;
            }
        }
        return match;


        // // Match a route
        // var params, match;
        // angular.forEach(routes, function(route, path) {
        //     if (!match && (params = switchRouteMatcher($location.path(), route))) {
        //         match = inherit(route, {
        //             params: angular.extend({}, $location.search(), params),
        //             pathParams: params
        //         });
        //         match.$$route = route;
        //     }
        // });
        // // No route matched; fallback to "otherwise" route
        // return match || routes[null] && inherit(routes[null], {
        //     params: {},
        //     pathParams: {}
        // });
    }

    function pathRegExp(path, opts) {
        opts = opts || {};
        var insensitive = opts.caseInsensitiveMatch;
        var ret = {
            originalPath: path,
            re: path
        };
        var keys = ret.keys = [];
        path = path
            .replace(/([().])/g, '\\$1')
            .replace(/(\/)?:(\w+)([\?\*])?/g, function(_, slash, key, option) {
                var optional = option === '?' ? option : null;
                var star = option === '*' ? option : null;
                keys.push({
                    name: key,
                    optional: !!optional
                });
                slash = slash || '';
                return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (star && '(.+?)' || '([^/]+)') + (optional || '') + ')' + (optional || '');
            })
            .replace(/([\/$\*])/g, '\\$1');

        ret.re = new RegExp('^' + path + '$', insensitive ? 'i' : '');
        return ret;
    }

    function update(event, url) {
        // console.log(url);
        var next = parseRoute();
        if (!current || current.path !== next.path) {
            current = next;
            // console.log("load");
            load();
        } else if (current.type === 'workspace' && typeof next.query.task === 'string') {
            var workspace = current.context;
            var signature = workspace.signature(next.query.task, next.query);
            // console.log("route.update: workspace push", workspace.currentSignature() !== signature);
            if (workspace.currentSignature() !== signature) {
                workspace.push(next.query.task, next.query);
            }
        } else if (current.type === 'multiview' && typeof next.query.view === 'string') {
            var multiview = current.context;
            var signature = multiview.signature(next.query.view, next.query);
            // console.log("route.update: multiview push", multiview.currentSignature() !== signature);
            if (multiview.currentSignature() !== signature) {
                // console.log(next.query);
                multiview.push(next.query.view, next.query);
            }
        }
    }

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Events

    alia.on('locationChanged', update);

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Provider

    var provider = {};

    provider.when = function(opts, ctor) {
        routes[opts.path] = {
            path: opts.path,
            dependencies: opts.dependencies,
            regex: pathRegExp(opts.path),
            workspace: opts.workspace === true,
            multiview: opts.multiview === true,
            ctor: ctor
        };
        var params = matcher($location.path(), routes[opts.path]);
        if (params) {
            // console.log("loading");
            // console.log(opts);
            //load(opts.path);
            // console.log(opts.path);
            update(null, opts.path);
        }

        // // create redirection for trailing slashes
        // if (path) {
        //     var redirectPath = (path[path.length - 1] == '/') ? path.substr(0, path.length - 1) : path + '/';

        //     routes[redirectPath] = angular.extend({
        //             redirectTo: path
        //         },
        //         pathRegExp(redirectPath, route)
        //     );
        // }

        return this;
    };

    provider.otherwise = function(opts, ctor) {
        //this.when(opts, ctor);
        return this;
    };

    // provider.load = function(path) {
    //     load(path);
    // }


    // Return provider
    return provider;
});