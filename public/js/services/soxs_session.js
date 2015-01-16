'use strict';

angular.module('soxsnationApp')
  .factory('soxs_session', function ($resource) {
    return $resource('/auth/session/');
  });