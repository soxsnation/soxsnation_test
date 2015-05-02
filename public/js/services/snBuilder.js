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

            /***********************************************************************************************************************
             * Private functions
             ***********************************************************************************************************************/

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

            function build_snModel(snModel) {
                console.log('snBuilder::build_snModel: ' + snModel.name);
                var html =  '<div class="form-group">';
                for (var i = 0; i < snModel.fields.length; ++i) {
                    html += '<label class="col-md-2 control-label">' + snModel.fields[i].name + '</label>';
                    html += '<input type="text" class="form-control" placeholder="field" data-ng-model="active_data.' + snModel.fields[i].name + '" />';
                    html += '<br />';
                }
                html += '<br />';
                html += '<button class="btn btn-primary" data-toggle="modal" data-ng-click="add_data()">';
                html += 'Add Data';
                html += '</button>';

                html += '</div>';
                return html;
            }

            function build_add_model(snModel, scope_var, add_fun, is_parent) {
            	console.log('build_add_model: ' + snModel.name);
            	console.log(snModel);
                var markup = '<h3>' + snModel.name + '</h3>';
                if (is_parent) {
                	markup += '<form class="form-horizontal">';
                }

                // markup += '<div class="form-group">';
                for (var i = 0; i < snModel.fields.length; ++i) {
                    markup += build_add_field(snModel.fields[i], scope_var);
                }

                if (is_parent) {
                	markup += '<div class="form-group"><div class="col-sm-offset-2 col-sm-10">';
                    markup += '<button class="btn btn-primary" type="submit" data-ng-click="'+ add_fun +'()">';
                    markup += 'Add Data';
                    markup += '</button>';
                    markup += '</div>';
                    // markup += '</div>';
                    markup += '</form>';
                }
                return markup;
            }

            function build_update_model(snModel, scope_var, update_fun, is_parent) {
                console.log('build_update_model: ' + snModel.name);
                console.log(snModel);
                var markup = '<h3>' + snModel.name + '</h3>';
                if (is_parent) {
                    markup += '<form class="form-horizontal">';
                }

                // markup += '<div class="form-group">';
                for (var i = 0; i < snModel.fields.length; ++i) {
                    markup += build_add_field(snModel.fields[i], scope_var);
                }

                if (is_parent) {
                    markup += '<div class="form-group"><div class="col-sm-offset-2 col-sm-10">';
                    markup += '<button class="btn btn-primary" type="submit" data-ng-click="'+ update_fun +'()">';
                    markup += 'Update Data';
                    markup += '</button>';
                    markup += '</div>';
                    // markup += '</div>';
                    markup += '</form>';
                }
                return markup;
            }

            function build_add_field(snField, scope_var) {
            	console.log('--build_add_field: ' + snField.name + ' is of type: ' + snField.type);
                var markup = '<div class="form-group">';
                if (snField.type != 'ObjectId') {
                markup += '<label class="col-md-2 control-label">' + snField.name + '</label>';
                markup += '<div class="col-sm-8">';
            } else {
            	markup += '<div class="col-sm-1">&nbsp;</div>';
            	markup += '<div class="col-sm-10">';
            }

                if (snField.type == 'String') {
                    markup += '<input type="text" class="form-control" data-ng-model="' + scope_var + '.' + snField.name + '" />';
                } else if (snField.type == 'Number') {
                    markup += '<input type="number" class="form-control" data-ng-model="' + scope_var + '.' + snField.name + '" />';
                } else if (snField.type == 'Boolean') {
                    markup += '<input type="checkbox" data-ng-model="' + scope_var + '.' + snField.name + '" />';
                } else if (snField.type == 'Date') {
                    markup += '<input type="date" class="form-control" data-ng-model="' + scope_var + '.' + snField.name + '" />';
                } else if (snField.type == 'ObjectId') {
                	console.log('Adding field that is an object: ' + snField.name);
                	console.log(snField);
                	markup += build_add_model(snField.child, scope_var + '.' + snField.name, null, false);
                }
                markup += '</div></div>';
                return markup;
            }

            /***********************************************************************************************************************
             * Public functions
             ***********************************************************************************************************************/

            function build(template, options) {
                console.log('snBuilder::build: ' + template + ' ;; ' + options);
                var html = template.html;


                return html;
            }

            function build_add_data(snModel, scope_var, add_fun) {
                console.log('snBuilder::build_add_data: ' + snModel.name);
                return build_add_model(snModel, scope_var, add_fun, true);

            }

            function build_update_data(snModel, scope_var, update_fun) {
                console.log('snBuilder::build_update_data: ' + snModel.name);
                return build_update_model(snModel, scope_var, update_fun, true);

            }

            /***********************************************************************************************************************
             * Return
             ***********************************************************************************************************************/

            return {
                build: build,
                build_snModel: build_snModel,
                build_add_data: build_add_data,
                build_update_data: build_update_data
            }
        }
    ]);
