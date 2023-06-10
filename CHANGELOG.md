# 2.2.0

- Use table and item UUIDs for character generator.
- Move character names to rollable table.
- Don't hide compendium background images.


# 2.1.2

- Add obsession table roll to PC and NPC generation.
- Fix weapons table assault rifle + grenade launcher result.

# 2.1.1

- Fix reboot button on character sheet.

# 2.1.0

- Add drugs.

# 2.0.4

- Fix more compendium mislinks.

# 2.0.3

- Fix syntax error.

# 2.0.2

- Fix various broken compendium links.

# 2.0.1

- Fix class sheet's items field not saving.

# 2.0.0

- v11 compatibility.
- Reorganize compendiums with folders.

# 1.8.0

- Add journal page listeners for rollable and draw-from-table css classes.

# 1.7.0

- Add custom enricher for DRAW[]{} patterns in text.
- Make npc sheet buttons not submit on enter.

# 1.6.2

- Replace Perfect DOS VGA font with Nouveau IBM, which has more symbols/characters
- Reduce top padding for sheet's tab body.
- Give npc sheet ATTACK textfield another row.

# 1.6.1

- Fix cyrage calculation to only include equipped cybertech.
- Show relevant cy-rage averted text in battered outcome.

# 1.6.0

- Redesigned, wider-layout character and vehicle sheets.
- Switch sheet tabs from icons to text labels.
- Switch to prosemirror engine for editors.

# 1.5.3

- Fix broken images in Corpkiller compendiums.

# 1.5.2

- Fix drone assault rifle image path, for realsies.

# 1.5.1

- Fix image path for drone assault rifle.
- Fix missing translations in Make Punk and Allowed Classes dialogs.
- Fix css formatting for Allowed Classes dialog.

# 1.5.0

- Add Flintwyrm's pixel art portraits, and use them in character and npc generators.
- Remove AI-generated portraits. (Images still separately available at https://github.com/mcglincy/cy-portraits and https://drive.google.com/drive/folders/1P0zhex3T8pu8v1kRbCpzTyw5a0gQHbJ-?usp=sharing) 

# 1.4.0

- New weapon icons by Flintwyrm.
- Fixed item sheet portrait CSS.

# 1.3.2

- Minimum 1 slot for cyberdecks.
- Show common equipment fields on app edit sheet.
- Set carry slots and quantity for all apps.
- Don't count carry slots for slotted apps.

# 1.3.1

- Fix burned hacker starting cyberdeck.
- Fix cyberdeck/cyberdeck+ slot formulas.

# 1.3.0

- Add cyberdeck item type, sheet, and items.
- Add createMacro field & handling for items.
- Make starting cyberdeck run a create macro to set its slots.
- Rename "postCreateMacro" field to "actorCreateMacro".
- Add Macros compendium, and move CorpKiller and Gearhead macros there.
- Implement app/cyberdeck slotting: decks appear on the apps & nano tab, drag apps to deck to slot, use eject button to eject.
- Delete linked infestation when deleting nano.

# 1.2.3

- Add d3-slots cyberdeck used in 3rd starting gear table.

# 1.2.2

- Fix bug where defend wasn't using agility.
- Tweak sheet widths and padding + scrollbar styling, so sheets look good on both chrome/webkit and firefox.

# 1.2.1

- Set grenades, flashbangs, and epulse grenades to 0.25 carry slots.
- Reload page after changing AdBot chat message settings, so those changes take effect immediately.
- Un-burn apps after a long rest.

# 1.2.0

- Merge cy_borg-core content module into cy_borg system.
- Add in-game README as a journal entry compendium.
- Add NPC generator and "Make NPC" button.
- Add Roles random table.
- Tweak various random description tables to be third-person.
- Tweak foe and vehicle sheet top spacing.
- Add solarized color schemes.
- Rename "foe" to "npc".

# 1.1.0

- Add hitPoints and description to Foe template.json, also fixing token rt-click hitPoints editing.
- More punk portraits.

# 1.0.9

- Style Foundry content links (e.g., table draws in chat) to use color schemes.
- Clean up warnings in system.json.

# 1.0.8

- Make sound effect setting per-client.
- Reboot fix: show notification if user can't create their own npc actor.
- Reboot fix: create linked infestation for nanos.
- Reboot fix: update token and proto token texture.src.
- Fix infestation item button placement.
- Fix actor create for v10.
- Rename Reroll button to Reboot.

# 1.0.7

- Only play sound effects for the current user (and don't push to other clients).
- Add lo-fi AI-generated portraits, and use them in the punkfactory.
- Add Virtua Boi, p0w3rsh3ll, and MORK color schemes.

# 1.0.6

- Fix glitches update on long rest.

# 1.0.5

- Add color scheme setting and some initial schemes.
- Make item icons hot.

# 1.0.4

- Fix linked nanos/infestations.
- Show linked-to name on nano-apps tab.
- Set shorter name for pc-owned npcs, like gearhead's.

# 1.0.3

- Fix count bullets button.

# 1.0.2

- Fix handlebars template registration error.

# 1.0.1

- Tweak character sheet UI styling and sizing.
- Combine nano and app tabs.
- Eliminate money tab in favor of credits up top and debt in char description.
- Fix git merge conflict bug in nano/infestation link display.

# 1.0 0

- Foundry v10 compatibility.

# 0.5.1

- Only show "linked" for linked nano/infestation.
- Create npcs and run post-create macros for rerolled punks, too.
- Fix generator npcs not including npc items.

# 0.5.0

- Character sheet - add money tab to show credits and debt.
- Character sheet - add reroll button.
- Character sheet - remove delete button from class.
- Rearrange weak points on attack dialog.
- Add thrown weapon type which uses strength for attack modifier.
- Attack dialog now remembers autofire checkbox.
- Fix critical damage multiplier for attack.
- Move old motorcycle and taxi to vehicles.
- Fix toughness check using wrong stat label.

# 0.4.5

- Fix missing import on vehicle sheet.

# 0.4.4

- Fix some styling.

# 0.4.3

- Fix some actor sheet bugs.
- Fix some sounds.

# 0.4.2

- Fix/instrument various UI sounds.

# 0.4.1

- Defend using armor with highest current tier.
- Fix tier radio display bug for multiple armor on combat tab.

# 0.4.0

- AdBot popups and system settings.
- Sound effects for various UI events.

# 0.3.0

- AdBot2000. You're welcome.

# 0.2.0

- Fix defend d20Formula code error.
- Fix defend dialog column formatting.
- Add roll to check infestation triggering when taking 5+ damage.
- Code cleanup: DRY up roll card templates and code.
- Show carrying total / capacity on character sheet equipment tab.

# 0.1.0

- First release.

