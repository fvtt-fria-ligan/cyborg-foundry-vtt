export const CY = {};

CY.system = "cy-borg";

CY.actorTypes = {
  character: "character",
  foe: "foe",
  vehicle: "vehicle"
};

CY.itemTypes = {
  app: "app",
  armor: "armor",
  class: "class",
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

CY.appBacklashesPack = "cy-borg.random-tables";
CY.appBacklashesTable = "App Backlashes";

// Config variables for the Scvmfactory character generator
CY.scvmFactory = {
  ammoItem: "Ammo Mag",
  ammoPack: "cy-borg.weapons",
  startingItemsPack: "cy-borg.equipment",
  startingItems: [
    "Cheap clothes",
    "Retinal Com Device",
  ],
  characterCreationPack: "cy-borg.random-tables",
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
      tableName: "Quirks",
      formatKey: "CY.QuirkFormat"
    },
    {
      tableName: "Wants",
      formatKey: "CY.WantFormat"
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
      tableName: "Quirks",
      formatKey: "CY.QuirkFormat"
    },
    {
      tableName: "Wants",
      formatKey: "CY.WantFormat"
    },
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