angular.module('calligraphy').controller('draw', ['$scope', '$http', function ($scope, $http) {

  $scope.strokes = [];

  $scope.init = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const W = 570, H = 300; // TODO: get these dynamically
    canvas.width = W;
    canvas.height = H;

    $scope.world = new World(ctx, W, H);
    // $scope.world.draw({ x: 120, y: 80 }); // TODO: z, a, b, stroke

    $scope.load()
  }
  
  $scope.load = function () {
    let req = {
      method: 'GET',
      url: '/api/load'
    };

    $http(req)
      .then(function ({ data }) {
        $scope.strokes = data.strokes;
      }, function (error) {
        console.log(error);
    });
  }

  $scope.arrows = function (dir) {
    let req = {
      method: 'POST',
      url: '/api/move',
      headers: { 'Content-Type': 'application/json' },
      data: { dir }
    };

    $http(req)
      .then(function ({ data }) {
        $scope.world.draw(data);
      }, function (error) {
        console.log(error);
    });
  }

}]);