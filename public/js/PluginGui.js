class PluginGui {
  plugin;
  rootElement;
  isShow = false;

  constructor(plugin) {
    this.log("constructor() -> Invoked, plugin:", plugin);

    this.plugin = plugin;

    this.createOffcanvas();

    document.addEventListener("keyup", (e) => {
      if (e.code == "KeyP") {
        if (this.isShow) {
          UIkit.offcanvas(this.rootElement).hide();
        } else {
          UIkit.offcanvas(this.rootElement).show();
        }
      }
    });
    this.rootElement.addEventListener("show", () => {
      this.isShow = true;
    });
    this.rootElement.addEventListener("hide", () => {
      this.isShow = false;
    });
  }

  updateSetting(name, value) {
    this.plugin.updateSetting(name, value);
    // this.eventEmitter.emit("setting-changed", name, value);
    this.log("Setting updated, name:", name, "value:", value);
  }

  createOffcanvas() {
    const e = Utility.e;
    const createRangeInput = Utility.createRangeInput;
    const createCheckbox = Utility.createCheckbox;

    const settings = this.plugin.settings;

    // offcanvas
    this.rootElement = e({
      id: "--plugin-sidebar",
      name: "div",
      classes: ["uk-offcanvas", "top-most"],
      attributes: {
        "uk-offcanvas": "bg-close: false",
      },
      style: "display: block; z-index: 9999;",
      parent: document.body,
      children: [
        // offcanvas bar
        e({
          name: "div",
          classes: [
            "uk-offcanvas-bar",
            "uk-offcanvas-bar-animation",
            "uk-offcanvas-slide",
          ],
          style: "max-width: 967px;",
          children: [
            // offcanvas close button
            e({
              name: "button",
              attributes: {
                type: "button",
                "uk-close": true,
              },
              classes: ["uk-offcanvas-close", "uk-icon", "uk-close"],
            }),
            // form stacked
            e({
              name: "form",
              classes: ["uk-form-stacked", "uk-width-1-1@s"],
              children: [
                // header
                e({
                  name: "h2",
                  properties: {
                    innerText: "Plugin Settings",
                  },
                }),
                // fieldset
                e({
                  name: "fieldset",
                  classes: ["uk-fieldset"],
                  children: [
                    // plugin enabled checkbox
                    createCheckbox({
                      labelText: "Plugin Enabled",
                      changeHandler: (e) => {
                        const enabled = e.target.checked;
                        this.updateSetting("pluginEnabled", enabled);
                      },
                      checked: settings.pluginEnabled,
                    }),

                    e({
                      name: "div",
                      children: [
                        e({
                          name: "legend",
                          classes: ["uk-legend"],
                          properties: {
                            innerText: "Send Fee Display",
                          },
                        }),
                        // show send fee checkbox
                        createCheckbox({
                          labelText: "Show Send Fee",
                          changeHandler: (e) => {
                            const enabled = e.target.checked;
                            this.updateSetting("showSendFee", enabled);
                          },
                          checked: settings.showSendFee,
                        }),
                        createRangeInput({
                          labelText: "Send Fee Range",
                          leftMin: 0,
                          leftMax: 1000,
                          leftCurr: settings.sendFeeRangeMin,
                          rightMin: 0,
                          rightMax: 1000,
                          rightCurr: settings.sendFeeRangeMax,
                          minChangeHandler: (e) => {
                            const newValue = e.target.value;
                            this.updateSetting("sendFeeRangeMin", newValue);
                          },
                          maxChangeHandler: (e) => {
                            const newValue = e.target.value;
                            this.updateSetting("sendFeeRangeMax", newValue);
                          },
                        }),
                        // lowest send fee only checkbox
                        createCheckbox({
                          labelText: "Lowest Send Fee Only",
                          changeHandler: (e) => {
                            const newValue = e.target.checked;
                            this.updateSetting("lowestSendFeeOnly", newValue);
                          },
                          checked: settings.lowestSendFeeOnly,
                        }),
                        // colorize checkbox
                        createCheckbox({
                          labelText: "Colorize",
                          changeHandler: (e) => {
                            const newValue = e.target.checked;
                            this.updateSetting("colorize", newValue);
                          },
                          checked: settings.colorize,
                        }),
                      ],
                    }),
                    e({
                      name: "div",
                      children: [
                        e({
                          name: "legend",
                          classes: ["uk-legend"],
                          properties: {
                            innerText: "Property Price Display",
                          },
                        }),
                        // show property price checkbox
                        createCheckbox({
                          labelText: "Show Price",
                          changeHandler: (e) => {
                            const newValue = e.target.checked;
                            this.updateSetting("showPropertyPrice", newValue);
                          },
                          checked: settings.showPropertyPrice,
                        }),
                        // show markup percentage checkbox
                        createCheckbox({
                          labelText: "Show Markup Percentage",
                          changeHandler: (e) => {
                            const newValue = e.target.checked;
                            this.updateSetting(
                              "showMarkupPercentage",
                              newValue
                            );
                          },
                          checked: settings.showMarkupPercentage,
                        }),
                        // markup percentage range
                        createRangeInput({
                          labelText: "Markup Percentage Range",
                          leftMin: 0,
                          leftMax: 1000000,
                          leftCurr: settings.markupRangeMin,
                          rightMin: 0,
                          rightMax: 1000000,
                          rightCurr: settings.markupRangeMax,
                          minChangeHandler: (e) => {
                            const newValue = e.target.value;
                            this.updateSetting("markupRangeMin", newValue);
                          },
                          maxChangeHandler: (e) => {
                            const newValue = e.target.value;
                            this.updateSetting("markupRangeMax", newValue);
                          },
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }

  log(...args) {
    console.log("[PluginGui]", ...args);
  }
}
