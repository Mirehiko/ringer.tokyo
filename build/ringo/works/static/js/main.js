function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// export var SCREEN_RATIO = 16/9;
// export var maxScroll = 0;
// export var WINDOW = $(window);
var SCREEN_RATIO = 16 / 9;
var maxScroll = 0;
var WINDOW = $(window);
reDrawImages($('.infiniteItem'));
$('#header-menu, #hideMenu').on('click', function (e) {
  // e.stopPropagation();
  $('.side-header').toggleClass('open');
  $('.backlayer').toggleClass('-visible-');

  if ($('.side-header').hasClass('open')) {
    $('.hmenu-text').html('Close');
  } else {
    $('.hmenu-text').html('Menu');
  }
});
$('.side-header').on('click', function (e) {
  if ($('.side-header').hasClass('open')) {
    $('.side-header').removeClass('open');
    $('.backlayer').removeClass('-visible-');
    $('.side-header .line.is-b').css('display', 'block');
    $('.hmenu-text').html('Menu');
  }
}); // Toggle accordeon item

$('.toggleBtn').on('click', function (e) {
  var elemItem = $(this);
  var target = elemItem.attr('toggle-target');
  var toggleData = $(".toggleList[toggle-data=\"".concat(target, "\"]"));
  elemItem.find('.toggleBtn__icon').empty();

  if (elemItem.hasClass('collapse')) {
    elemItem.removeClass('collapse');
    toggleData.addClass('-hidden-');
    elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-down"></i>');
  } else {
    elemItem.addClass('collapse');
    toggleData.removeClass('-hidden-');
    elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-up"></i>');
  }
});
$('.iconBtnBox').on('click', function (e) {
  e.stopPropagation();
  $(this).toggleClass('open');

  if ($(this).hasClass('open')) {
    closeIcon($(this).find('.line.is-b'));
  } else {
    openIcon($(this).find('.line.is-b'));
  }
});
WINDOW.on('resize', function (e) {
  reDrawImages($('.infiniteItem'));
});

function moveInfinate() {
  var mar = 0;
  setInterval(function () {
    $('.infiniteList').css('margin', mar);
    mar -= 5;
  }, 100);
}

function reDrawImages(image) {
  image.width(image.height() * SCREEN_RATIO);
}

function openIcon(icon) {
  icon.css('display', 'block');
}

function closeIcon(icon) {
  icon.css('display', 'none');
}

var response_statuses = ['success', 'spamer', 'fail'];
var resp_actions = {
  success: function success() {
    $('.contactForm__send').addClass('is-complete');
    $('#btntxt').text('Отправлено');
    new Noty({
      type: 'success',
      layout: 'center',
      text: 'Ваше письмо отправлено администратору сайта CAR-TUBE',
      timeout: 5000
    }).show();
  },
  spamer: function spamer() {
    new Noty({
      type: 'error',
      layout: 'center',
      text: 'Вы похожи на спамера.'
    }).show();
  },
  fail: function fail() {
    new Noty({
      type: 'error',
      layout: 'center',
      text: 'Произошла ошибка при отправке сообщения. Попробуйте повторить операцию позднее.'
    }).show();
  }
};

function sendEmail() {
  var data = getFieldData();
  data.token = $('#g-recaptcha-responce').val();
  $.ajax({
    url: '/api/send_email_to_admin/12/',
    type: "POST",
    data: data,
    dataType: "json",
    success: function success(response) {
      console.log('response:', response.status);
      console.log(response_statuses.indexOf(response.status));

      if (response_statuses.indexOf(response.status) !== -1) {
        resp_actions[response.status]();
      } // if (response == 'success') {
      //   $('.contactForm__send').addClass('is-complete');
      //   $('#btntxt').text('Отправлено');
      //   new Noty({
      //     type: 'success',
      //     layout: 'center',
      //     text: 'Ваше письмо отправлено администратору сайта CAR-TUBE',
      //     timeout: 5000,
      //   }).show();
      // } else {
      //   new Noty({
      //     type: 'error',
      //     layout: 'center',
      //     text: 'Произошла ошибка при отправке сообщения. Попробуйте повторить операцию позднее.'
      //   }).show();
      // }
      // console.log('response:',response);

    }
  });
}

var Field =
/*#__PURE__*/
function () {
  function Field(data) {
    _classCallCheck(this, Field);

    this.name = data.name;
    this.field = $(data.field);
    this.err_msg = data.err_msg;
    this.is_valid = false;
  }

  _createClass(Field, [{
    key: "validate",
    value: function validate() {
      if (this.field.val() == '') {
        this.is_valid = false;
      } else {
        this.is_valid = true;
      }

      return this.is_valid;
    }
  }]);

  return Field;
}();

var Validator =
/*#__PURE__*/
function () {
  function Validator(fields) {
    _classCallCheck(this, Validator);

    this.fields = {};
    this.is_form_valid = false;

    this._init(fields);
  }

  _createClass(Validator, [{
    key: "_init",
    value: function _init(fields) {
      for (var i in fields) {
        this.fields[fields[i].name] = new Field(fields[i]);
      }
    }
  }, {
    key: "isFieldValid",
    value: function isFieldValid(name) {
      return this.fields[name].validate();
    }
  }, {
    key: "isFormValid",
    value: function isFormValid() {
      this.is_form_valid = false;

      for (var i in this.fields) {
        if (this.fields[i].validate() != true) {
          this.is_form_valid = false;
          break;
        } else {
          this.is_form_valid = true;
        }
      }

      return this.is_form_valid;
    }
  }]);

  return Validator;
}();

var validator = new Validator([{
  name: 'name',
  field: '#name',
  err_msg: 'Поле \'ФИО\' не должно быть пустым'
}, {
  name: 'email',
  field: '#email',
  err_msg: 'Поле \'E-mail\' не должно быть пустым'
}, {
  name: 'message',
  field: '#message',
  err_msg: 'Поле \'Сообщение\' не должно быть пустым'
}]);

function getFieldData() {
  var data = {};
  data['name'] = $('#name').val();
  data['company'] = $('#company').val();
  data['email'] = $('#email').val();
  data['website'] = $('#website').val();
  data['reason'] = $('#reason option:selected').val();
  data['message'] = $('#message').val();
  return data;
}

function checkField(name) {
  if (validator.isFieldValid(name)) {
    validator.fields[name].field.addClass('on_success');
    validator.fields[name].field.removeClass('on_error');
  } else {
    console.log(validator.fields[name].err_msg);
    validator.fields[name].field.removeClass('on_success');
    validator.fields[name].field.addClass('on_error');
  }
}

$('.form_input').on('change', function (e) {
  e.preventDefault();
  checkField($(this).attr('name'));
});
$('.form_input').on('keyup', function (e) {
  e.preventDefault();
  var btn = $(this);

  if (btn.val() == '') {
    // if (validator.fields[name].field.val() == '') {
    if (btn.attr('valstate') != 'empty') {
      btn.attr('valstate', 'empty');
      new Noty({
        type: 'warning',
        layout: 'center',
        text: validator.fields[btn.attr('name')].err_msg,
        timeout: 3000
      }).show();
    }
  } else {
    btn.attr('valstate', 'fill');
    checkField(btn.attr('name'));
  }

  if (validator.isFormValid()) {
    $('.contactForm__send').addClass('is-ok');
    $('.contactForm__send').attr('disabled', false);
  } else {
    $('.contactForm__send').removeClass('is-ok');
    $('.contactForm__send').attr('disabled', true);
  }
});
$('#send_email').on('click', sendEmail);