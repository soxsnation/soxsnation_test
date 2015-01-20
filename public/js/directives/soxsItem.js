/* soxsItem.js
 *
 * Author(s):  Andrew Brown
 * Date:       1/20/2015
 *
 */

angular.module('soxsnationApp')
    .directive('contentItem', 
        function($compile, soxsItemFactory) {

            var getTemplate = function(soxs_types, type_id) {
                var template = '';

                // switch (contentType) {
                //     case 'image':
                //         template = templates.imageTemplate;
                //         break;
                //     case 'video':
                //         template = templates.videoTemplate;
                //         break;
                //     case 'notes':
                //         template = templates.noteTemplate;
                //         break;
                // }

                for (var i = 0; i < soxs_types.length; ++i) {
                    if (soxs_types[i]._id === type_id) {
                        template = soxs_types[i].display_view;
                        break;
                    }
                }
                console.log('template ' + template);

                return template;
            };

            var linker = function(scope, element, attrs) {
                scope.rootDirectory = 'images/';

                soxsItemFactory.get_soxs_types().then(function(data) {
                    var soxs_types = data;

                    element.html(getTemplate(soxs_types, scope.content._id));

                    $compile(element.contents())(scope);
                });
            };

            return {
                restrict: 'E',
                link: linker,
                scope: {
                    content: '='
                }
            };
        }
    );