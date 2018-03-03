// DOM
'use strict';

(function () {
  var userDialog = document.querySelector('.setup');

  window.setup = document.querySelector('.setup');
  var setupWizard = window.setup.querySelector('.setup-wizard');
  var wizardCoat = setupWizard.querySelector('.wizard-coat');
  var wizardCoatInput = document.querySelector('input[name="coat-color"]');
  var wizardEyes = setupWizard.querySelector('.wizard-eyes');
  var wizardEyesInput = document.querySelector('input[name="eyes-color"]');
  var setupFireball = window.setup.querySelector('.setup-fireball-wrap');
  var setupFireballInput = document.querySelector('input[name="fireball-color"]');
  var coatColors = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var eyesColors = ['black', 'red', 'blue', 'yellow', 'green'];
  var fireballColors = ['#ee4830', '#30a8ee', '#5ce6c0', '#e848d5', '#e6e848'];

  // Загрузка массива волшебников с сервера
  var similarity = {
    coatColor: coatColors[0],
    eyesColor: eyesColors[0]
  };
  var wizards = [];

  // Добавление ранга
  var getRank = function (wizard) {
    var rank = 0;
    if (wizard.colorCoat === similarity.coatColor) {
      rank += 2;
    }
    if (wizard.colorEyes === similarity.eyesColor) {
      rank += 1;
    }
    return rank;
  };

  var namesComparator = function (left, right) {
    if (left > right) {
      return 1;
    } else if (left < right) {
      return -1;
    } else {
      return 0;
    }
  };

  // Сортировка по цветам
  var updateWizards = function () {
    window.render(wizards.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      if (rankDiff === 0) {
        rankDiff = namesComparator(left.name, right.name);
      }
      return rankDiff;
    }));
  };

  var successHandler = function (data) {
    wizards = data;
    updateWizards();
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.padding = '30px 0';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.backend.load(successHandler, errorHandler, 'https://js.dump.academy/code-and-magick/data', 'GET');
  userDialog.querySelector('.setup-similar').classList.remove('hidden');


  // Генерация рандомного цвета
  var randomColor = function (element, array, hiddenInput, prop) {
    var color = window.colorize.generateRandomParameter(array);
    if (element.tagName.toLowerCase() === 'div') {
      element.style.backgroundColor = color;
    } else {
      element.style.fill = color;
    }
    hiddenInput.value = color;

    similarity[prop] = color;
    window.debounce(updateWizards, 300);
  };

  // Определение цвета части волшебника по клику
  var changeColorOfWizard = function (element, array, hiddenInput, prop) {
    element.addEventListener('click', function () {
      randomColor(element, array, hiddenInput, prop);
    });
  };

  // Раскраска основного волшебника по клику на его определенную часть
  changeColorOfWizard(wizardCoat, coatColors, wizardCoatInput, 'coatColor');
  changeColorOfWizard(wizardEyes, eyesColors, wizardEyesInput, 'eyesColor');
  changeColorOfWizard(setupFireball, fireballColors, setupFireballInput);


  // Перетаскивание элементов из магазина в артифакты
  var shopElement = window.setup.querySelector('.setup-artifacts-shop');
  var draggedItem = null;
  var artifactsElement = window.setup.querySelector('.setup-artifacts');

  shopElement.addEventListener('dragstart', function (evt) {
    if (evt.target.tagName.toLowerCase() === 'img') {
      draggedItem = evt.target;
      evt.dataTransfer.setData('text/plain', evt.target.alt);
      evt.dataTransfer.effectAllowed = 'copy';
    }
    artifactsElement.style.outline = '2px solid red';
  });
  artifactsElement.addEventListener('dragover', function (evt) {
    evt.preventDefault();
    return false;
  });
  artifactsElement.addEventListener('drop', function (evt) {
    evt.target.style.backgroundColor = '';
    var draggedItemCopy = draggedItem.cloneNode(true);
    if (evt.target.hasChildNodes() !== true && evt.target.tagName === 'DIV') {
      evt.target.appendChild(draggedItemCopy);
    }
    artifactsElement.style.outline = 'none';
    evt.preventDefault();
  });
  artifactsElement.addEventListener('dragenter', function (evt) {
    if (evt.target.hasChildNodes() !== true && evt.target.tagName === 'DIV') {
      evt.target.style.backgroundColor = 'yellow';
      evt.preventDefault();
    }
  });
  artifactsElement.addEventListener('dragleave', function (evt) {
    evt.target.style.backgroundColor = '';
    evt.preventDefault();
  });

  // Отправка данных об игроке на сервер
  var form = userDialog.querySelector('.setup-wizard-form');
  var successLoad = function () {
    userDialog.classList.add('hidden');
  };

  var errorLoad = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.style.padding = '30px 0';
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  form.addEventListener('submit', function (evt) {
    window.backend.save(successLoad, errorLoad, 'https://js.dump.academy/code-and-magick', 'POST', new FormData(form));
    evt.preventDefault();
  });
})();
