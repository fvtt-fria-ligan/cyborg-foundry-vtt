export const CY = {};

CY.system = "cy-borg";

CY.actorTypes = {
  character: "character",
  npc: "npc",
  vehicle: "vehicle"
};

CY.itemTypes = {
  app: "app",
  armor: "armor",
  class: "class",
  cyberdeck: "cyberdeck",
  equipment: "equipment",
  feat: "feat",
  infestation: "infestation",
  nanoPower: "nanoPower",
  weapon: "weapon",
};

CY.weaponTypes = {
  melee: "melee",
  ranged: "ranged",
  thrown: "thrown"
};

CY.armorTiers = {
  0: {
    tier: 0,
    key: "CY.ArmorTierNone",
    damageReductionDie: "1d0",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-0",
  },
  1: {
    tier: 1,
    key: "CY.ArmorTierLight",
    damageReductionDie: "1d2",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d2",
  },
  2: {
    tier: 2,
    key: "CY.ArmorTierMedium",
    damageReductionDie: "1d4",
    agilityModifier: 0,
    defenseModifier: 0,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d4",
  },
  3: {
    tier: 3,
    key: "CY.ArmorTierHeavy",
    damageReductionDie: "1d6",
    agilityModifier: 2,
    defenseModifier: 2,
    strengthModifier: 0,
    toughnessModifier: 0,
    label: "-d6",
  },
  4: {
    tier: 4,
    key: "CY.ArmorTierExoSuit",
    damageReductionDie: "1d8",
    agilityModifier: 4,
    defenseModifier: 2,
    strengthModifier: -2,
    toughnessModifier: -2,
    label: "-d8",
  },
};

// TODO: use this in combat-tab.html
CY.armorTiersList = [CY.armorTiers[0], CY.armorTiers[1], 
  CY.armorTiers[2], CY.armorTiers[3], CY.armorTiers[4]];

CY.flagScope = CY.system;
CY.flags = {
  ATTACK_DR: "attackDR",
  AUTOFIRE: "autofire",
  DEFEND_DR: "defendDR",
  INCOMING_ATTACK: "incomingAttack",
  TARGET_ARMOR: "targetArmor",
};

CY.appBacklashesPack = "cy-borg.cyborg-tables";
CY.appBacklashesTable = "App Backlashes";

// Config variables for the Scvmfactory character generator
CY.scvmFactory = {
  ammoItem: "Ammo Mag",
  ammoPack: "cy-borg.cyborg-items",
  startingItemsPack: "cy-borg.cyborg-items",
  startingItems: [
    "Cheap clothes",
    "Retinal Com Device",
  ],
  characterCreationPack: "cy-borg.cyborg-tables",
  startingEquipmentTables: [
    "Cash & Gear 1",
    "Cash & Gear 2",
    "Cash & Gear 3",
  ],
  startingWeaponTable: "Weapons",
  startingArmorTable: "Armor",
  descriptionTables: [
    {
      tableName: "Styles",
      formatKey: "CY.StyleFormat"
    },
    {
      tableName: "Features",
      formatKey: "CY.FeatureFormat"
    },
    {
      tableName: "Wants",
      formatKey: "CY.WantFormat"
    },
    {
      tableName: "Quirks",
      formatKey: "CY.QuirkFormat"
    },
    {
      tableName: "Obsessions",
      formatKey: "CY.ObsessionFormat"
    },
  ],
  npcDescriptionTables: [
    {
      tableName: "Roles",
      formatKey: "CY.RoleFormat"
    },
    {
      tableName: "Styles",
      formatKey: "CY.StyleFormat"
    },
    {
      tableName: "Features",
      formatKey: "CY.FeatureFormat"
    },
    {
      tableName: "Obsessions",
      formatKey: "CY.ObsessionFormat"
    },    
    {
      tableName: "Quirks",
      formatKey: "CY.QuirkFormat"
    },
    {
      tableName: "Wants",
      formatKey: "CY.WantFormat"
    },
    {
      tableName: "Trinkets",
      formatKey: "CY.CarriesFormat",
      articalize: true
    },
  ],  
  // modules wanting to add more character classes to the generator should append uuids to this list
  classUuids: [
    // Burned Hacker
    "Compendium.cy-borg.cyborg-items.Item.hTC8FruS6zC1hQKs",
    // Classless Punk
    "Compendium.cy-borg.cyborg-items.Item.mOR4y0KD1LElPUx7",
    // Discharged CorpKiller
    "Compendium.cy-borg.cyborg-items.Item.buxwe4sUYRRC72dR",
    // Forsaken Gang-Goon
    "Compendium.cy-borg.cyborg-items.Item.QBxOyQ9J8wVr9Wdj",
    // {Orphaned Gearhead
    "Compendium.cy-borg.cyborg-items.Item.pWM7IpNXYXawvO5Y",
    // Renegade Cyberslasher
    "Compendium.cy-borg.cyborg-items.Item.raLprLcqryAWsSkk",
    // Shunned Nanomancer
    "Compendium.cy-borg.cyborg-items.Item.wE4c4OAHuQygwcFn"
  ],
};

CY.colorSchemes = {
  amber: {
    accent: "gray",
    background: "#282828",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#FFB000",
    highlight: "#FFCC00",
    windowBackground: "#282828",
  },  
  c64: {
    accent: "#8B4096",
    background: "#41328D",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#68B6BD",
    highlight: "#8B4096",
    windowBackground: "#41328D",
  },    
  chalk: {
    accent: "#656565",
    background: "#2E2E2E",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#D4D4D4",
    highlight: "#656565",
    windowBackground: "#2E2E2E",
  },  
  defcon27: {
    accent: "#FF63BE",
    background: "#000000",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#07CAF9",
    highlight: "#B55AFC",
    windowBackground: "#000000",
  },
  flintwyrm: {
    accent: "#71C5C9",
    background: "#000000",
    buttonBackground: "",
    buttonBorder: "",
    buttonForeground: "",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#F6EDDB",
    highlight: "#F800F8",
    windowBackground: "#333333",
  },
  greenHell: {
    accent: "gray",
    background: "#062C01",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#0CFF01",
    highlight: "#A0C577",
    windowBackground: "#062C01",
  },
  mork: {
    accent: "gray",
    background: "#000000",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#FFE800",
    highlight: "#FFFFFF",
    windowBackground: "#000000",
  },  
  p0w3rsh3ll: {
    accent: "gray",
    background: "#032556",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#EEEDF0",
    highlight: "#F7F00D",
    windowBackground: "#032556",
  },
  solarizedDark: {
    // blue 1F88D2
    // cream FDF6E3
    // almost black 002B36
    // gray light 93A1A1
    // magenta D33682 
    // orange B58900
    accent: "#B58900",
    background: "#002B36",
    cyberText: "#D33682",
    disabled: "gray",
    foreground: "#93A1A1",
    highlight: "#1F88D2",    
    windowBackground: "#002B36",
  },
  solarizedLight: {
    accent: "#B58900",
    background: "#FDF6E3",
    cyberText: "#D33682",
    disabled: "gray",
    foreground: "#657B83",
    highlight: "#268BD2",
    windowBackground: "#FDF6E3",
  },
  virtuaBoi: {
    accent: "gray",
    background: "#530300",
    cyberText: "#F8F800",
    disabled: "gray",
    foreground: "#E60000",
    highlight: "#940000",
    windowBackground: "#530300",    
  },
}