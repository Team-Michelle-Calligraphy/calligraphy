

angular.module('calligraphy').controller('draw', ['$scope', '$http', function ($scope, $http) {

  // SETUP

  $scope.strokes = [];
  $scope.ports = [];
  $scope.selectedPort = '';
  $scope.position = {
    x: 0,
    y: 0,
    z: 0,
    r: 0,
    phi: 0,
    stroke: {}
  }
  $scope.position.to = Object.assign({}, $scope.position);

  $scope.init = function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    const W = 950 / 2, H = 1300 / 2; // these should represent the paper size
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
        $scope.position = data.position;
        $scope.position.to = Object.assign({}, data.position);
        $scope.strokes = data.strokes;
        $scope.ports = data.ports;
        $scope.selectedPort = data.selectedPort;
        $scope.BOUNDS = data.bounds;
        $scope.canvasDraw();
      }, function (error) { 
        console.log(error);
    });
  }

  $scope.config = function () {
    let req = {
      method: 'POST',
      url: '/api/config',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify({ 
        serial: $scope.selectedPort
      })
    };

    $http(req)
      .then(function ({ data }) {
        console.log(data);
      }, function (error) { 
        console.log(error);
    });
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

  $scope.updateCoord = function(coord) {
    console.log('updateCoord', coord, $scope.position.to);
    switch (coord) {
    case 'x':
      if ($scope.position.to.x < $scope.BOUNDS.x.min) {
        $scope.position.to.x = $scope.BOUNDS.x.min;
      } else if ($scope.position.to.x > $scope.BOUNDS.x.max) {
        $scope.position.to.x = $scope.BOUNDS.x.max;
      }
      break;
    case 'y':
      if ($scope.position.to.y < $scope.BOUNDS.y.min) {
        $scope.position.to.y = $scope.BOUNDS.y.min;
      } else if ($scope.position.to.y > $scope.BOUNDS.y.max) {
        $scope.position.to.y = $scope.BOUNDS.y.max;
      }
      break;
    case 'z':
      if ($scope.position.to.z < $scope.BOUNDS.z.min) {
        $scope.position.to.z = $scope.BOUNDS.z.min;
      } else if ($scope.position.to.z > $scope.BOUNDS.z.max) {
        $scope.position.to.z = $scope.BOUNDS.z.max;
      }
      break;
    case 'r':
      if ($scope.position.to.r < $scope.BOUNDS.r.min) {
        $scope.position.to.r = $scope.BOUNDS.r.min;
      } else if ($scope.position.to.r > $scope.BOUNDS.r.max) {
        $scope.position.to.r = $scope.BOUNDS.r.max;
      }
      break;
    case 'phi':
      if ($scope.position.to.phi < $scope.BOUNDS.phi.min) {
        $scope.position.to.phi = $scope.BOUNDS.phi.max - ($scope.BOUNDS.phi.min - $scope.position.to.phi);
      } else if ($scope.position.to.phi > $scope.BOUNDS.phi.max) {
        $scope.position.to.phi = $scope.BOUNDS.phi.min + ($scope.position.to.phi % $scope.BOUNDS.phi.max);
      }
      break;
    }
    $scope.canvasDraw();
  }

  $scope.drawStroke = function (stroke) {
    const commands = parseCommands(stroke);
    $scope.drawCall(commands);
  }

  $scope.moveToCoords = function () {
    const command = Object.assign({}, $scope.position.to);
    command.type = 'abs';
    $scope.drawCall([command]);
  }

  $scope.dip = function() {
    commands = [
      { type: 'up' },
      { type: 'abs', x: 10, y: 10, z: 50, r: 0, phi: 0 },
      { type: 'down' },
      { type: 'abs', x: 10, y: 10, z: 0, r: 0, phi: 0 },
      { type: 'up' }
    ];
    $scope.drawCall(commands);
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

      }, function ({ data }) {
        $scope.position = data.pos;
        $scope.position.to = Object.assign({}, data.pos);
        $scope.canvasDraw();
        console.log(data.error);
    });
  }

  // EDIT

  $scope.addNew = function () {
    $scope.strokes.unshift({
      name: 'New Stroke',
      body: 'down\n\nup',
      isEditing: true
    });
  }

  $scope.edit = function (stroke) {
    $scope.strokes.forEach(s => s.isEditing = false);
    stroke.isEditing = true;
    $scope.preview(stroke);
  }

  $scope.bodyChange = function (stroke) {
    $scope.preview(stroke);
  }

  $scope.delete = function (stroke) {
    stroke.body = '';
    $scope.save(stroke);
    $scope.strokes = $scope.strokes.filter(s => s.name !== stroke.name);
  }

  $scope.save = function (stroke) {
    let req = {
      method: 'POST',
      url: '/api/save',
      headers: { 'Content-Type': 'application/json' },
      data: JSON.stringify(stroke)
    };

    $http(req)
      .then(function ({ data }) {
        stroke.isEditing = false;
      }, function ({ data }) {
        $scope.position = data.pos;
        $scope.position.to = Object.assign({}, data.pos);
        $scope.canvasDraw();
        console.log(data.error);
    });
  }

}]);

$(function(){
  $('.coords.enabled .coord').click(function(){
    $(this).children('input').focus();
  });
});