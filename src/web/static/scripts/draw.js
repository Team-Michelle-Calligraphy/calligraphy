
function buildToCommand({ x, y, z, a, b}) {
  return `to ${x} ${y} ${z} ${a} ${b}`;
}

function setPosition(to) {
  to.to = to;
  return to;
}

angular.module('calligraphy').controller('draw', ['$scope', '$http', function ($scope, $http) {

  $scope.strokes = [];
  $scope.position = {
    x: 180,
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

  $scope.canvasDraw = function() {
    $scope.world.draw($scope.position);
  }

  $scope.arrows = function (dir) {
    switch(dir) {
    case 'north':
      $scope.position.to.y -= 1;
      break;
    case 'south':
      $scope.position.to.y += 1;
      break;
    case 'west':
      $scope.position.to.x -= 1;
      break;
    case 'east':
      $scope.position.to.x += 1;
      break;
    case 'up':
      $scope.position.to.z -= 1;
      break;
    case 'down':
      $scope.position.to.z += 1;
      break;
    case 'a-north':
      $scope.position.to.a -= 1;
      break;
    case 'a-south':
      $scope.position.to.a += 1;
      break;
    case 'a-west':
      $scope.position.to.b -= 1;
      break;
    case 'a-east':
      $scope.position.to.b += 1;
      break;
    }
  }

  $scope.preview = function (stroke) {
    $scope.position.stroke = stroke;
    $scope.canvasDraw();
  }

  $scope.drawStroke = function (stroke) {
    console.log(stroke);
    let req = {
      method: 'POST',
      url: '/api/draw',
      headers: { 'Content-Type': 'application/json' },
      data: {
        commands: stroke.body
      }
    };

    $http(req)
      .then(function ({ data }) {
        $scope.world.draw(data);
      }, function (error) {
        console.log(error);
    });
  }

  $scope.moveToCoords = function () {
    const to = $scope.position.to;
    commands = buildToCommand(to);
    let req = {
      method: 'POST',
      url: '/api/draw',
      headers: { 'Content-Type': 'application/json' },
      data: {
        commands: commands
      }
    };

    $http(req)
      .then(function ({ data }) {
        // TODO: set the local data to the new data, then draw that
        // $scope.world.draw(data);
        $scope.postion = setPosition($scope.position.to);
      }, function (error) {
        console.log(error);
    });
  }

}]);