const CTRL_KEY = 17;
const SHIFT_KEY = 16;
const LEFT_KEY = 37;
const UP_KEY = 38;
const RIGHT_KEY = 39;
const DOWN_KEY = 40;
const BACKSPACE_KEY = 8;
const DELETE_KEY = 46;
const C_KEY = 67;
const V_KEY = 86;
const X_KEY = 88;
const Y_KEY = 89;
const Z_KEY = 90;

export default class KeyboardShortcuts {
  constructor({ onDelete, onMove, onCopy, onCut, onPaste, onUndo, onRedo }) {
    this.onDelete = onDelete || this._noop;
    this.onMove = onMove || this._noop;
    this.onCopy = onCopy || this._noop;
    this.onCut = onCut || this._noop;
    this.onPaste = onPaste || this._noop;
    this.onUndo = onUndo || this._noop;
    this.onRedo = onRedo || this._noop;
    this.isFocused = false;
    this.shiftPressed = false;
    this.rawCtrlPressed = false;
    this.metaPressed = false;

    this.mount();
  }

  shouldCloneInstances() {
    return this._isControlPressed();
  }

  shouldMultiSelect() {
    return this.shiftPressed;
  }

  shouldFollowAxis() {
    return this.shiftPressed;
  }

  shouldResizeProportionally() {
    return this.shiftPressed;
  }

  shouldScrollHorizontally() {
    return this.altPressed;
  }

  shouldZoom() {
    return this._isControlPressed();
  }

  _isControlPressed = () => {
    // On macOS, meta key (Apple/Command key) acts as Control key on Windows/Linux.
    return this.metaPressed || this.rawCtrlPressed;
  };

  _onKeyDown = evt => {
    if (!this.isFocused) return;

    if (evt.metaKey) this.metaPressed = true;
    if (evt.altKey) this.altPressed = true;
    if (evt.which === CTRL_KEY) this.rawCtrlPressed = true;
    if (evt.which === SHIFT_KEY) this.shiftPressed = true;

    const textEditorSelectors = 'textarea, input, [contenteditable="true"]';
    if (evt.target && evt.target.closest(textEditorSelectors)) {
      return; // Something else is currently being edited.
    }

    if (this.onMove) {
      if (evt.which === UP_KEY) {
        this.onMove(0, -1);
      } else if (evt.which === DOWN_KEY) {
        this.onMove(0, 1);
      } else if (evt.which === LEFT_KEY) {
        this.onMove(-1, 0);
      } else if (evt.which === RIGHT_KEY) {
        this.onMove(1, 0);
      }
    }
    if (evt.which === BACKSPACE_KEY || evt.which === DELETE_KEY) {
      this.onDelete();
    }
    if (this._isControlPressed() && evt.which === C_KEY) {
      this.onCopy();
    }
    if (this._isControlPressed() && evt.which === X_KEY) {
      this.onCut();
    }
    if (this._isControlPressed() && evt.which === V_KEY) {
      this.onPaste();
    }
    if (this._isControlPressed() && evt.which === Z_KEY) {
      this.onUndo();
    }
    if (this._isControlPressed() && this.shiftPressed && evt.which === Z_KEY) {
      this.onRedo();
    }
    if (this._isControlPressed() && evt.which === Y_KEY) {
      this.onRedo();
    }
  };

  _onKeyUp = evt => {
    if (!this.isFocused) return;

    if (!evt.metaKey) this.metaPressed = false;
    if (!evt.altKey) this.altPressed = false;
    if (evt.which === CTRL_KEY) this.rawCtrlPressed = false;
    if (evt.which === SHIFT_KEY) this.shiftPressed = false;
  };

  _onKeyPress = evt => {};

  _noop = () => {};

  focus() {
    this.isFocused = true;
  }

  blur() {
    this.isFocused = false;
  }

  mount() {
    if (typeof document === 'undefined') return;

    document.addEventListener('keydown', this._onKeyDown, true);
    document.addEventListener('keyup', this._onKeyUp, true);
    document.addEventListener('keypress', this._onKeyPress, true);
  }

  unmount() {
    if (typeof document === 'undefined') return;

    document.removeEventListener('keydown', this._onKeyDown, true);
    document.removeEventListener('keyup', this._onKeyUp, true);
    document.removeEventListener('keypress', this._onKeyPress, true);
  }
}
