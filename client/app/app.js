'use strict';

angular.module('thinkKidsCertificationProgramApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'formly',
  'formlyBootstrap',
  'eda.easyformGen.stepway',
  'eda.easyFormViewer',
  'ngMaterial',
  'ngFileUpload',
  'angular-loading-bar',
  'ngMessages',
  'chart.js',
])
  .config(['cfpLoadingBarProvider', cfpLoadingBarProvider => {
    cfpLoadingBarProvider.includeSpinner = false;
  }])

  .config(($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) => {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', ($rootScope, $q, $cookieStore, $location) => {
    return {
      // Add authorization token to headers
      request: config => {
        if (!config.skipAuthorization) {
          config.headers = config.headers || {};
          if ($cookieStore.get('token')) {
            config.headers.Authorization = `Bearer ${$cookieStore.get('token')}`;
          }
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: response => {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      },
    };
  })

  .run(($rootScope, $location, Auth) => {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', (event, next) => {
      Auth.isLoggedInAsync(loggedIn => {
        if (next.authenticate && !loggedIn) {
          event.preventDefault();
          $location.path('/login');
        }
      });
    });
  });
