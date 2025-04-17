import { Utils } from '../utils';
// import { Backdrop } from '../modules/nav-offcanvas/Backdrop';
// import { Tabber } from '../modules/nav-offcanvas/Tabber';
// import { Bodylocker } from '../modules/nav-offcanvas/Bodylocker';

export class Navbar {
  constructor(rootEl = '.navbar', options = {}) {
    this._rootEl = typeof rootEl === 'string' ? Utils.select(rootEl) : rootEl;
    this._openBtnEl = this._rootEl.querySelector('.navbar__btn-open');
    this._closeBtnEl = this._rootEl.querySelector('.navbar__btn-close');
    this._offcanvasEl = this._rootEl.querySelector('.navbar__offcanvas');
    this._tabbableEls = [this._closeBtnEl, ...this._rootEl.querySelectorAll('.navbar__link')];

    this._isTransitioning = false;
    this._isExpanded = null;
    // this._modules = [Backdrop, Tabber, Bodylocker, ...(options?.modules || [])];

    this._initEventListener();
    // this._initModules();
  }

  _initEventListener() {
    this._openBtnEl.addEventListener('click', this._openOffcanvas.bind(this));
    this._closeBtnEl.addEventListener('click', this._closeOffcanvas.bind(this));
    this._offcanvasEl.addEventListener('transitionend', this._onTransitionEnd.bind(this));
    // document.addEventListener('click', this._handleDocumentClick.bind(this));
  }

  // _initModules() {
  //   this._modules.forEach((Module) => {
  //     new Module({
  //       rootEl: this._rootEl,
  //       openBtnEl: this._openBtnEl,
  //       offcanvasEl: this._offcanvasEl,
  //       tabbableEls: this._tabbableEls,
  //     });
  //   });
  // }

  _setAriaExpanded(bool) {
    this._openBtnEl.ariaExpanded = bool;
    this._isExpanded = bool;
  }
  _setTransitionClass() {
    this._offcanvasEl.classList.add('showing');
  }

  _toggleOffcanvasClasses(isExpanded) {
    this._offcanvasEl.classList.remove('showing');

    if (isExpanded) {
      this._offcanvasEl.classList.add('show');
    } else {
      this._offcanvasEl.classList.remove('show');
    }
  }

  _dispatchEvent(data) {
    const options = { isExpanded: this._isExpanded, ...(data || {}) };
    const event = new CustomEvent('custom:change', { detail: options });
    this._rootEl.dispatchEvent(event);
  }

  _toggleOffcanvas(isOpen) {
    this._setAriaExpanded(isOpen);
    this._setTransitionClass();

    if (isOpen) {
      this._isTransitioning = true;
      this._offcanvasEl.setAttribute('aria-modal', 'true');
      this._offcanvasEl.setAttribute('role', 'dialog');
      this._offcanvasEl.focus();
    } else {
      this._offcanvasEl.removeAttribute('aria-modal');
      this._offcanvasEl.removeAttribute('role');
    }

    this._dispatchEvent();
  }

  // Event Handler
  _openOffcanvas() {
    this._toggleOffcanvas(true);
  }

  _closeOffcanvas() {
    this._toggleOffcanvas(false);
  }

  // _handleDocumentClick(e) {
  //   if (!this._isExpanded || this._isTransitioning) return;

  //   if (e.target.closest('.navbar__offcanvas') != this._offcanvasEl) {
  //     this._closeOffcanvas();
  //   }
  // }

  // _onTransitionEnd(e) {
  //   if (this._isExpanded) {
  //     this._updateClassOnOffcanvasShow();
  //   } else {
  //     this._updateClassOnOffcanvasHide();
  //   }

  //   this._isTransitioning = false;
  // }

  _onTransitionEnd(e) {
    this._toggleOffcanvasClasses(this._isExpanded);
    this._isTransitioning = false;
  }
}
