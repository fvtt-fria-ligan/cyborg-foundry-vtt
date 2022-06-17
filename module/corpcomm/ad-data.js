import { sample } from "../utils.js";

export const randomAd = () => {
  return sample(ads);
};

export const randomCssAnimationClass = () => {
  return sample(cssAnimationClasses);
}

export const randomCssFontClass = () => {
  return sample(cssFontClasses);
}

const cssAnimationClasses = [
  "blinking",
  "marching-ants",
  "no-animation",
  "rainbow",
];

// see _ad-card.scss
const cssFontClasses = [
  "font1",
  "font2",
  "font3",
  "font4",
];

const ads = [
  "<b>BrunMG WellBeing</b> - Experience Vigor, one refreshing drop at a time.",
  "Take control; take <b>Control™</b>. Clarity in a Needle. (sync now for a 12 hour free* trial)",
  "<b>MOKA GUNS & BLADES</b><br>5% Disaster sale. Get 'em while you still can.",  
  "<i>Death by Coffee</i> is hiring! No rating required. Purchase a <b>SpeedRun Robusta to Go</b> to apply. Nod twice for drone delivery.",
  "SALE SALE SALE SALE SALE SALE SALE SALE SALE SALE SALE SALE",
  "<b>CPD Police Nachos</b><br>Support your wardens. Get a free Family Pack if your call puts a bad guy behind bars! <i>New Flavor -coming in hot-: Slum Sriracha</i>",
  "<b>Goblin Shark SmartWear</b><br>Sharpen your claws.",
  "<b>Net-Worth</b><br>Visit our website and see your total point worth from all your favorite registered products. Trade, share, and earn more Net coin to turn into your desired point currency! Don't let all the all the hustle and bustle Gross you out. We'll Net your worth and skim through your data for you. Easy and convenient.",
  "You're gonna love these shoes, [Name]. Data never lies. / LynxeR, one step ahead. <b>BLINK TWICE TO SIGN UP CxVV</b>",    
  "BFQVKE 3000 HORMONAL AMPLIFIER: GROW WIDE, GROW TALL",
  "Count moments, not bullets. <b>Vender MagSolutions</b>, your No1 partner in munitions management systems.",  
  "<b>BEERISH</b><br>Buy 2 for 3. Say I love Beerish! to order.",
  "<b>Manifest Munitions</b><br>Blaze your trail with lead that'll really make em run. <i>We're the best, forget the rest.</i><br><br><i>Coupons for buy one get one 5%  off for every prior separate bulk purchase of our Colt Classic Tear Jerker.</i>",
  "<b>DJ MURDER</b> New album <i>ENDEADEN</i> live in 3:01:00...",
  "BRASS-Bandit Recyclers in Burnchurch, we recycle your CASINGS, CANS, PETS and O T H E R",
  "<b>Vender MS</b> Victory Sale. Avoid the bad choice, go with Number 1. Classic Tear Jerker pistols 10% cheaper than our competitors. Offer lasts 10 hours.",
  "LIVE FAST - EAT FAST. // <b>HyperZone Hotdogs</b>",  
  "<i>Paradiso</i> a new Graven Hostel subsidiary. Lay your loved ones to rest in the most heavenly place on earth and visit them at your convenience.<br><br>//Live holo chat purchase sold separately. Rent rates vary on a monthly basis. //",
  "Workplace accident? Visit <b>MultiHead MedTech</b>, Old Straw. No union members allowed",
  "<b>ECO-INJECT</b> Deep-sleep Auto Injector FOR INSTANT RELIEF - Stop that noise in your head, guaranteed DREAMLESS sleep! <i>not for nefarious use, may cause partial or complete memory loss</i>",
  "<b>MED-BORG PLTS</b> Get your Stims, Dims, Sways And Haze at 10% off with offercode <b>BCKN_A10</b>",
  "Cybermechanics HATE this method of selfenhancement! Try our mod kits yourself to get stronger, faster, smarter, more beautiful and more productive!<br><br><b>HOT SALE</b> Get 4 for the price of 5!",
  "<i>TRY OUR SHOOTING GALLERY ~ SURVIVE FOR 7 MINUTES TO GET A 77% DISCOUNT ON ALL MEAT PRODUCTS</i><br><b>ECO-MEATERY</b> tastes like real meat, doesn't it? No animals were harmed!",  
];
 
