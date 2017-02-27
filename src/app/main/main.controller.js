(function() {
  'use strict';

  angular
    .module('blankazucenalgGithubIo')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout) {
    var vm = this;

    $timeout(function() {
      angular.element('.button-collapse').sideNav();
      angular.element('.parallax').parallax();
      angular.element('.scrollspy').scrollSpy();

      malarkey(document.querySelector('#fullname')).type('Blanca Azucena López Garduño').pause()
      malarkey(document.querySelector('#birthdate')).type('July 9th, 1993').pause()
      malarkey(document.querySelector('#place')).type('Mexico City, Mexico').pause()
      malarkey(document.querySelector('#studies')).type('Computer Science Engineering').pause()
      malarkey(document.querySelector('#bio')).type('I like learning things, and developing new stuff. I like maths, reading, dancing, watching movies. I love music. Bassist.').pause()
      malarkey(document.querySelector('#skills')).type('Web development, data bases, data visualizations, software engineering, I can roll my tongue.').pause()
    }, 0);
  }
})();
