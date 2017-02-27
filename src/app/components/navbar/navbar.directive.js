(function() {
  'use strict';

  angular
    .module('blankazucenalgGithubIo')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/navbar/navbar.html',
      scope: {
          title: '='
      },
      controller: NavbarController,
      controllerAs: 'vm',
      bindToController: true
    };

    return directive;

    /** @ngInject */
    function NavbarController($timeout) {
      var vm = this;

      $timeout(function() {
        $('.dropdown-button').dropdown();
      }, 0);
    }
  }

})();
