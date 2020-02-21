
// We need a route for start, reset, and stop
// We need to make the interface pause when the action is done
// We need to make the the buffer share a timestamp so we don't redo and old tasks
// Would be great if there was a way to read responses from the machine

angular.module('calligraphy', []).config(function ($interpolateProvider) {
	$interpolateProvider.startSymbol('[[');
	$interpolateProvider.endSymbol(']]');
});

// -----------------------------------------------------------------------------
// Global Functions
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// jQuery Main
// -----------------------------------------------------------------------------

$(function () {
});