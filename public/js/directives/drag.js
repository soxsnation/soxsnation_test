/* drag.js
 *
 * Author(s):  Andrew Brown
 * Date:       2/18/2015
 *
 */

angular.module('soxsnationApp')
    .factory('Drag_Factory', function() {

        var item_layout = {};
        var layout = {};

        var layout_elements = [{
            name: 'Grid',
            class: 'layout_grid',
            text: 'This is a grid',
            options: {

            }
        }, {
            name: 'Paragraph',
            class: 'layout_paragraph',
            text: 'This is a paragraph',
            options: {

            }
        }, {
            name: 'Button',
            class: 'btn btn-info layout_button',
            text: 'This is a button',
            options: {

            }
        }];



        function update_layout(newLayout) {
            console.log('update_layout');
            layout = newLayout;
            layout = { schema: '<p>soxsItem: Item Property not found</p>' };
            notifyObservers();
        }

        function set_layout() {

        }

        var observerCallbacks = [];

        // call this when you know 'foo' has been changed
        var notifyObservers = function() {
            console.log('notifyObservers: ' + JSON.stringify(layout));
            angular.forEach(observerCallbacks, function(callback) {
                callback(layout);
            });
        };

        registerObserverCallback = function(callback) {
            observerCallbacks.push(callback);
        };


        var data = {
            foo: 'Shared service',
            item_layout: item_layout,
            layout: layout,
            layout_elements: layout_elements,
            update_layout: update_layout,
            set_layout: set_layout,
            registerObserverCallback: registerObserverCallback
        };

        return data;
    });

angular.module('soxsnationApp')
    .directive('ngDraggable', function($document, Drag_Factory) {
        return {
            restrict: 'A',
            scope: {
                dragOptions: '=ngDraggable'
            },
            link: function(scope, elem, attr) {
                // $(elem).draggable(scope.dragOptions);
                $(elem).draggable({
                    revert: 'invalid',
                    helper: 'clone',
                    // containment: $("#layout_creation_area"),
                    stop: function(event, ui) {
                        console.log('STOP: ' + JSON.stringify(scope.dragOptions));
                        // Drag_Factory.layout = scope.dragOptions;
                        Drag_Factory.update_layout(scope.dragOptions);
                    }
                });
            }
        }
    });

angular.module('soxsnationApp')
    .directive('ngDroppable', function($document, Drag_Factory) {
        return {
            restrict: 'A',
            scope: {
                dropOptions: '=ngDroppable'
            },
            link: function(scope, elem, attr) {
                $(elem).droppable({
                    // helper: 'clone',
                    drop: function(event, ui) {
                        console.log('DROPPED: ' + JSON.stringify(scope.dropOptions));
                        // scope.dropOptions['test'] = 'test value';
                        Drag_Factory.item_layout['test'] = scope.dropOptions;
                        // alert('Dropped: ' + JSON.stringify(ui.position));
                    },
                    accept: function(dragEl) {
                        // console.log('accept: ' + JSON.stringify(dragEl['context']));

                        // for (var prop in dragEl) {
                        // console.log('accept: ' + prop);
                        // console.log('accept: ' + JSON.stringify(dragEl[prop]));
                        // }

                        return true;
                        // if ($scope.list1.length >= 20) {
                        //     return false;
                        // } else {
                        //     return true;
                        // }
                    }
                });
            }
        }
    })