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

    $urlRouterProvider.otherwise("home");
  }
]);

app.controller("repoCtrl", [
  "$scope",
  "$http",
  "$stateParams",
  "$location",
  function($scope, $http, $stateParams, $location) {
    console.log($scope.value);
    $scope.getGitInfo();
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
    $scope.options = [
      {
        label: "issues",
        value: "issues"
      },
      {
        label: "Pull requests",
        value: "pulls"
      }
    ];

    $scope.value = $scope.options[0].value;

    console.log("before", $scope.value);

    $scope.username = $stateParams.username
      ? $stateParams.username + "/" + $stateParams.reponame
      : $scope.username;

    $scope.getGitInfo = function() {
      $scope.userNotFound = false;
      $scope.loaded = false;
      $scope.nouser = false;
      $scope.isloading = true;
      $scope.loading = true;

      // $scope.value = $scope.value;

      $location.url($scope.username);

      console.log($scope.value);

      $http
        .get(
          "https://api.github.com/repos/" +
            $scope.username +
            "/" +
            "issues" +
            "?state=open&page=" +
            $scope.main.page +
            "&per_page=20"
        )
        .success(function(data) {
          // This data contains both pull_requests and issues since we only
          // need the issues let's filter out the pull_requests
          console.log("success", $scope.value);

          const getAllIssues = data.filter(Element => {
            return !Element["pull_request"];
          });

          const getAllPRs = data.filter(Element => {
            return Element["pull_request"];
          });

          if ($scope.value === "issues") {
            $scope.user = getAllIssues;
          }

          if ($scope.value === "pulls") {
            $scope.user = getAllPRs;
          }

          console.log($scope.user);

          $scope.loaded = true;
          $scope.loading = true;
          $scope.isloading = false;
        })
        .error(function(err) {
          $scope.userNotFound = true;
          if (!$scope.username) {
            $scope.errorName = "Please enter a vaild repo name";
          } else {
            $scope.errorName = "No open issue found for " + $scope.username;
          }
          $scope.loading = true;
          $scope.isloading = false;
        });
    };
    if ($stateParams.username) {
      // $scope.value = "issues";
      $scope.getGitInfo();
    }
    $scope.nextPage = function() {
      $scope.main.page++;
      $scope.getGitInfo();
    };
    $scope.prePage = function() {
      $scope.main.page--;
      $scope.getGitInfo();
    };
    $scope.UserComment = function(event) {
      $http.get(event.target.id).success(function(data) {
        $scope.comments = data;
      });
    };
  }
]);
