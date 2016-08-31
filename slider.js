/**
 * Created by mult_ru on 31.08.2016.
 */
function createSliderDOM() {
    var div = createElem('div', rectPos, {
        zIndex: 102,
        id: 'slider'
    });

    var thumbDiv = createElem('div', [157-4, -parseInt(a.canvasFS.style.top), 12, rectPos[3]], {
        zIndex: 102
    });
    var thumbDivRedline = createElem('div', [4, -parseInt(a.canvasFS.style.top), 4, rectPos[3]+20], { //
        zIndex: 102
    });

    thumbDivRedline.style.backgroundColor = 'red';
    thumbDivRedline.style.position = 'relative';

    thumbDiv.style.position = 'relative';
    thumbDiv.classList.add('thumb');

    div.appendChild(thumbDiv);
    thumbDiv.appendChild(thumbDivRedline);

    //div.id = 'slider';

    return div;
}

function Slider(options) {
    this.elem = options.elem;
    //this.value_MAX = options.max;

    this.sliderCoords = this.elem.getBoundingClientRect();
    this.thumbCoords = null;
    this.shiftX = null;
    this.shiftY = null;

    this.elem.addEventListener('touchstart', this.elemMouseDown.bind(this));
}

Slider.prototype.elemMouseDown = function(e) {
    console.log('touchstart');
    e.preventDefault();
    e.stopPropagation();

    if (e.target.closest('.thumb')) {
        this.startDrag(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        return false; // disable selection start (cursor change)
    }
};

Slider.prototype.startDrag = function(startClientX, startClientY) {
    this.thumbCoords = this.elem.querySelector('.thumb').getBoundingClientRect();
    //console.log('startDrag: ' + startClientX + ' - ' + this.thumbCoords.left);
    this.shiftX = startClientX - this.thumbCoords.left;
    this.shiftY = startClientY - this.thumbCoords.top;

    this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this);
    document.addEventListener('touchmove', this.onDocumentMouseMove);
    this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);
    document.addEventListener('touchend',  this.onDocumentMouseUp.bind(this));
};

Slider.prototype.onDocumentMouseMove = function(e) {
    e.preventDefault();
    e.stopPropagation();
    var thumbElem = this.elem.querySelector('.thumb');

    this.thumbCoords = thumbElem.getBoundingClientRect();
    this.moveTo(e.changedTouches[0].pageX, this.thumbCoords.top); //this.thumbCoords.left
};

Slider.prototype.onDocumentMouseUp = function(e) {
    console.log('touchend');
    document.removeEventListener('touchmove', this.onDocumentMouseMove);
    document.removeEventListener('touchend',  this.onDocumentMouseUp);
};

Slider.prototype.moveTo = function(posX, posY) {
    // вычесть координату родителя, т.к. position: relative
    var newLeft = posX - this.shiftX - this.sliderCoords.left;

    // курсор ушёл вне слайдера
    if (newLeft < 0) {
        newLeft = 0;
    }
    var rightEdge = this.elem.offsetWidth - this.elem.querySelector('.thumb').offsetWidth - 2;
    if (newLeft > rightEdge) {
        newLeft = rightEdge;
    }

    this.elem.querySelector('.thumb').style.left = newLeft + 'px';
    var changeEvent = new CustomEvent("slide", {
        bubbles: true,
        // detail - стандартное свойство CustomEvent для произвольных данных
        detail: newLeft
    });
    this.elem.dispatchEvent(changeEvent);
}