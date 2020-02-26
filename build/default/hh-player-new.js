import { html, PolymerElement } from "./node_modules/@polymer/polymer/polymer-element.js";
import "./node_modules/@polymer/paper-icon-button/paper-icon-button.js";
import "./node_modules/@polymer/iron-icons/av-icons.js";
import "./node_modules/@polymer/paper-dropdown-menu/paper-dropdown-menu-light.js";
import "./node_modules/@polymer/paper-listbox/paper-listbox.js";
import "./node_modules/@polymer/paper-item/paper-item.js";
import "./node_modules/@polymer/paper-slider/paper-slider.js";
/**
 * `hh-player-new`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class HhPlayerNew extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
                display: block;
                width: 400px;
            }

            .container {
                display: flex;
                flex-direction: row;
                align-items: center;
                width: 100%;
                justify-content: space-around;
                background-color: rgba(255, 255, 255, 0.5);
                border-radius: 10px;
            }

            paper-slider {
                width: 120px;
            }

            paper-dropdown-menu-light, paper-listbox {
                width: 120px;
            }

            .fps-container {
                display: flex;
                flex-direction: column;
            }

            .fps-caption {
                padding-left: 16px;
                font-size: 12px;
                margin-top: 12px;
            }

            .active {
                visibility: visible !important;
            }
      </style>
      <div class="container">
            <paper-icon-button on-click="rewindClick" icon="av:fast-rewind" noink></paper-icon-button>

            <template is="dom-if" if="{{playing}}">
                <paper-icon-button on-click="playingToggle" icon="av:play-arrow" noink></paper-icon-button>
            </template>
            <template is="dom-if" if="{{!playing}}">
                <paper-icon-button on-click="playingToggle" icon="av:pause" noink></paper-icon-button>
            </template>
            <paper-icon-button on-click="forwardClick" icon="av:fast-forward" noink></paper-icon-button>

            <paper-dropdown-menu-light class="custom" label="Frame Time Type" >
                <paper-listbox slot="dropdown-content" class="dropdown-content" selected="{{selected}}">
                    <paper-item id="vector">Vector</paper-item>
                    <paper-item>Default</paper-item>
                </paper-listbox>
            </paper-dropdown-menu-light>

            <div id="fps" class="fps-container" style="visibility: hidden">
                <div class="fps-caption">Frame Rate : <span id="fpsLabel"></span></div>
                <paper-slider id="fpsRatings" min="0" max="30" value="{{frameRate}}" pin></paper-slider>
            </div>
        </div>
    `;
  }

  ready() {
    super.ready();
    this.$.fpsLabel.textContent = this.$.fpsRatings.value;

    this.$.fpsRatings._valueChanged = value => {
      this.$.fpsLabel.textContent = value;
    };
  }

  static get properties() {
    return {
      frameRate: {
        type: Number,
        value: 0,
        observer: "_frameRateChanged"
      },
      playing: {
        type: Boolean,
        value: true,
        observer: "_framePlayChanged"
      },
      selected: {
        type: String,
        value: 0,
        observer: "_viewTypeChanged"
      },
      data: {
        type: Object,
        observer: "_dataChanged"
      }
    };
  }

  playingToggle() {
    this.playing = !this.playing;
  }

  forwardClick() {
    this.dispatchEvent(new CustomEvent('frameForwardRewindEvent', {
      detail: 1
    }));
  }

  rewindClick() {
    this.dispatchEvent(new CustomEvent('frameForwardRewindEvent', {
      detail: -1
    }));
  }

  _dataChanged(newValue, oldValue) {
    this._initComponent();

    if (newValue.frameTimeType > -1) {
      this.selected = newValue.frameTimeType;
    }

    if (newValue.frameTimeVector && newValue.frameTimeVector.length > 0 && newValue.frameTimeVector != "") {} else {
      this.$.vector.setAttribute("disabled", "disabled");
      this.selected = 1;
      this.$.fps.classList.toggle("active", true);
    }

    this.frameRate = newValue.frameRate;
    this.playing = newValue.framePlay;
  }

  _initComponent() {
    this.selected = 0;
    this.frameRate = 0;
    this.$.fps.classList.toggle("active", false);
    this.$.vector.removeAttribute("disabled");
  }

  _viewTypeChanged(newValue, oldValue) {
    if (newValue == 0) {
      this.$.fps.classList.toggle("active", false);
    }

    if (newValue == 1) {
      this.$.fps.classList.toggle("active", true);
    }

    this.playing = true;
    this.dispatchEvent(new CustomEvent('frameTimeTypeChangedEvent', {
      detail: this.selected
    }));
  }

  _frameRateChanged(newValue, oldValue) {
    this.dispatchEvent(new CustomEvent('frameRateChangedEvent', {
      detail: newValue
    }));
    this.playing = true;
  }

  _framePlayChanged(newValue, oldValue) {
    this.dispatchEvent(new CustomEvent('framePlayChangedEvent', {
      detail: newValue
    }));
  }

}

window.customElements.define('hh-player-new', HhPlayerNew);