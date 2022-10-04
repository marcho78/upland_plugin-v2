class MarkersManager {
  plugin;

  properties;
  markers = {};
  lowestSendFee;

  constructor(plugin) {
    this.plugin = plugin;

    this.rootElement = document.querySelector("#root");

    this.map = window.__map;
    window.__onUpdateProperties = (properties) => {
      this.onUpdateProperties(properties);
    };
    window.__onUpdateMapTransform = () => {
      this.onUpdateMapTransform();
    };
  }

  log(...args) {
    console.log("[MarkersManager]", ...args);
  }

  settingUpdated(name, value) {
    this.log("settingUpdated() -> Invoked, name:", name, "value:", value);
    if (name == "pluginEnabled") {
      if (value) {
        this.createMarkers(this.properties);
      } else {
        this.pruneAllMarkers();
      }
    } else {
      this.updateMarkers();
    }
  }

  iterateMarkers(callback) {
    for (let markerKey in this.markers) {
      const marker = this.markers[markerKey];
      callback(markerKey, marker);
    }
  }

  updateMarker(marker) {
    const propertyData = marker.propertyData;
    // if (propertyData) {
    //   const settings = this.plugin.settings;

    //   if (settings.showPropertyPrice) {
    //     this.log("updateMarker() -> settings:", settings);
    //     marker.setColorized(false);

    //     const isForSale = propertyData.status == "For sale";

    //     if (isForSale) {
    //       const price = propertyData.price;

    //       if (settings.showMarkupPercentage) {
    //         const lastPurchasedPrice = propertyData.last_purchased_price;
    //         const profit = price - lastPurchasedPrice;
    //         const markup = profit / lastPurchasedPrice;
    //         const markupPercentage = Math.floor(markup * 100);

    //         this.log(
    //           "markupRangeMin:",
    //           settings.markupRangeMin,
    //           "markupRangeMax:",
    //           settings.markupRangeMax
    //         );

    //         if (
    //           markupPercentage >= settings.markupRangeMin &&
    //           markupPercentage <= settings.markupRangeMax
    //         ) {
    //           const symbol = markupPercentage > 0 ? "+" : "";
    //           this.log(
    //             "updateMarker() -> lastPurchasedPrice:",
    //             lastPurchasedPrice,
    //             "price:",
    //             price,
    //             "profit:",
    //             profit,
    //             "markup:",
    //             markup,
    //             "markupPercentage:",
    //             markupPercentage
    //           );

    //           const text = `${price} [${symbol + markupPercentage + "%"}]`;
    //           marker.setText(text);
    //           marker.setVisible(true);
    //         } else {
    //           marker.setVisible(false);
    //         }
    //       } else {
    //         marker.setText(price);
    //         marker.setVisible(true);
    //       }
    //     } else {
    //       marker.setVisible(false);
    //     }
    //   } else {
    //     const sendFeeRangeMin = settings.sendFeeRangeMin;
    //     const sendFeeRangeMax = settings.sendFeeRangeMax;
    //     const colorize = settings.colorize;

    //     marker.setText(propertyData.teleport_price);

    //     const teleportPrice = propertyData.teleport_price;
    //     const isInSendFeeRange =
    //       teleportPrice >= sendFeeRangeMin && teleportPrice <= sendFeeRangeMax;
    //     marker.setVisible(isInSendFeeRange);

    //     marker.setColorized(colorize);
    //   }
    // }

    /*
        showSendFee: true,
        sendFeeRangeMin: 0,
        sendFeeRangeMax: 1000,
        lowestSendFeeOnly: false,
        colorize: true,

        showPropertyPrice: false,
        showMarkupPercentage: false,
        markupRangeMin: 1 - 1,
        markupRangeMax: 1000000,
    */
    if (propertyData) {
      const settings = this.plugin.settings;

      // handle send fee

      if (settings.showSendFee) {
        const sendFee = propertyData.teleport_price;

        // lowest send fee only
        if (settings.lowestSendFeeOnly) {
          const lowestSendFee = this.lowestSendFee;
          if (lowestSendFee && sendFee == lowestSendFee) {
            marker.setSendFeeVisible(true);
          } else {
            marker.setSendFeeVisible(false);
          }
        } else {
          const sendFeeRangeMin = settings.sendFeeRangeMin;
          const sendFeeRangeMax = settings.sendFeeRangeMax;
          if (sendFee >= sendFeeRangeMin && sendFee <= sendFeeRangeMax) {
            marker.setSendFeeVisible(true);
          } else {
            marker.setSendFeeVisible(false);
          }
        }

        if (settings.colorize) {
          marker.setSendFeeColorized(true);
        } else {
          marker.setSendFeeColorized(false);
        }
      } else {
        marker.setSendFeeVisible(false);
      }

      // -------------------------------

      // handle price
      if (settings.showPropertyPrice) {
        marker.setPriceVisible(true);
      } else {
        marker.setPriceVisible(false);
      }

      // markup
      const markupPercentage = marker.markupPercentage;
      if (settings.showMarkupPercentage && markupPercentage) {
        // marker.setMarkupTextVisible(true);

        const markupRangeMin = settings.markupRangeMin;
        const markupRangeMax = settings.markupRangeMax;

        this.log(
          "updateMarker() -> markupPercentage:",
          markupPercentage,
          "markupRangeMin:",
          markupRangeMin,
          "markupRangeMax:",
          markupRangeMax
        );

        if (
          markupPercentage >= markupRangeMin &&
          markupPercentage <= markupRangeMax
        ) {
          marker.setMarkupTextVisible(true);
        } else {
          marker.setMarkupTextVisible(false);
        }
      } else {
        marker.setMarkupTextVisible(false);
      }
    }

    marker.updateScreenPosition();
  }

  updateLowestSendFee() {
    // this.log("updateLowestSendFee() -> Invoked");
    let lowest = 1001;
    this.iterateMarkers((key, marker) => {
      const propertyData = marker.propertyData;
      //   this.log("updateLowestSendFee() -> propertyData:", propertyData);
      if (!propertyData) {
        return;
      }

      const sendFee = propertyData.teleport_price;
      //   this.log("updateLowestSendFee() -> travelPrice:", sendFee);
      if (sendFee < lowest) {
        lowest = sendFee;
      }
    });
    // this.log("updateLowestSendFee() -> lowest:", lowest);
    this.lowestSendFee = lowest;
  }

  updateMarkers() {
    this.log("updateMarkers() -> Invoked");

    this.iterateMarkers((key, marker) => {
      // this.log("updateMarkers() -> Updating marker:", key);
      this.updateMarker(marker);
    });
  }

  pruneMarker(marker) {
    marker.destroy();
    delete this.markers[marker.id];
  }

  pruneAllMarkers() {
    this.log("pruneAllMarkers() -> Invoked");
    this.iterateMarkers((key, marker) => {
      this.pruneMarker(marker);
    });
  }

  pruneMarkers(newProperties) {
    this.log("pruneMarkers() -> Invoked");

    const markerToPrune = [];
    this.iterateMarkers((key, marker) => {
      const isInNewProperties = newProperties.find((property) => {
        return property.prop_id == marker.id;
      });

      if (!isInNewProperties) {
        // marker.destroy();
        // // this.markers[markerKey] = undefined;
        // delete this.markers[marker.id];
        markerToPrune.push(marker.id);
      }
    });

    for (let id of markerToPrune) {
      const marker = this.markers[id];
      marker.destroy();
      delete this.markers[id];
    }
  }

  createMarker(property) {
    this.log("createMarker() -> Invoked, property:", property);

    const propertyId = property.prop_id;

    const settings = this.plugin.settings;
    if (!settings.pluginEnabled) {
      this.log("createMarker() -> Not creating markers as plugin is disabled");
      return;
    }

    const marker = new Marker({
      id: propertyId,
      manager: this,
      rootElement: this.rootElement,
      map: this.map,
      property,
    });
    this.log("createMarker() -> Created marker:", marker);

    Utility.fetchPropertyData(propertyId).then((propertyData) => {
      //   marker.propertyData = propertyData;
      marker.setPropertyData(propertyData);
      this.updateLowestSendFee();

      this.updateMarkers();
    });

    this.markers[propertyId] = marker;
  }

  createMarkers(properties) {
    this.log("createMarkers() -> Invoked(), properties:", properties);

    if (!properties) {
      return;
    }

    this.pruneMarkers(properties);

    for (let property of properties) {
      const propertyId = property.prop_id;

      // marker already exists, don't create it again
      if (this.markers[propertyId]) {
        this.log(
          "createMarkers() -> not creating marker as one already exists for property with id:",
          property.prop_id
        );
        continue;
      }

      this.createMarker(property);
    }

    this.updateMarkers();
  }

  onUpdateProperties(properties) {
    this.log("onUpdatePropertyies() -> Invoked, properties:", properties);

    this.properties = properties;

    // if (this.plugin.gui.settings.pluginEnabled) {
    //   this.createMarkers(properties);
    // }
    if (this.plugin.settings.pluginEnabled) {
      this.createMarkers(properties);
    }
  }

  onUpdateMapTransform() {
    //     if (this.plugin.gui.settings.pluginEnabled) {
    //       for (let markerKey in this.markers) {
    //         const marker = this.markers[markerKey];
    //         if (marker) {
    //           marker.updateScreenPosition();
    //         }
    //       }
    //     }
    //   }
    if (this.plugin.settings.pluginEnabled) {
      for (let markerKey in this.markers) {
        const marker = this.markers[markerKey];
        if (marker) {
          marker.updateScreenPosition();
        }
      }
    }
  }
}
