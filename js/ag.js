
var angular=require('angular');
var app = angular.module('he',['ngSanitize']);
app.config(function($interpolateProvider) {
	  $interpolateProvider.startSymbol('[[');
	  $interpolateProvider.endSymbol(']]');
});

module.exports={
	app:app
}