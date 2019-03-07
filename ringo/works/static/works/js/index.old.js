"use strict";

var computedLines = [];
var renderedData = [];
var isScrolling = false;

Array.prototype.shuffle = function () {
  for (var i = this.length - 1; i > 0; i--) {
    var num = Math.floor(Math.random() * (i + 1));
    var d = this[num];
    this[num] = this[i];
    this[i] = d;
  }

  return this;
};

var firstID = '';
var lastID = '';
var windowObj = $(window);
var homePageObj = $('#homePage');
var motionObj;
renderer();

function renderer() {
  if (windowObj.width() < 768) {
    homePageObj.empty();
    homePageObj.append(renderMobile(textData));
  } else {
    homePageObj.empty();
    homePageObj.append(renderPage(textData));
    motionObj = new MotionGlob($('#homePage'), {
      onhover: 'nothing',
      itemClass: '.boxItem',
      delayAfterHover: 2,
      original: $('.infiniteBox')
    });
    setTimeout(function () {
      motionObj.init();
    }, 1000);
  }
}

if (WINDOW.width() >= 768) {
  redrawBackgrounds();
  checkForAdditionData();
}

$(window).on('resize', function (e) {
  redrawBackgrounds();
});
$('#mobileCategory>.toggleBtn').on('click', function (e) {
  var elem = $(this);
  var mobileNav = $('#mobileNav'); // console.log(mobileNav);

  if (elem.hasClass('collapse')) {
    mobileNav.addClass('-open-');
  } else {
    mobileNav.removeClass('-open-');
  }
});
$('.toggleList__item').on('click', function (e) {
  e.preventDefault();
  var cat = $(this).attr('globcat');
  $('.toggleList__item.-active-').removeClass('-active-');
  $(".toggleList__item[globcat=\"".concat(cat, "\"]")).addClass('-active-');
  var text = $(this).text(); // console.log(text);

  $(".toggleBtn__text[globcat]").text(text);
});

function checkForAdditionData() {
  var box = $('.infiniteBox');
  var w = $(window);
  var lastLine = $('.infirow:last-child');
  var is_true = $('.infirow:last-child').offset().top - w.height() < 0;

  while (is_true) {
    try {
      // console.log('computedLines:before:', computedLines)
      var forDraw = computedLines.splice(0, 1);

      if (forDraw.length == 2) {
        box.append(doubleLine(forDraw));
      } else {
        box.append(forDraw[0].lineType(forDraw[0].data));
      }

      computedLines = computedLines.concat(forDraw);
      redrawBackgrounds(); // console.log('computedLines:after:', computedLines)

      is_true = $('.infirow:last-child').offset().top - w.height() < 0;
    } catch (e) {
      is_true = false;
      console.log(e);
    }
  }
}

function renderMobile(data) {
  var tmpData = data;
  var result = document.createElement('div');
  $(result).addClass('infiniteBox');
  var fragment = document.createDocumentFragment(); // for ( let item of data ) {
  // 	$(fragment).append( mobileItem(item) );
  // }

  for (var i = 0; i < data.length; i++) {
    $(fragment).append(mobileItem(data[i]));
  }

  $(result).append(fragment);
  return result;
}

function mobileItem(data) {
  return "\n\t\t<a href=\"".concat(data.link, "\" class=\"mobItem\" title=\"\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A ").concat(data.title, "\">\n\t\t\t<img class=\"mobileItem__image\" src=\"").concat(data.src, "\" alt=\"\">\n\t\t\t<div class=\"mobItem__info\">\n\t\t\t\t<h2 class=\"paramLine\">\n\t\t\t\t\t<span class=\"paramTitle\">Title</span>\n\t\t\t\t\t<span class=\"paramValue\">").concat(data.title, "</span>\n\t\t\t\t</h2>\n\t\t\t\t<div class=\"paramLine\">\n\t\t\t\t\t<span class=\"paramTitle\">Launch</span>\n\t\t\t\t\t<span class=\"paramValue\">").concat(data.lauch, "</span>\n\t\t\t\t</div>\n\t\t\t\t<div class=\"paramLine\">\n\t\t\t\t\t<span class=\"paramTitle\">Category</span>\n\t\t\t\t\t<span class=\"paramValue\">").concat(data.category, "</span>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</a>");
}

