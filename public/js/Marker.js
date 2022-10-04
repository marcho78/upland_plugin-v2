class Marker {
  id;
  manager;
  map;
  rootElement;
  sendFeeDiv;
  priceDiv;
  markupDiv;
  property;
  screenPos;
  propertyData;
  colorized;

  sendFee;
  markupPercentage;

  constructor({ id, manager, rootElement, map, property }) {
    // this.log(
    //   "constructor() -> Invoked, id:",
    //   id,
    //   "manager:",
    //   manager,
    //   "rootElement:",
    //   rootElement,
    //   "property:",
    //   property
    // );
    this.id = id;
    this.manager = manager;
    this.rootElement = rootElement;
    this.map = map;
    this.property = property;
    const e = Utility.e;
    this.element = e({
      name: "div",
      parent: rootElement,
      classes: ["my-marker"],
    });
    this.sendFeeDiv = e({
      name: "div",
      classes: ["uk-hidden"],
      parent: this.element,
      classes: ["send-fee-div"],
    });
    this.priceDiv = e({
      name: "div",
      classes: ["price-div", "uk-hidden"],
      parent: this.element,
    });
    this.markupDiv = e({
      name: "div",
      classes: ["markup-div", "uk-hidden"],
      parent: this.element,
    });
    // this.log("constructor() -> this:", this);
  }

  log(...args) {
    console.log("[Marker]", ...args);
  }

  setVisible(visible) {
    // this.log("setVisible() -> Invoked, visible:", visible);
    if (visible) {
      this.element.classList.remove("uk-hidden");
    } else {
      this.element.classList.add("uk-hidden");
    }
  }

  setPropertyData(propertyData) {
    // this.log("setPropertyData() -> Invoked, propertyData:", propertyData);

    this.propertyData = propertyData;

    const sendFee = propertyData.teleport_price;
    this.sendFee = sendFee;
    this.setSendFeeText(sendFee);

    if (propertyData.status == "For sale") {
      const price = propertyData.price;
      const priceText = Number(price).toLocaleString();
      this.setPriceText(priceText);

      const lastPurchasedPrice = propertyData.last_purchased_price;
      if (lastPurchasedPrice) {
        const profit = price - lastPurchasedPrice;
        const markup = profit / lastPurchasedPrice;
        const markupPercentage = Math.floor(markup * 100);
        const symbol = markupPercentage > 0 ? "+" : "";
        this.markupPercentage = markupPercentage;

        const markupText = symbol + markupPercentage + "%";

        this.setMarkupText(markupText);
      }
    }

    this.log("setPropertyData() -> this:", this);
  }

  setSendFeeVisible(visible) {
    // this.log("setSendFeeVisible() -> Invoked, visible:", visible);
    if (visible) {
      this.sendFeeDiv.classList.remove("uk-hidden");
    } else {
      this.sendFeeDiv.classList.add("uk-hidden");
    }
  }

  setSendFeeText(text) {
    this.sendFeeDiv.innerText = text;
  }

  setPriceVisible(visible) {
    // this.log("setPriceVisible() -> Invoked, visible:", visible);
    if (visible) {
      this.priceDiv.classList.remove("uk-hidden");
    } else {
      this.priceDiv.classList.add("uk-hidden");
    }
  }

  setPriceText(text) {
    this.priceDiv.innerText = text;
  }

  setMarkupTextVisible(visible) {
    // this.log("setMarkupTextVisible() -> Invoked, visible:", visible);
    if (visible) {
      this.markupDiv.classList.remove("uk-hidden");
    } else {
      this.markupDiv.classList.add("uk-hidden");
    }
  }

  setMarkupText(text) {
    this.markupDiv.innerText = text;
  }

  setSendFeeColorized(colorized) {
    // this.log("setColorized() -> Invoked, colorized:", colorized);

    if (colorized) {
      const teleportPrice = this.propertyData.teleport_price;
      let backgroundColor;
      let color;
      color = "beige";
      if (teleportPrice <= 20) {
        backgroundColor = "#264653";
      } else if (teleportPrice <= 40) {
        backgroundColor = "#2a9d8f";
      } else if (teleportPrice <= 60) {
        backgroundColor = "#e9c46a";
      } else if (teleportPrice <= 80) {
        backgroundColor = "#f4a261";
      } else if (teleportPrice <= 100) {
        backgroundColor = "#e76f51";
      } else if (teleportPrice <= 1000) {
        backgroundColor = "#e63946";
      }
      const style = `background-color: ${backgroundColor}; color: ${color}`;
      this.sendFeeDiv.style = style;
    } else {
      this.sendFeeDiv.style = "";
    }
  }

  update() {
    this.manager.updateMarker(this);
  }

  updateScreenPosition() {
    // this.log("updateScreenPosition() -> Invoked");
    const property = this.property;
    const screenPos = this.map.project({
      lng: property.centerlng,
      lat: property.centerlat,
    });
    if (property.labels.fsa_allow) {
      screenPos.y += 18;
    }
    this.screenPos = screenPos;
    // this.log("updateScreenPosition() -> screenPos", screenPos);
    const transformStyle = `transform: translate(-50%, -50%) translate(${screenPos.x}px, ${screenPos.y}px) rotateX(0deg) rotateZ(0deg);`;
    this.element.style = transformStyle;
  }

  destroy() {
    this.element.remove();
  }
}
