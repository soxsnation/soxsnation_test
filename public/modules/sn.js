/* sn.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/24/2015
 *
 */

(function(sn, undefined) {
    'use strict';


    sn.defineControl({
        name: 'button'
    }, function() {

        var sizes = {
            'large': 'btn-lg',
            'small': 'btn-sm',
            'xsmall': 'btn-xs'
        };

        return function(options) {

        	var elm, html;

        	html ='<button type="button" class="btn btn-default" >' +                     
                    '</button>';

        	return html;
        }

    }())


    /**********************************************************************************************************
     * Public definitions
     **********************************************************************************************************/

    sn.defineControl = function(opts, control) {
        var name = 'sn' + opts.name;
        sn[name] = function(parent, options) {

            var component = control.call(parent, options);
            return component;
        };

    }


}(window));






// alia.defineControl = function(opts, ctor) {
//     var name = 'do' + opts.name.charAt(0).toUpperCase() + opts.name.slice(1);
//     alia[name] = function(parent, options) {
//         // // ------------------------------------------------------------------
//         // // Kyle modified this
//         // var context = new Context(parent.id, undefined, parent.child_ids);
//         // Object.defineProperty(context, 'type', {
//         //     value: opts.name,
//         //     writable: false,
//         //     enumerable: true,
//         //     configurable: false
//         // });
//         // // End Kyle's changes
//         // // ------------------------------------------------------------------
//         var component = ctor.call(parent, options);
//         return component;
//     };
// };