function renderPage(data) {
  var tmpData = data;
  var result = document.createElement('div');
  $(result).addClass('infiniteBox');
  var linesCount = data.length; // console.log('linesCount:',linesCount)
  // Вычисляем какие плитки будут

  var lines = calcView(linesCount); // console.log('lines:',lines)
  // Отбираем данные для тройной плитки

  var tripleLines = lines.filter(function (length) {
    return length == 3;
  });
  var tripleData = [];
  var lineTypes = [];

  if (tripleLines.length) {
    // Для линий с тремя объектами вычисляем тип плитки
    // for (item of tripleLines) {
    // 	lineTypes.push(autoSelectType());
    // }
    for (var i = 0; i < tripleLines.length; i++) {
      lineTypes.push(autoSelectType());
    } // console.log('lineTypes:',lineTypes)
    // Отбираем данные для отображения


    for (var _i = 0; _i < tripleLines.length; _i++) {
      tripleData.push({
        lineType: lineTypes[_i],
        data: [].concat(tmpData.splice(0, tripleLines[_i]))
      });
    }
  } // Отбираем данные для двойной плитки


  var doubleLines = lines.filter(function (length) {
    return length == 2;
  });
  var doubleData = [];

  if (doubleLines.length) {
    // Отбираем данные для отображения
    for (var _i2 = 0; _i2 < doubleLines.length; _i2++) {
      doubleData.push({
        lineType: 'double',
        data: [].concat(tmpData.splice(0, doubleLines[_i2]))
      });
    } // for (item of doubleLines) {
    // 	doubleData.push({
    //         lineType: 'double',
    //         data: [].concat(tmpData.splice(0, item)),
    //     		});
    // }

  } // Собираем все плитки воедино


  computedLines = doubleData.concat(tripleData);
  computedLines.shuffle(); // Задаем случайное положение
  // Собираем данные для отрисовки

  for (var _i3 = 0; _i3 < computedLines.length; _i3++) {
    var item = computedLines[_i3];

    if (item.lineType == 'double') {
      $(result).append(doubleLine(item.data));
    } else {
      $(result).append(item.lineType(item.data));
    }
  } // for ( item of computedLines ) {
  // 	if ( item.lineType == 'double' ) {
  // 		$(result).append(doubleLine(item.data));
  // 	} else {
  // 		$(result).append(item.lineType(item.data));
  // 	}
  // }


  return result;
}

function autoSelectType() {
  var typeID = randomInteger(1, 3);
  var type = null;

  switch (typeID) {
    case 1:
      {
        type = tripleLine;
        break;
      }

    case 2:
      {
        type = tsobLine;
        break;
      }

    case 3:
      {
        type = obtsLine;
        break;
      }

    default:
      break;
  }

  return type;
}

function calcView(num) {
  var result = [];
  var count = 0;
  var lastState = 0;
  var tmp = 0;
  var c = true;
  var step = 3;

  if (num < 5) {
    step = 2;
  }

  if (num != 0) {
    while (c) {
      count += step;

      if (count + tmp > num) {
        tmp = num - lastState;
        count = 0;
        result = [];
      } else {
        result.push(step);

        if (count + tmp == num) {
          if (tmp == 1) {
            tmp = num - lastState;
            result = [];
            count = 0;
          } else {
            c = false;
          }
        }
      }

      lastState = count;
    }
  }

  if (step >= 3) {
    if (tmp == 2) {
      result.push(2);
    } else if (tmp != 0) {
      for (var i = 0; i < tmp / 2; i++) {
        result.push(2);
      }
    }
  } // let isCan = num % 7;
  // let cres = num / 7;
  //
  // if (isCan == 0 && cres > 3 ) {
  // 	result = calcView(num-7);
  // 	let arr = calcView(7);
  // 	result.concat( arr.slice() );
  // }


  return result;
}

