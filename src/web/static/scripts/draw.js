angular.module('calligraphy').controller('draw', ['$scope', '$http', function ($scope, $http) {

  $scope.strokes = [];
  $scope.position = {
    x: 120,
    y: 120,
    z: 120,
    a: 20,
    b: 20,
    to: {
      x: 0, y: 0, z: 0, a: 0, b: 0
    },
    stroke: {}
  }

  $scope.init = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const W = 570, H = 300; // TODO: get these dynamically
    canvas.width = W;
    canvas.height = H;

    $scope.world = new World(ctx, W, H);
    $scope.world.draw($scope.position);

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
    // TODO: turn dir into command
    let req = {
      method: 'POST',
      url: '/api/draw',
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

  $scope.preview = function (stroke) {
    $scope.position.stroke = stroke;
    $scope.world.draw($scope.position);
  }

  $scope.moveToCoords = function () {
    let req = {
      method: 'POST',
      url: '/api/draw',
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