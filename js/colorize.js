'use strict';
// По клику меняю цвета частей волшебника
(function () {
  window.colorize = {
    generateRandomParameter: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }
    // changeColorOfWizard: function (element, array, hiddenInput, colorPart) {
    //   element.addEventListener('click', function () {
    //     var color = window.colorize.generateRandomParameter(array);
    //     if (element.tagName.toLowerCase() === 'div') {
    //       element.style.backgroundColor = color;
    //       colorPart = color;
    //     } else {
    //       element.style.fill = color;
    //       colorPart = color;
    //     }
    //     hiddenInput.value = color;
    //   });
    // }
  };
})();
