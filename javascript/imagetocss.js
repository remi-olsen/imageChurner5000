/**
 *		               • • • •
 *		               •• • •
 *		              ••   •
 *
 *            A Remi A Olsen Production :D
 *      remi@remiolsen.info / https://remiolsen.info
 * 
 * This work is licensed under a Creative Commons Attribution-NonCommercial 4.0 International License:
 * https://creativecommons.org/licenses/by-nc/4.0/
 */

var imageChurner5000 = {
	result: '',
	keepImage: '',

	extendedCSS: function (image, config, svcOutput) {
		var cells = config.querySelectorAll(['input', 'select']);
		svcOutput.value = 'background-image: ' + image + ';';
		for (var i = 0; i < cells.length; i++) {
			if (cells[i].getAttribute('id') !== 'imgConfigPanelCompact') {
				if (cells[i].value.trim().length > 0) {
					svcOutput.value += '\r\n' + cells[i].getAttribute('id') + ': ' + cells[i].value + ';';
				}
			}
		}
	},

	compactCSS: function (image, config, svcOutput) {
		var backgroundColor = document.getElementById('background-color').value,
			backgroundPosition = document.getElementById('background-position').value,
			backgroundRepeat = document.getElementById('background-repeat').value,
			cells = config.querySelectorAll(['#background-clip', '#background-origin', '#background-attachment', '#background-size'])
		svcOutput.value = 'background: ' + backgroundColor + ' ' + image + ' ' + backgroundPosition + ' ' + backgroundRepeat + ';';
		for (var i = 0; i < cells.length; i++) {
			if (cells[i].value.trim().length > 0) {
				svcOutput.value += '\r\n' + cells[i].getAttribute('id') + ': ' + cells[i].value + ';';
			}
		}
	},

	refreshCSS: function (img) {
		var svcOutput = document.getElementById('svcOutput'),
			config = document.getElementById('imgConfigPanel'),
			isCompact = document.getElementById('imgConfigPanelCompact').checked;
		svcOutput.value = '';
		img = !img ? config.getAttribute('data-img') : ' url(' + img + ')';
		if (isCompact) {
			this.compactCSS(img, config, svcOutput);
		} else {
			this.extendedCSS(img, config, svcOutput);
		}
		this.keepImage = img;
		config.setAttribute('data-img', img);
		document.getElementById('svcOutputThumb').setAttribute('style', svcOutput.value);

	},

	validateFile: function (file) {
		if (file.type.indexOf('image') > -1) {
			var reader = new FileReader(),
				t = this;
			reader.onload = function (re) {
				t.result = re.target.result;
				t.refreshCSS(re.target.result);
			}
			reader.readAsDataURL(file);
		} else {
			document.getElementById('svcOutput').value = 'File is not a recognized image type.';
			document.getElementById('svcOutputThumb').setAttribute('style', '');
		}
	},
},

imageToCSS = {
	handlManualChange: function (event) {
		event.preventDefault();
		var file = event.target.files[0],
			i = Object.create(imageChurner5000);
		i.validateFile(file);
	},

	handleDrop: function (event) {
		event.preventDefault();
		var file = event.dataTransfer.files[0],
			i = Object.create(imageChurner5000);
		i.validateFile(file);
		event.target.className = 'dropped';
	},

	handleDragLeave: function (event) {
		event.preventDefault();
		event.target.removeAttribute('class');
	},

	handleDrag: function (event) {
		event.preventDefault();
		if (event.target.className.indexOf('over') === -1) {
			event.target.className = 'over';
		}
	},

	handleFormChange: function (event) {
		event.preventDefault();
		var i = Object.create(imageChurner5000);
		i.refreshCSS();
	},

	convertImages: function () {
		var imgDrag = document.getElementById('imgDragManualLabel'),
			manualElement = document.getElementById('imgDragManual'),
			inputs = document.querySelectorAll(['input', 'select']),
			t = this;
		imgDrag.addEventListener('dragover', t.handleDrag, false);
		imgDrag.addEventListener('dragleave', t.handleDragLeave, false);
		imgDrag.addEventListener('drop', t.handleDrop, false);
		manualElement.addEventListener('change', t.handlManualChange, false);
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].addEventListener('change', t.handleFormChange, false);
		}
	}
};

window.onload = function () {
	var i = Object.create(imageToCSS);
	i.convertImages();
}