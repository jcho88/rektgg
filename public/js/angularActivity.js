var ActivityApp = angular.module('ActivityApp', ['ngRoute']);

ActivityApp.config(function($locationProvider) {
  $locationProvider.html5Mode({
  enabled: true,
  requireBase: false
});
});
 
ActivityApp.controller('ActivityController', ['$http', '$location', '$scope', function($http, $location, $scope) {
  
  console.log($location.path().split('/'));
  var urlUserId = $location.path().split('/');
  console.log(urlUserId[2]);

   $http.get("http://localhost:3000/activity/" + urlUserId[2]) //need to change URL
      .success(function(data) {
        console.log(data)
        $scope.post = data;
      })

   $scope.createPost = function() {

       $http.post("http://localhost:3000/activity/post", $scope.post)
          .success(function(data) {
            $scope.post = data;
          })
          
    };


}]);


