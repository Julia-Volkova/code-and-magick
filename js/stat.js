'use strict';

var CLOUD_WIDTH = 420;
var CLOUD_HEIGHT = 270;
var CLOUD_X = 100;
var CLOUD_Y = 10;
var SHADOW_OFFSET = 10;
var GAP_BETWEEN_BAR = 50;
var TEXT_HEIGHT = 10;
var BAR_HEIGHT = 150;
var BAR_WIDTH = 40;
var COORDIN_LEFT = 123;
var COORDIN_TOP = 38;
var TYPOGRAPHIC = '16px PT Mono';
var COLOR_BLACK = '#000';
var INDENT_FROM_BAR = 35;
var INDENT_FROM_TITLE = 20;
var result = 0;
var maxTime = 0;
var currentHeightBar = 0;

var renderCloud = function (ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, CLOUD_WIDTH, CLOUD_HEIGHT);
};

var getMaxElement = function (arr) {
  var maxElement = arr[0];

  for (var n = 0; n < arr.length; n++) {
    if (arr[n] > maxElement) {
      maxElement = arr[n];
    }
  }

  return maxElement;
};

var setTypographic = function (ctx) {
  ctx.fillStyle = COLOR_BLACK;
  ctx.font = TYPOGRAPHIC;
};

window.renderStatistics = function (ctx, names, times) {
  renderCloud(ctx, CLOUD_X + SHADOW_OFFSET, CLOUD_Y + SHADOW_OFFSET, 'rgba(0, 0, 0, 0.7)');
  renderCloud(ctx, CLOUD_X, CLOUD_Y, '#fff');

  for (var j = 0; j < times.length; j++) {
    result = Math.round(times[j]);
    times[j] = result;
  }

  maxTime = getMaxElement(times);

  setTypographic(ctx);
  ctx.fillText('Ура вы победили!', COORDIN_LEFT, COORDIN_TOP);
  ctx.fillText('Список результатов:', COORDIN_LEFT, COORDIN_TOP + INDENT_FROM_TITLE);

  for (var i = 0; i < names.length; i++) {
    if (names[i] === 'Вы') {
      ctx.fillStyle = 'rgba(255, 0, 0, 1)';
    } else {
      ctx.fillStyle = 'rgba(0, 0, 255,' + Math.random() + ')';
    }
    currentHeightBar = BAR_HEIGHT * times[i] / maxTime;
    ctx.fillRect(COORDIN_LEFT + (BAR_WIDTH + GAP_BETWEEN_BAR) * i, CLOUD_HEIGHT - currentHeightBar - TEXT_HEIGHT * 3, BAR_WIDTH, currentHeightBar);

    setTypographic(ctx);
    ctx.fillText(names[i], COORDIN_LEFT + (BAR_WIDTH + GAP_BETWEEN_BAR) * i, CLOUD_HEIGHT - TEXT_HEIGHT);
    ctx.fillText(times[i], COORDIN_LEFT + (BAR_WIDTH + GAP_BETWEEN_BAR) * i, CLOUD_HEIGHT - INDENT_FROM_BAR - currentHeightBar);
  }
};
