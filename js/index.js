var app = angular.module("git-issues", ["ngRoute", "hc.marked"]);

app.controller("gitCtrl", function($scope, $http, marked) {
  $scope.oneAtATime = true;
  $scope.main = {
    page: 1
  };
  $scope.loaded = false;
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
          "&per_page=30"
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
      .error(function() {
        $scope.userNotFound = true;
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
