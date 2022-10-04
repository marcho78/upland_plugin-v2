class Utility {
  static e({
    name,
    id,
    classes,
    style,
    properties,
    attributes,
    innerText,
    parent,
    children,
    events,
  }) {
    const element = document.createElement(name);

    if (id) {
      element.id = id;
    }

    if (style) {
      element.style = style;
    }

    if (classes) {
      for (let _class of classes) {
        element.classList.add(_class);
      }
    }

    if (properties) {
      for (let key in properties) {
        const value = properties[key];
        element[key] = value;
      }
    }

    if (attributes) {
      for (let key in attributes) {
        const value = attributes[key];
        element.setAttribute(key, value);
      }
    }

    if (events) {
      for (let event of events) {
        const key = event.key;
        const handler = event.handler;
        if (key && handler) {
          element.addEventListener(key, handler);
        }
      }
    }

    if (children) {
      for (let child of children) {
        element.appendChild(child);
        // console.log("Appending child to element:", element, "child:", child);
      }
    }

    if (parent) {
      parent.appendChild(element);
    }

    return element;
  }
  static createCheckbox({ labelText, changeHandler, checked }) {
    const e = Utility.e;
    return e({
      name: "div",
      classes: ["uk-margin"],
      children: [
        e({
          name: "label",
          children: [
            // checkbox
            e({
              name: "input",
              properties: {
                type: "checkbox",
                checked: checked || false,
              },
              classes: ["uk-checkbox"],
              events: [
                {
                  key: "change",
                  handler: changeHandler,
                },
              ],
            }),
            e({
              name: "span",
              properties: {
                innerText: "   " + labelText,
              },
            }),
          ],
        }),
      ],
    });
  }

  static createRangeInput({
    labelText,
    leftMin,
    leftMax,
    leftCurr,
    rightMin,
    rightMax,
    rightCurr,
    minChangeHandler,
    maxChangeHandler,
  }) {
    const e = Utility.e;
    return e({
      name: "div",
      classes: ["uk-margin"],
      children: [
        e({
          name: "span",
          classes: ["uk-form-label"],
          // innerText: labelText,
          properties: {
            innerText: labelText,
          },
        }),
        e({
          name: "div",
          classes: [
            "uk-margin-small",
            "uk-grid-small",
            "uk-child-width-1-2",
            "uk-grid",
          ],
          attributes: {
            "uk-grid": true,
          },
          children: [
            e({
              name: "div",
              classes: ["uk-first-column"],
              children: [
                e({
                  name: "input",
                  properties: {
                    type: "number",
                    placeholder: "Min",
                    min: leftMin,
                    max: leftMax,
                    value: leftCurr,
                  },
                  classes: ["uk-input"],
                  events: [
                    {
                      key: "change",
                      handler: minChangeHandler,
                    },
                  ],
                }),
              ],
            }),
            e({
              name: "div",
              children: [
                e({
                  name: "input",
                  properties: {
                    type: "number",
                    placeholder: "Max",
                    min: rightMin,
                    max: rightMax,
                    value: rightCurr,
                  },
                  classes: ["uk-input"],
                  events: [
                    {
                      key: "change",
                      handler: maxChangeHandler,
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  static fetchPropertyData(propertyId) {
    const url = "https://api.upland.me/properties/" + propertyId;
    try {
      return fetch(url, {
        headers: {
          "user-agent": `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          return data;
        })
        .catch((error) => {
          this.log("fetchPropertyData() -> Failed to fetch, error:", error);
        });
    } catch (error) {
      this.log("fetchPropertyData() -> Failed to fetch, error:", error);
    }
  }
}
