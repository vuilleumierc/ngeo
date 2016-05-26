goog.provide('gmf.AbstractDesktopController');

goog.require('gmf');
goog.require('gmf.AbstractController');
/** @suppress {extraRequire} */
goog.require('gmf.backgroundlayerselectorDirective');
/** @suppress {extraRequire} */
goog.require('gmf.drawfeatureDirective');
/** @suppress {extraRequire} */
goog.require('gmf.elevationDirective');
/** @suppress {extraRequire} */
goog.require('gmf.mousepositionDirective');
/** @suppress {extraRequire} */
goog.require('gmf.printDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.btngroupDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.resizemapDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.FeatureHelper');
/** @suppress {extraRequire} */
goog.require('ngeo.Features');
/** @suppress {extraRequire} */
goog.require('ngeo.ScaleselectorOptions');
/** @suppress {extraRequire} */
goog.require('ngeo.scaleselectorDirective');
goog.require('ol.Map');
goog.require('ol.View');
goog.require('ol.control.ScaleLine');
goog.require('ol.control.Zoom');
goog.require('ol.interaction');
goog.require('ol.layer.Vector');
goog.require('ol.source.Vector');

gmf.module.constant('isDesktop', true);

/** @suppress {extraRequire} */
goog.require('ngeo.sortableDirective');
/** @suppress {extraRequire} */
goog.require('ngeo.SortableOptions');
/**
 * Desktop application abstract controller.
 *
 * This file includes `goog.require`'s for desktop components/directives used
 * by the HTML page and the controller to provide the configuration.
 *
 * @param {gmfx.Config} config A part of the application config.
 * @param {angular.Scope} $scope Scope.
 * @param {angular.$injector} $injector Main injector.
 * @constructor
 * @extends {gmf.AbstractController}
 * @ngInject
 * @export
 */
gmf.AbstractDesktopController = function(config, $scope, $injector) {

  var viewConfig = {
    projection: ol.proj.get('epsg:' + (config.srid || 21781))
  };
  goog.object.extend(viewConfig, config.mapViewConfig || {});

  /**
   * @type {ol.Map}
   * @export
   */
  this.map = new ol.Map({
    layers: [],
    view: new ol.View(viewConfig),
    controls: config.mapControls || [
      new ol.control.ScaleLine({
        target: document.getElementById('scaleline')
      }),
      new ol.control.Zoom()
    ],
    interactions: config.mapInteractions || ol.interaction.defaults({
      pinchRotate: false,
      altShiftDragRotate: false
    })
  });

  /**
   * @type {boolean}
   * @export
   */
  this.loginActive = false;

  /**
   * @type {boolean}
   * @export
   */
  this.toolsActive = false;

  // initialize tooltips
  $('body').tooltip({
    container: 'body',
    trigger: 'hover',
    selector: '[data-toggle="tooltip"]'
  });

  /**
   * Ngeo FeatureHelper service
   * @type {ngeo.FeatureHelper}
   */
  var ngeoFeatureHelper = $injector.get('ngeoFeatureHelper');
  ngeoFeatureHelper.setProjection(this.map.getView().getProjection());

  /**
   * Collection of features for the draw interaction
   * @type {ol.Collection.<ol.Feature>}
   */
  var ngeoFeatures = $injector.get('ngeoFeatures');

  /**
   * @type {ol.layer.Vector}
   * @export
   */
  this.drawFeatureLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
      wrapX: false,
      features: ngeoFeatures
    })
  });
  this.drawFeatureLayer.setMap(this.map);

  var $sce = $injector.get('$sce');

  /**
   * @type {ngeo.ScaleselectorOptions}
   * @export
   */
  this.scaleSelectorOptions = {
    'dropup': true
  };

  /**
   * @type {!Object.<string, string>}
   * @export
   */
  this.scaleSelectorValues = {
    '0': $sce.trustAsHtml('1&nbsp;:&nbsp;250\'000'),
    '1': $sce.trustAsHtml('1&nbsp;:&nbsp;100\'000'),
    '2': $sce.trustAsHtml('1&nbsp;:&nbsp;50\'000'),
    '3': $sce.trustAsHtml('1&nbsp;:&nbsp;20\'000'),
    '4': $sce.trustAsHtml('1&nbsp;:&nbsp;10\'000'),
    '5': $sce.trustAsHtml('1&nbsp;:&nbsp;5\'000'),
    '6': $sce.trustAsHtml('1&nbsp;:&nbsp;2\'000'),
    '7': $sce.trustAsHtml('1&nbsp;:&nbsp;1\'000'),
    '8': $sce.trustAsHtml('1&nbsp;:&nbsp;500'),
    '9': $sce.trustAsHtml('1&nbsp;:&nbsp;250'),
    '10': $sce.trustAsHtml('1&nbsp;:&nbsp;100'),
    '11': $sce.trustAsHtml('1&nbsp;:&nbsp;50')
  };

  /**
   * @type {Array.<string>}
   * @export
   */
  this.elevationLayers = ['aster', 'srtm'];

  /**
   * @type {string}
   * @export
   */
  this.elevationLayer = this.elevationLayers[0];

  /**
   * @type {Array.<gmfx.MousePositionProjection>}
   * @export
   */
  this.mousePositionProjections = [{
    code: 'EPSG:2056',
    label: 'CH1903+ / LV03',
    filter: 'ngeoNumberCoordinates::{x}, {y} m:false'
  }, {
    code: 'EPSG:21781',
    label: 'CH1903 / LV03',
    filter: 'ngeoNumberCoordinates::{x}, {y} m:false'
  }, {
    code: 'EPSG:4326',
    label: 'WGS84',
    filter: 'ngeoDMSCoordinates:2'
  }];

  goog.base(
      this, config, $scope, $injector);

  // close the login panel on successful login
  $scope.$watch(function() {
    return this.gmfUser.username;
  }.bind(this), function(newVal) {
    if (newVal !== null && this.loginActive) {
      this.loginActive = false;
    }
  }.bind(this));

};
goog.inherits(gmf.AbstractDesktopController, gmf.AbstractController);


gmf.module.controller(
    'AbstractDesktopController',
    gmf.AbstractDesktopController);
