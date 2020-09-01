// The MIT License (MIT)
//
// Copyright (c) 2017-2020 Camptocamp SA
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import angular from 'angular';
import ngeoDatasourceDataSources from 'ngeo/datasource/DataSources.js';
import ngeoMapLayerHelper from 'ngeo/map/LayerHelper.js';
import {getUid as olUtilGetUid} from 'ol/util.js';

/**
 * @type {angular.IModule}
 * @hidden
 */
const module = angular.module('gmfLayertreeDatasourceGroupTreeComponent', [
  ngeoDatasourceDataSources.name,
  ngeoMapLayerHelper.name,
]);

module.run(
  /**
   * @ngInject
   * @param {angular.ITemplateCacheService} $templateCache
   */
  ($templateCache) => {
    $templateCache.put(
      'gmf/layertree/datasourceGroupTreeComponent',
      // @ts-ignore: webpack
      require('./datasourceGroupTreeComponent.html')
    );
  }
);

module.value(
  'gmfLayertreeDatasourceGroupTreeTemplateUrl',
  /**
   * @param {angular.IAttributes} $attrs Attributes.
   * @return {string} The template url.
   */
  ($attrs) => {
    const templateUrl = $attrs['gmfLayertreeDatasourceGroupTreeTemplateUrl'];
    return templateUrl !== undefined ? templateUrl : 'gmf/layertree/datasourceGroupTreeComponent';
  }
);

/**
 * @param {angular.IAttributes} $attrs Attributes.
 * @param {function(angular.IAttributes): string} gmfLayertreeDatasourceGroupTreeTemplateUrl
 *    Template function.
 * @return {string} Template URL.
 * @ngInject
 * @private
 * @hidden
 */
function gmfLayertreeDatasourceGroupTreeTemplateUrl($attrs, gmfLayertreeDatasourceGroupTreeTemplateUrl) {
  return gmfLayertreeDatasourceGroupTreeTemplateUrl($attrs);
}

/**
 * @private
 * @hidden
 */
class Controller {
  /**
   * @param {angular.IScope} $scope Angular scope.
   * @param {import("ngeo/datasource/DataSources.js").DataSource} ngeoDataSources Ngeo data sources service.
   * @param {import("ngeo/map/LayerHelper.js").LayerHelper} ngeoLayerHelper Ngeo data sources service.
   * @ngInject
   * @ngdoc controller
   * @ngname GmfDatasourcegrouptreeController
   */
  constructor($scope, ngeoDataSources, ngeoLayerHelper) {
    // Binding properties

    /**
     * @type {?import("ngeo/datasource/Group.js").default}
     */
    this.group = null;

    // Injected properties

    /**
     * @type {angular.IScope}
     * @private
     */
    this.scope_ = $scope;

    /**
     * @type {import('ngeo/datasource/DataSource.js').DataSources}
     * @private
     */
    this.dataSources_ = ngeoDataSources.collection;

    /**
     * @type {import("ngeo/map/LayerHelper.js").LayerHelper}
     * @private
     */
    this.layerHelper_ = ngeoLayerHelper;

    /**
     * method of layertree to get the present map scale
     */
    this.getScale = null;
  }

  /**
   * @return {string} Group uid.
   */
  getGroupUid() {
    return `datasourcegrouptree-${olUtilGetUid(this.group)}`;
  }

  /**
   * Toggle visibility of the group itself, i.e. its visibility state.
   */
  toggle() {
    if (!this.group) {
      throw new Error('Missing group');
    }
    this.group.toggleVisibilityState();
  }

  /**
   * Toggle visible property of a data source.
   * @param {import("ngeo/datasource/DataSource.js").default} dataSource Data source to toggle the
   * visibility
   */
  toggleDataSource(dataSource) {
    dataSource.visible = !dataSource.visible;
    if (dataSource.visible) {
      this.setLegendVisibility(true, dataSource.id.toString() + 'legend');
    } else {
      this.setLegendVisibility(false, dataSource.id.toString() + 'legend');
    }
  }

  /**
   * Remove all data sources from the `import('ngeo/datasource/DataSource.js').DataSources` collection, which
   * will automatically remove them from the Group. The group itself
   * is going to be removed as well, destroying this component in the process.
   */
  remove() {
    if (!this.group) {
      throw new Error('Missing group');
    }
    for (let i = this.group.dataSources.length - 1, ii = 0; i >= ii; i--) {
      this.dataSources_.remove(this.group.dataSources[i]);
    }
  }

  /**
   * @param {import("ngeo/datasource/DataSource.js").default} dataSource Data source to remove from
   *     the `import('ngeo/datasource/DataSource.js').DataSources` collection.
   */
  removeDataSource(dataSource) {
    this.dataSources_.remove(dataSource);
  }

  /**
   * Toggle the legend for a node
   * @param {string} legendNodeId The DOM node legend id to toggle
   */
  toggleNodeLegend(legendNodeId) {
    const div = document.getElementById(legendNodeId);
    if (div) {
      div.classList.toggle('show');
    }
  }

  /**
   * Get legendUrl
   * @param {import('gmf/datasource/ExternalOGC.js').Legend}  legend The legend for which to get the legend url
   * @return {string}
   */
  getLegendUrl(legend) {
    if (legend) {
      return this.layerHelper_.getWMSLegendURL(legend.url, legend.name, this.getScale());
    } else {
      return null;
    }
  }

  /**
   * Set legend visibility
   * @param {boolean} show The DOM node legend id to toggle
   * @param {string} legendNodeId The DOM node legend id to toggle
   */
  setLegendVisibility(show, legendNodeId) {
    const div = document.getElementById(legendNodeId);
    if (div) {
      show ? div.classList.remove('off') : div.classList.add('off');
    }
  }
}

module.component('gmfDatasourcegrouptree', {
  bindings: {
    'group': '<',
    'getScale': '&',
  },
  controller: Controller,
  templateUrl: gmfLayertreeDatasourceGroupTreeTemplateUrl,
});

export default module;
