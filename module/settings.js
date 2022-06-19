import { CY } from "./config.js";
import { AllowedScvmClassesDialog } from "./generator/allowed-scvm-classes-dialog.js";

export const registerSystemSettings = () => {
  /** Whether to keep track of carrying capacity */
  game.settings.register(CY.system, "trackCarryingCapacity", {
    name: "CY.SettingsApplyOvercapacityPenalty",
    hint: "CY.SettingsApplyOvercapacityPenaltyHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Whether to show chat message ads */
  game.settings.register(CY.system, "showChatAds", {
    name: "CY.SettingsShowChatAds",
    hint: "CY.SettingsShowChatAdsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Delay between showing chat ads */
  game.settings.register(CY.system, "chatAdDelay", {
    name: "CY.SettingsChatAdDelay",
    hint: "CY.SettingsChatAdDelay",
    scope: "world",
    config: true,
    type: Number,
    default: 20,
  });

  /** Whether to show popup ads */
  game.settings.register(CY.system, "showPopupAds", {
    name: "CY.SettingsShowPopupAds",
    hint: "CY.SettingsShowPopupAdsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** Chance to show a popup ad */
  game.settings.register(CY.system, "popupAdChance", {
    name: "CY.SettingsPopupAdChance",
    hint: "CY.SettingsPopupAdChanceHint",
    scope: "world",
    config: true,
    type: Number,
    default: 50,
  });

  /** Whether to show popup ad instead of intended function (vs. in addition to) */
  game.settings.register(CY.system, "popupAdInstead", {
    name: "CY.SettingsPopupAdInstead",
    hint: "CY.SettingsPopupAdInsteadHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });


  /** Whether to play sound effects */
  game.settings.register(CY.system, "soundEffects", {
    name: "CY.SettingsSoundEffects",
    hint: "CY.SettingsSoundEffectsHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  /** The allowed classes menu */
  game.settings.registerMenu(CY.system, "EditAllowedScvmClassesMenu", {
    name: "CY.EditAllowedScvmClassesMenu",
    hint: "CY.EditAllowedScvmClassesMenuHint",
    label: "CY.EditAllowedScvmClassesMenuButtonLabel",
    icon: "fas fa-cog",
    type: AllowedScvmClassesDialog,
    restricted: true,
  });

  /** The allowed classes menu for scvmfactory */
  game.settings.register(CY.system, "allowedScvmClasses", {
    name: "",
    default: {},
    type: Object,
    scope: "world",
    config: false,
  });

  /** The client scvmfactory selected classes  */
  game.settings.register(CY.system, "lastScvmfactorySelection", {
    name: "",
    default: [],
    type: Array,
    scope: "client",
    config: false,
  });
};

export const showChatAds = () => {
  return game.settings.get(CY.system, "showChatAds");
};

export const chatAdDelay = () => {
  return game.settings.get(CY.system, "chatAdDelay");
};

export const showPopupAds = () => {
  return game.settings.get(CY.system, "showPopupAds");
};

export const popupAdChance = () => {
  return game.settings.get(CY.system, "popupAdChance");
};

export const popupAdInstead = () => {
  return game.settings.get(CY.system, "popupAdInstead");
};

export const soundEffects = () => {
  return game.settings.get(CY.system, "soundEffects");
};

export const trackCarryingCapacity = () => {
  return game.settings.get(CY.system, "trackCarryingCapacity");
};

export const isScvmClassAllowed = (classPack) => {
  const allowedScvmClasses = game.settings.get(
    CY.system,
    "allowedScvmClasses"
  );
  return typeof allowedScvmClasses[classPack] === "undefined"
    ? true
    : !!allowedScvmClasses[classPack];
};

export const setAllowedScvmClasses = (allowedScvmClasses) => {
  return game.settings.set(
    CY.system,
    "allowedScvmClasses",
    allowedScvmClasses
  );
};

export const getLastScvmfactorySelection = () => {
  return game.settings.get(CY.system, "lastScvmfactorySelection");
};

export const setLastScvmfactorySelection = (lastScvmfactorySelection) => {
  return game.settings.set(
    CY.system,
    "lastScvmfactorySelection",
    lastScvmfactorySelection
  );
};
