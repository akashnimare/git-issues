var app = angular.module("git-issues", ["ngRoute", "ui.router", "hc.marked"]);

app.config([
  "$stateProvider",
  "$urlRouterProvider",
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("home", {
      url: "/home",
      templateUrl: "/home.html",
      controller: "gitCtrl"
    });

    $stateProvider.state("repo", {
      url: "/:username/:reponame",
      templateUrl: "/repo.html",
      controller: "repoCtrl"
    });

    $urlRouterProvider.otherwise("home");
  }
]);

app.controller("repoCtrl", [
  "$scope",
  "$stateParams",
  "$http",
  function($scope, $stateParams, $http, marked) {
    $scope.msg = $stateParams.username + " " + $stateParams.reponame;
    console.log($stateParams.username);
    console.log($stateParams.reponame);
    $scope.oneAtATime = true;
    $scope.main = {
      page: 1
    };
    $scope.loaded = false;
    $http
      .get(
        "https://api.github.com/repos/" +
          $stateParams.username +
          "/" +
          $stateParams.reponame +
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
      })
      .error(function(err) {
        $scope.userNotFound = true;
        if (!$scope.username) {
          $scope.errorName = "Please enter a vaild repo name";
        } else {
          $scope.errorName = "No open issue found for " + $scope.username;
        }
      });
    $scope.UserComment = function(event) {
      $http.get(event.target.id).success(function(data) {
        $scope.comments = data;
      });
    };
    $scope.getGitInfo = function() {
    $scope.userNotFound = false;
    $scope.loaded = false;
    $scope.nouser = false;
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
      })
      .error(function(err) {
        $scope.userNotFound = true;
        if (!$scope.username) {
          $scope.errorName = "Please enter a vaild repo name";
        } else {
          $scope.errorName = "No open issue found for " + $scope.username;
        }
      })};
    // };
    $scope.nextPage = function() {
      $scope.main.page++;
      $scope.getGitInfo();
    };
    $scope.prePage = function() {
      $scope.main.page--;
      $scope.getGitInfo();
    };
  }
]);

app.controller("gitCtrl", function($scope, $http, marked) {
  $scope.oneAtATime = true;
  $scope.main = {
    page: 1
  };
  $scope.loaded = false;
  $scope.errorName = "";
  $scope.getGitInfo = function() {
    $scope.userNotFound = false;
    $scope.loaded = false;
    $scope.nouser = false;
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
      })
      .error(function(err) {
        $scope.userNotFound = true;
        if (!$scope.username) {
          $scope.errorName = "Please enter a vaild repo name";
        } else {
          $scope.errorName = "No open issue found for " + $scope.username;
        }
      });
    $scope.UserComment = function(event) {
      $http.get(event.target.id).success(function(data) {
        $scope.comments = data;
      });
    };
  };
  $scope.nextPage = function() {
    $scope.main.page++;
    $scope.getGitInfo();
  };
  $scope.prePage = function() {
    $scope.main.page--;
    $scope.getGitInfo();
  };
});
