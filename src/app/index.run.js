(function() {
  'use strict';

  angular
    .module('blankazucenalgGithubIo')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