function randomInteger(min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
}

function tsobLine(data) {
  var dt = data.slice();
  var line = document.createElement('div');
  $(line).addClass('infirow');
  var big = document.createElement('div');
  $(big).addClass('col-8');
  $(big).append(drawItem(dt[0]));
  dt.splice(0, 1);
  var small = document.createElement('div');
  $(small).addClass('col-4');

  do {
    $(small).append(drawItem(dt[0]));
    dt.splice(0, 1);
  } while (dt.length);

  $(line).append(small);
  $(line).append(big);
  return line;
}

function obtsLine(data) {
  var dt = data.slice();
  var line = document.createElement('div');
  $(line).addClass('infirow');
  var big = document.createElement('div');
  $(big).addClass('col-8');
  $(big).append(drawItem(dt[0]));
  dt.splice(0, 1);
  var small = document.createElement('div');
  $(small).addClass('col-4');

  do {
    $(small).append(drawItem(dt[0]));
    dt.splice(0, 1);
  } while (dt.length);

  $(line).append(big);
  $(line).append(small);
  return line;
}

function tripleLine(data) {
  var dt = data.slice();
  var line = document.createElement('div');
  $(line).addClass('infirow');

  do {
    var item = document.createElement('div');
    $(item).addClass('col-4');
    $(item).append(drawItem(dt[0]));
    $(line).append(item);
    dt.splice(0, 1);
  } while (dt.length);

  return line;
}

function doubleLine(data) {
  var dt = data.slice();
  var line = document.createElement('div');
  $(line).addClass('infirow');

  do {
    var item = document.createElement('div');
    $(item).addClass('col-6');
    $(item).append(drawItem(dt[0]));
    $(line).append(item);
    dt.splice(0, 1);
  } while (dt.length);

  return line;
}

function redrawBackgrounds() {
  var items = $('.boxItem');
  $.each(items, function (key, val) {
    $(this).outerHeight($(this).outerWidth() / SCREEN_RATIO);
  });
}

function drawItem(data) {
  var item = document.createElement('a');
  item.href = data.link;
  $(item).addClass('boxItem');
  var wrapper = document.createElement('div');
  $(wrapper).addClass('itemWrapper');
  $(item).append(wrapper);
  var back = document.createElement('div');
  $(back).addClass('itemBack');
  $(back).css('background-image', 'url(' + data.src + ')');
  $(back).css('background-size', 'cover');
  $(back).css('background-repeat', 'no-repeat');
  $(wrapper).append(back);
  var itemContent = document.createElement('div');
  $(itemContent).addClass('itemContent');
  $(wrapper).append(itemContent);
  var itemTitle = document.createElement('div');
  $(itemTitle).addClass('itemTitle withValue');
  $(itemTitle).text('Title');
  $(itemContent).append(itemTitle);
  var itemTitle__value = document.createElement('span');
  $(itemTitle__value).text(data.title);
  $(itemTitle).append(itemTitle__value);
  var itemLauchDate = document.createElement('div');
  $(itemLauchDate).addClass('itemLauchDate withValue');
  $(itemLauchDate).text('Launch');
  $(itemContent).append(itemLauchDate);
  var itemLauch__value = document.createElement('span');
  $(itemLauch__value).text(data.lauch);
  $(itemLauchDate).append(itemLauch__value);
  var itemCategory = document.createElement('div');
  $(itemCategory).addClass('itemCategory withValue');
  $(itemCategory).text('Category');
  $(itemContent).append(itemCategory);
  var itemCategory__value = document.createElement('span');
  $(itemCategory__value).text(data.category);
  $(itemCategory).append(itemCategory__value);
  var previewBlock = document.createElement('div');
  $(previewBlock).addClass('itemPreview');
  $(itemContent).append(previewBlock);
  var previewContent = document.createElement('div');
  $(previewContent).addClass('itemPreview__box');
  $(previewBlock).append(previewContent);
  var btn = document.createElement('div');
  $(btn).addClass('itemPreview__btn');
  $(previewBlock).append(btn);
  return item;
}
