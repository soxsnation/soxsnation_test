/* soxsItem.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/20/2015
 *
 */

angular.module('soxsnationApp')
    .directive('soxsItem', ['$compile', 'soxsItemFactory', function($compile, soxsItemFactory) {

        function get_template(typeid, cb) {
            soxsItemFactory.get_soxs_types().then(function(temps) {
                console.log('got templates');
                console.log(typeid);
                console.log(temps);

                for (var i = 0; i < temps.length; ++i) {
                    // if (temps[i]._id == '54c0620cd2b8a45b3713af3e') {
                    if (temps[i]._id == typeid) {
                        cb(temps[i].display_view);
                    }
                }
            }, function(err) {
                console.log('returning not found');
                cb('<p>soxsItem: template not found:</p>');
            })
        };

        var linker = function(scope, element, attr) {
            console.log(attr);
            get_template(attr.typeid, function(template) {
                element.html(template).show();
                $compile(element.contents());
            });

        }

        return {
            restrict: 'E',
            link: linker,
            controller: function ($scope) {

            }
            // scope: {
                // content: '='
            // }
        };

        // return {
        //     restrict: 'E',
        //     transclude: true,
        //     template: get_template(),
        //     controller: function($scope) {
        //         $scope.name = 'Casey';
        //     }
        // }

    }]);



// angular.module('soxsnationApp')
//     .directive('soxsItem',
//         function($compile, soxsItemFactory) {

//             var getTemplate = function(soxs_types, type_id) {
//                 console.log('getTemplate');
//                 console.log(soxs_types);
//                 var template = '';

//                 // switch (contentType) {
//                 //     case 'image':
//                 //         template = templates.imageTemplate;
//                 //         break;
//                 //     case 'video':
//                 //         template = templates.videoTemplate;
//                 //         break;
//                 //     case 'notes':
//                 //         template = templates.noteTemplate;
//                 //         break;
//                 // }

//                 for (var i = 0; i < soxs_types.length; ++i) {
//                     if (soxs_types[i]._id === type_id) {
//                         template = soxs_types[i].display_view;
//                         break;
//                     }
//                 }
//                 console.log('template ' + template);

//                 return template;
//             };

//             var linker = function(scope, element, attrs) {
//                 // scope.rootDirectory = 'images/';
//                 console.log('linker')

//                 soxsItemFactory.get_soxs_types().then(function(data) {
//                     var soxs_types = data;

//                     element.html(getTemplate(soxs_types, scope.content._id));

//                     $compile(element.contents())(scope);
//                 });
//             };

//             return {
//                 restrict: 'E',
//                 transclude: true,
//                 template: getTemplate(soxsItemFactory.get_soxs_types(), '54b9814af5769f302c317aeb'),
//                 controller: function($scope) {

//                 }
//             }

//             // return {
//             //     restrict: 'E',
//             //     link: linker,
//             //     scope: {
//             //         content: '='
//             //     }
//             // };
//         }
//     );