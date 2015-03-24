/* soxs_service.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/20/2015
 *
 */


angular.module('soxsnationApp')
    .factory('soxsService', ["soxsAuth", "$q",
        function(soxsAuth, $q) {

            function format_template_element(te) {
                var nte = {
                    name: te.name,
                    markup: te.markup,
                    properties: JSON.parse(te.properties),
                    settings: {}
                }
                if (te.settings.length > 2) {
                    console.log('Settings: ' + te.name);
                    console.log(JSON.parse(te.settings));
                    nte.settings = JSON.parse(te.settings);
                }

                return nte;
            }

/*****************************************************************************************
* soxs Templates Elements
*****************************************************************************************/


            function get_template_elements() {
                var url = '/api/soxs/template_elements';
                var deferred = $q.defer();

                soxsAuth.http_get(url)
                    .then(function(data) {
                        var te_list = [];
                        for (var i = 0; i < data.length; ++i) {
                            te_list.push(format_template_element(data[i]));
                        }
                        deferred.resolve(te_list);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function insert_template_element(te) {
                var url = '/api/soxs/template_element';
                var deferred = $q.defer();

                soxsAuth.http_post(url, te)
                    .then(function(data) {
                        deferred.resolve(data);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    })
                return deferred.promise;
            }

/*****************************************************************************************
* soxs Templates 
*****************************************************************************************/

            function get_templates() {
                var url = '/api/soxs/templates';
                var deferred = $q.defer();

                soxsAuth.http_get(url)
                    .then(function(data) {
                        var te_list = [];
                        for (var i = 0; i < data.length; ++i) {
                            te_list.push(format_template_element(data[i]));
                        }
                        deferred.resolve(te_list);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    });
                return deferred.promise;
            }

            function insert_template(t) {
                var url = '/api/soxs/template';
                var deferred = $q.defer();

                soxsAuth.http_post(url, t)
                    .then(function(data) {
                        deferred.resolve(data);
                    }, function(err) {
                        console.log('ERROR: ' + err);
                        deferred.reject(err);
                    })
                return deferred.promise;
            }




            return {
                get_template_elements: get_template_elements,
                insert_template_element: insert_template_element,
                get_templates: get_templates,
                insert_template: insert_template
            }

        }
    ])
