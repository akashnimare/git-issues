var app = angular.module("git-issues", ["ngRoute", "ui.router", "hc.marked"]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("home", {
      url: "/home",
      templateUrl: "/views/repo.html",
      controller: "mainCtrl"
    });

    $stateProvider.state("repo", {
      url: "/:username/:reponame",
      templateUrl: "/views/repo.html",
      controller: "mainCtrl"
    });

    $stateProvider.state("about", {
      url: "/about",
      templateUrl: "/views/about.html"
    });

    $urlRouterProvider.otherwise("home");
  }
]);

app.controller("mainCtrl", [
  "$scope",
  "$http",
  "$stateParams",
  "$location",
  function($scope, $http, $stateParams, $location) {
    $scope.main = {
      page: 1
    };

    $scope.username = $stateParams.username
      ? $stateParams.username + "/" + $stateParams.reponame
      : $scope.username;

    $scope.getGitInfo = function() {
      $scope.userNotFound = false;
      $scope.loaded = false;
      $scope.nouser = false;
      $scope.isloading = true;
      $scope.loading = true;

      if ($scope.main.page <= 1) {
        $scope.disableBtn = true;
      }

      $location.url($scope.username);

      $http
        .get(
          "https://api.github.com/repos/" +
            $scope.username +
            "/issues?state=open&page=" +
            $scope.main.page +
            "&per_page=20"
        )
        .success(function(data) {
          // This data contains both pull_requests and issues since we only
          // need the issues let's filter out the pull_requests
          let getAllIssues = data.filter(Element => {
            return !Element["pull_request"];
          });
          $scope.user = getAllIssues;
          $scope.loaded = true;
          $scope.loading = true;
          $scope.isloading = false;
        })
        .error(function(err) {
          $scope.userNotFound = true;
          if (!$scope.username) {
            $scope.errorName = "Please enter a valid repo name";
          } else {
            $scope.errorName = "No open issues found for " + $scope.username + ' ' + err.message;
          }
          // console.log(err.message);
          $scope.loading = true;
          $scope.isloading = false;
        });
    };
    if ($stateParams.username) {
      $scope.getGitInfo();
    }
    $scope.nextPage = function() {
      $scope.main.page++;
      $scope.getGitInfo();
      $scope.disableBtn = false;
    };
    $scope.prePage = function() {
      $scope.main.page--;
      $scope.getGitInfo();
    };
    $scope.expandComments = function(event) {
      $http.get(event.target.id).success(function(data) {
        $scope.comments = data;
      });
    };
    $scope.UserComments = function(event) {
      $http.get(event).success(function(data) {
        $scope.comments = data;
      });
    };
  }
]);
