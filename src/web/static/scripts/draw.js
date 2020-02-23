
angular.module('calligraphy').controller('draw', ['$scope', '$http', function ($scope, $http) {

  // SETUP

  $scope.strokes = [];
  $scope.ports = [];
  $scope.position = {
    x: 180,
    y: 120,
    z: 120,
    r: 20,
    phi: 20,
    to: {
      x: 0, y: 0, z: 0, r: 0, phi: 0
    },
    stroke: {}
  }

  $scope.init = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const W = 570, H = 300; // TODO: these should represent the paper size
    canvas.width = W;
    canvas.height = H;

    $scope.world = new World(ctx, W, H);
    $scope.world.draw($scope.position);

    $scope.load();
  }

  $scope.load = function () {
    let req = {
      method: 'GET',
      url: '/api/load'
    };

    $http(req)
      .then(function ({ data }) {
        console.log(data);
        $scope.strokes = data.strokes;
        $scope.ports = data.ports;
      }, function (error) { 
        console.log(error);
    });
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
      $scope.position.to.r -= 1;
      break;
    case 'a-south':
      $scope.position.to.r += 1;
      break;
    case 'a-west':
      $scope.position.to.phi -= 1;
      break;
    case 'a-east':
      $scope.position.to.phi += 1;
      break;
    }
    $scope.canvasDraw();
  }

  // CANVAS

  $scope.preview = function (stroke) {
    $scope.position.stroke = stroke;
    $scope.canvasDraw();
  }

  $scope.canvasDraw = function() {
    $scope.world.draw($scope.position);
  }

  // DRAW

  $scope.drawStroke = function (stroke) {
    const commands = parseCommands(stroke);
    $scope.drawCall(commands);
  }

  $scope.moveToCoords = function () {
    const to = $scope.position.to;
    const command = Object.assign({}, $scope.position.to);
    command.type = 'abs';
    $scope.drawCall([command]);
  }

  $scope.drawCall = function (commands) {
    let req = {
      method: 'POST',
      url: '/api/draw',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ commands })
    };

    $http(req)
      .then(function ({ data }) {
        $scope.position = data;
        $scope.position.to = Object.assign({}, data);
        $scope.canvasDraw();

      }, function (error) {
        console.log(error);
    });
  }

}]);

$(function(){
  $('.coords.enabled .coord').click(function(){
    $(this).children('input').focus();
  });
});