'use strict';

import pug from '../html/index.pug';
import scss from '../css/index.scss';

import angular from 'angular';
import jquery from 'jquery';

import trigUnits from './trigUnits';
import {calcApp} from './calcApp';
import {calcCtrl} from './calcCtrl';


Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

calcApp.controller('calcCtrl', calcCtrl);
