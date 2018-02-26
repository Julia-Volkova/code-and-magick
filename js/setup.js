// DOM
'use strict';

(function () {
  var userDialog = document.querySelector('.setup');

  var similarListElement = userDialog.querySelector('.setup-similar-list');
  var similarWizardTemplate = document.querySelector('#similar-wizard-template').content;

  var WIZARD_QUANTITY = 4;
  var WIZARD_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var WIZARD_SECOND_NAMES = ['да Марья', 'Верон', 'Мирабелла', 'Вальц', 'Онопко', 'Топольницкая', 'Нионго', 'Ирвинг'];
  var WIZARD_COAT_COLOR = ['rgb(101, 137, 164)', 'rgb(241, 43, 107)', 'rgb(146, 100, 161)', 'rgb(56, 159, 117)', 'rgb(215, 210, 55)', 'rgb(0, 0, 0)'];
  var WIZARD_EYES_COLOR = ['black', 'red', 'blue', 'yellow', 'green'];
  var wizards = [];
  var newWizard;

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

  // Генерация новых волшебников и добавление в дерево
  var generateRandomAppearance = function (currentWizards) {
    for (var i = 0; i < WIZARD_QUANTITY; i++) {
      newWizard = {
        name: window.colorize.generateRandomParameter(WIZARD_NAMES) + ' ' + window.colorize.generateRandomParameter(WIZARD_SECOND_NAMES),
        coatColor: window.colorize.generateRandomParameter(WIZARD_COAT_COLOR),
        eyesColor: window.colorize.generateRandomParameter(WIZARD_EYES_COLOR)
      };
      currentWizards[i] = newWizard;
    }
    return currentWizards;
  };

  var renderWizard = function (wizard) {
    var wizardElement = similarWizardTemplate.cloneNode(true);
    wizardElement.querySelector('.setup-similar-label').textContent = wizard.name;
    wizardElement.querySelector('.wizard-coat').style.fill = wizard.colorCoat;
    wizardElement.querySelector('.wizard-eyes').style.fill = wizard.eyesColor;
    return wizardElement;
  };

  // Загрузка массива волшебников с сервера
  var successHandler = function (wizards) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < 4; i++) {
      fragment.appendChild(renderWizard(wizards[i]));
    }
    similarListElement.appendChild(fragment);
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

  window.backend.load(successHandler, errorHandler);
  userDialog.querySelector('.setup-similar').classList.remove('hidden');

  // Раскраска основного волшебника по клику на его определенную часть
  window.colorize.changeColorOfWizard(wizardCoat, coatColors, wizardCoatInput);
  window.colorize.changeColorOfWizard(wizardEyes, eyesColors, wizardEyesInput);
  window.colorize.changeColorOfWizard(setupFireball, fireballColors, setupFireballInput);

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
  var successLoad = function (response) {
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
    window.backend.save(new FormData(form), successLoad, errorLoad);
    evt.preventDefault();
  });
})();
