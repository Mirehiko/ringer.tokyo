// export var SCREEN_RATIO = 16/9;
// export var maxScroll = 0;
// export var WINDOW = $(window);
var SCREEN_RATIO = 16/9;
var maxScroll = 0;
var WINDOW = $(window);

reDrawImages( $('.infiniteItem') );

$('#header-menu, #hideMenu').on('click', function(e) {
	// e.stopPropagation();
	$('.side-header').toggleClass('open');
	$('.backlayer').toggleClass('-visible-');

	if ( $('.side-header').hasClass('open') ) {
		$('.hmenu-text').html('Close');

	} else {
		$('.hmenu-text').html('Menu');
	}
});

$('.side-header').on('click', function(e) {
	if ( $('.side-header').hasClass('open') ) {
		$('.side-header').removeClass('open');
		$('.backlayer').removeClass('-visible-');
		$('.side-header .line.is-b').css('display', 'block');
		$('.hmenu-text').html('Menu');
	}
});

// Toggle accordeon item
$('.toggleBtn').on('click', function(e) {
	var elemItem = $(this);
	var target = elemItem.attr('toggle-target');
	var toggleData = $(`.toggleList[toggle-data="${ target }"]`);

	elemItem.find('.toggleBtn__icon').empty();
	if ( elemItem.hasClass('collapse') ) {
		elemItem.removeClass('collapse');
		toggleData.addClass('-hidden-');
		elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-down"></i>');
	} else {
		elemItem.addClass('collapse');
		toggleData.removeClass('-hidden-');
		elemItem.find('.toggleBtn__icon').append('<i class="fas fa-caret-up"></i>');
	}
});

$('.iconBtnBox').on('click', function(e){
	e.stopPropagation();

	$(this).toggleClass('open');
	if ( $(this).hasClass('open') ) {
		closeIcon( $(this).find('.line.is-b') );
	} else {
		openIcon( $(this).find('.line.is-b') );
	}
});

WINDOW.on('resize', function(e){
	reDrawImages( $('.infiniteItem') );
});



function moveInfinate() {
	let mar = 0;
	setInterval( () => {
		$('.infiniteList').css('margin', mar );
		mar -= 5;
	}, 100);
}
function reDrawImages(image) {
	image.width( image.height() * SCREEN_RATIO );
}

function openIcon(icon) {
	icon.css('display', 'block');
}
function closeIcon(icon) {
	icon.css('display', 'none');
}

function sendEmail() {
  let data = getFieldData();

  $.ajax({
    url: '/api/send_email_to_admin/12/',
    type: "POST",
    data: data,
    dataType: "json",
    success: function(response) {
      if (response == 'success') {
        $('.contactForm__send').addClass('is-complete');
        $('#btntxt').text('Отправлено');
				new Noty({
			    type: 'success',
			    layout: 'center',
			    text: 'Ваше письмо отправлено администратору сайта CAR-TUBE',
					timeout: 5000,
				}).show();
      }
      else {
				new Noty({
			    type: 'error',
			    layout: 'center',
			    text: 'Произошла ошибка при отправке сообщения. Попробуйте повторить операцию позднее.'
				}).show();
      }
      // console.log('response:',response);
    }
  });
}

class Field {
  constructor(data) {
    this.name     = data.name;
    this.field    = $(data.field);
    this.err_msg  = data.err_msg;
    this.is_valid = false;
  }

  validate() {
    if (this.field.val() == '') {
      this.is_valid = false;
    }
    else {
      this.is_valid = true;
    }
    return this.is_valid;
  }
}

class Validator {
  constructor(fields) {
    this.fields = {};
    this.is_form_valid = false;
    this._init(fields);
  }

  _init(fields) {
    for (let i in fields) {
      this.fields[fields[i].name] = new Field(fields[i]);
    }
  }

  isFieldValid(name) {
    return this.fields[name].validate();
  }

  isFormValid() {
    this.is_form_valid = false;
    for (let i in this.fields) {
      if (this.fields[i].validate() != true) {
        this.is_form_valid = false;
        break;
      }
      else {
        this.is_form_valid = true;
      }
    }
    return this.is_form_valid;
  }
}

var validator = new Validator([
  {
    name:    'name',
    field:   '#name',
    err_msg: 'Поле \'ФИО\' не должно быть пустым',
  },
  {
    name:    'email',
    field:   '#email',
    err_msg: 'Поле \'E-mail\' не должно быть пустым',
  },
  {
    name:    'message',
    field:   '#message',
    err_msg: 'Поле \'Сообщение\' не должно быть пустым',
  },
]);

function getFieldData() {
  let data = {};
  data['name']    = $('#name').val();
  data['company'] = $('#company').val();
  data['email']   = $('#email').val();
  data['website'] = $('#website').val();
  data['reason']  = $('#reason option:selected').val();
  data['message'] = $('#message').val();
  return data;
}

function checkField(name) {
  if ( validator.isFieldValid(name) ) {
    validator.fields[name].field.addClass('on_success');
    validator.fields[name].field.removeClass('on_error');
  }
  else {
    console.log(validator.fields[name].err_msg);
    validator.fields[name].field.removeClass('on_success');
    validator.fields[name].field.addClass('on_error');
  }
}


$('.form_input').on('change', function(e) {
  e.preventDefault();
  checkField($(this).attr('name'));
});

$('.form_input').on('keyup', function(e) {
  e.preventDefault();
	if ($(this).val() == '') {
	// if (validator.fields[name].field.val() == '') {
		new Noty({
			type: 'warning',
			layout: 'center',
			text: validator.fields[$(this).attr('name')].err_msg,
			// text: validator.fields[name].err_msg,
			timeout: 5000,
		}).show();
	}
  checkField($(this).attr('name'));
  if ( validator.isFormValid() ) {
		$('.contactForm__send').addClass('is-ok');
    $('.contactForm__send').attr('disabled', false);
  }
	else {
		$('.contactForm__send').removeClass('is-ok');
    $('.contactForm__send').attr('disabled', true);
	}
});

$('#send_email').on('click', sendEmail);