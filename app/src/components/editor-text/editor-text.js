export default class EditorText {
    constructor(element, virtualElement) {
        this.element = element;
        this.virtualElement = virtualElement;
        this.element.addEventListener('click', () => this.onClick());
        this.element.addEventListener('blur', () => this.onBlur());
        this.element.addEventListener('keypress', (evt) => this.onKeypress(evt));
        this.element.addEventListener('input', () => this.onTextEdit());
    }

    onKeypress(evt) {
        if(evt.keyCode === 13) {
            this.element.blur();
        }
    }

    onClick() {
       this.element.contentEditable = 'true';
       this.element.focus();
    }

    onBlur() {
        this.element.contentEditable = 'false';
    }

    onTextEdit() {
        this.virtualElement.innerHTML = this.element.innerHTML;
     }
}