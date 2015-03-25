/* templateBuilder.js
 *
 * Author(s):  Andrew Brown
 * Date:       3/23/2015
 *
 */



angular.module('soxsnationApp')
    .factory('snTemplateService', ["$q",
        function($q) {

        	var snTemplateElements = {
        		DIV: sn_div,
        		Button: sn_button,
        		Paragraph: sn_paragraph,
        		Heading: sn_heading
        	}

        	function sn_div(elm) {
        		console.log('sn_div');
        		var html = '<div>DIV';

        		for (var i = 0; i < elm.children.length; ++i) {
            		html += build_element_markup(schema.children[i]);
            	}

        		html += '</div>';
        		elm.markup = html;
        		return build_outter_div(elm);
        		// return html;
        	}

        	function sn_button(elm) {
        		console.log('sn_button');

        		var html = '<input type="button" enabled="false" class="btn btn-default container_item" value="{{elements.[id].properties[0].value}}">';
        		elm.markup = html;
        		return build_outter_div(elm);
        		// return html;
        	}

        	function sn_paragraph(elm) {
        		console.log('sn_paragraph');

        		var html = '<p sn-item="true" >{{elements.[id].properties[0].value}}</p>';
        		elm.markup = html;
        		return build_outter_div(elm);
        		// return html;
        	}

        	function sn_heading(elm) {
        		console.log('sn_heading');

        		var html = '<h2>{{elements.[id].properties[0].value}}</h2>';
        		elm.markup = html;
        		return build_outter_div(elm);
        		// return html;
        	}

        	

            /*****************************************************************************************
             * helper functions
             *****************************************************************************************/

            function build_item_markup(ele_obj) {
                // console.log('build_item_markup');
                // console.log(ele_obj);
                var item_markup = ele_obj.markup;

                item_markup = item_markup.replace("[id]", ele_obj.id);
                return item_markup;
            }

            function build_drop_area(ele_obj) {
                var drop_markup = "<div class='snAcceptDrop' ng-drop='true' ng-drop-success='onDropComplete1($data,$event,$id)' id='" + ele_obj.id  +"'>";
                drop_markup += build_item_markup(ele_obj);
                drop_markup += "</div";
                return drop_markup;
            }



            function build_hover_div(ele_obj) {
                console.log('build_hover_div');

                var hover_markup = "<div class='snItem {{elements." + ele_obj.id + ".css_box_class}}'>";
                if (ele_obj.hasOwnProperty("settings") && ele_obj.settings.children) {
                    hover_markup += build_drop_area(ele_obj);
                }
                else {
                    hover_markup += build_item_markup(ele_obj);
                }
                hover_markup += "</div>";
                hover_markup += '<span class="label label-info snText">' + ele_obj.id + '</span>';
                return hover_markup;
            }

            function build_click_div(ele_obj) {
                var c = "'({{selected_element_id}} == " + ele_obj.id + ") ? \"snText_selected\" : \"snText_unselected\"'";
                // console.log('c: ' + c);
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
                console.log('build_element');
                console.log(tag_obj);
                return snTemplateElements[tag_obj.name](tag_obj);

                // if (tag_obj.hasOwnProperty('markup')) {
                //     return build_outter_div(tag_obj);
                // }

                return '';
            }

            /*****************************************************************************************
             * Public functions
             *****************************************************************************************/


            function build_template_element(schema) {
                console.log('build_template_element: ' + schema.name);
                var html = build_element_markup(schema);


                return html;
            }

            function build_template(schema) {
            	console.log('build_template');
            	console.log(schema);
            	var html = '';
            	for (var i = 0; i < schema.children.length; ++i) {
            		html += build_element_markup(schema.children[i]);
            	}
            	return html;

            }

            function add_element(template_schema, element_schema, element_parent) {
            	console.log('add_element to: ' + element_parent);
            	console.log(template_schema);
            	if (template_schema.id == element_parent) {
            		template_schema.children.push(element_schema);
            		return template_schema;
            	}
            	for (var i = 0; i < template_schema.children.length; ++i) {
            		if (template_schema.children[i].id == element_parent) {
            			template_schema.children[i].children.push(element_schema);
            			return template_schema;
            		}
            		else {
            			for (var j = 0; j < template_schema.children.length; ++j) {
            				if (template_schema.children[i].children[j].id == element_parent) {
		            			template_schema.children[i].children[j].children.push(element_schema);
		            			return template_schema;
		            		}
            			}
            		}
            	}
            }

            return {
                build_element: build_template_element,
                build_template: build_template,
                add_element: add_element
            }

        }
    ]);
