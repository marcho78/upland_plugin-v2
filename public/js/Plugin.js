class Plugin {
  requiredDiscServerId = "820441675813355552";
  requiredDiscRoleId = "1025133808686731394";

  discToken = null;
  discGuildMember;
  isAuthorized = false;

  settings = {
    pluginEnabled: true,

    showSendFee: true,
    sendFeeRangeMin: 0,
    sendFeeRangeMax: 1000,
    lowestSendFeeOnly: false,
    colorize: true,

    showPropertyPrice: false,
    showMarkupPercentage: false,
    markupRangeMin: 1 - 1,
    markupRangeMax: 1000000,
  };
  pluginGui = null;
  markersManager = null;

  constructor() {
    this.log("constructor() -> Invoked");
    this.authorized();
  }

  start() {
    this.log("start() -> Invoked");

    if (!this.isAuthorized) {
      this.log("start() -> Unauthorized, returning");
      return;
    }

    const markersManager = new MarkersManager(this);
    this.markersManager = markersManager;

    const pluginGui = new PluginGui(this);
    this.pluginGui = pluginGui;

    UIkit.modal.alert("Plugin activated!");
  }

  updateSetting(name, value) {
    this.log("updateSetting() -> Invoked, name:", name, "value:", value);
    this.settings[name] = value;
    this.markersManager.settingUpdated(name, value);
  }

  // guiSettingChanged(name, value) {
  //   this.log("guiSettingChanged() -> Invoked, name:", name, "value:", value);
  //   if (name == "pluginEnabled") {
  //     name = "enabled";
  //   }
  //   this.markersManager.setSetting(name, value);
  //   // switch (name) {
  //   //   case "pluginEnabled":
  //   //     if (value) {
  //   //       this.createMarkers(this.properties);
  //   //     } else {
  //   //       this.pruneAllMarkers();
  //   //     }
  //   //     break;

  //   //   case "sendFeeRangeMin":
  //   //   case "sendFeeRangeMax":
  //   //     this.updateMarkers();
  //   //     break;

  //   //   case "colorize":
  //   //     this.updateMarkers();
  //   //     break;

  //   //   default:
  //   //     break;
  //   // }
  // }

  log(...args) {
    console.log("[Plugin]", ...args);
  }

  onAuthorized(guildMember) {
    this.log("onAuthorized() -> Invoked, GuildMember:", guildMember);
    this.start();
  }

  async authorized() {
    this.log("authorize() -> Invoked");

    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const [accessToken, tokenType] = [
      fragment.get("access_token"),
      fragment.get("token_type"),
    ];
    this.log(
      "authorize() -> tokenType:",
      tokenType,
      "accessToken:",
      accessToken
    );

    if (accessToken) {
      try {
        const guildMemberUrl = `https://discord.com/api/users/@me/guilds/${this.requiredDiscServerId}/member`;
        return fetch(guildMemberUrl, {
          headers: {
            authorization: `${tokenType} ${accessToken}`,
          },
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            this.log(
              "authorize() -> Guild member request successful, data:",
              data
            );

            this.log(
              "authorize() -> Checking required role:",
              this.requiredDiscRoleId
            );

            if (data.roles.includes(this.requiredDiscRoleId)) {
              this.log("authorize() -> Required role available", data);
              this.discordToken = {
                accessToken,
                tokenType,
              };
              this.discordGuildMember = data;
              this.isAuthorized = true;
              this.onAuthorized(data);
            } else {
              this.log("authorize() -> Required role not available", data);
            }
          })
          .catch((error) => {
            this.log(
              "authorize() -> Guild member request failed, error:",
              error
            );
          });
      } catch (error) {
        this.log("authorize() -> Guild member request failed, error:", error);
      }
    } else {
    }
  }
}
new Plugin();
