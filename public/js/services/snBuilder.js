/* snBuilder.js
 *
 * Author(s):  Andrew Brown
 * Date:       4/28/2015
 *
 */




angular.module('soxsnationApp')
    .factory('snBuilder', ["$q",
        function(soxsAuth, $q) {

            var build_options = {
                mode: 'create', //display

            }

            function build_item_markup(ele_obj) {
                    console.log('build_item_markup');
                    console.log(ele_obj);
                    var item_markup = ele_obj.markup;

                    item_markup = item_markup.replace("[id]", ele_obj.id);
                    return item_markup;
                }

                function build_drop_area(ele_obj) {

                    cb(drop_markup);
                }

                function build_hover_div(ele_obj) {
                    console.log('build_hover_div');

                    var hover_markup = "<div class='snItem {{elements." + ele_obj.id + ".css_box_class}}'>";
                    hover_markup += build_item_markup(ele_obj);
                    hover_markup += "</div>";
                    hover_markup += '<span class="label label-info snText">' + ele_obj.id + '</span>';
                    return hover_markup;
                }

                function build_click_div(ele_obj) {
                    var c = "'({{selected_element_id}} == " + ele_obj.id + ") ? \"snText_selected\" : \"snText_unselected\"'";
                    console.log('c: ' + c);
                    // var click_markup = "<div class='snText-click' ng-class=\"{true: 'snText_selected'}[selected_element_id == "+ ele_obj.id +"] \">" + ele_obj.id + " </div>";
                    // var click_markup = "<div class='snText-click {{elements." + ele_obj.id + ".css_class}}'>" + ele_obj.id + "</div>";
                    var click_markup = '<div class="snText_header"><span class="label label-primary {{elements.' + ele_obj.id + '.css_class}}">' + ele_obj.id + '</span></div>';
                    return click_markup;
                }

                function build_outter_div(ele_obj) {

                    var markup = "<div class='snOutDiv' sn-item='true' sn-item-click='onItemClick($id)'  id='" + ele_obj.id + "'>";
                    markup += build_click_div(ele_obj);
                    markup += build_hover_div(ele_obj);
                    markup += "</div>";
                    return markup;


                }

                function build_element_markup(tag_obj) {

                    return snTemplateService.build_element(tag_obj);

                    // console.log('build_element');
                    // console.log(tag_obj);
                    if (tag_obj.hasOwnProperty('markup')) {
                        return build_outter_div(tag_obj);
                    }

                    return '';
                }


            function build(template, options) {
                console.log('snBuilder::build: ' + template + ' ;; ' + options);
                var html = '<html>';


                return html;
            }

            return {
                build: build
            }
        }
    ]);
