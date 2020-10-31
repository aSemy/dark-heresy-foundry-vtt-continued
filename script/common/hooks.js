import { DarkHeresyActor } from "./actor.js";
import { DarkHeresyItem } from "./item.js";
import { AcolyteSheet } from "../sheet/acolyte.js";
import { NpcSheet } from "../sheet/npc.js";
import { WeaponSheet } from "../sheet/weapon.js";
import { AmmunitionSheet } from "../sheet/ammunition.js";
import { WeaponModificationSheet } from "../sheet/weapon-modification.js";
import { ArmourSheet } from "../sheet/armour.js";
import { ForceFieldSheet } from "../sheet/force-field.js";
import { CyberneticSheet } from "../sheet/cybernetic.js";
import { DrugSheet } from "../sheet/drug.js";
import { GearSheet } from "../sheet/gear.js";
import { ToolSheet } from "../sheet/tool.js";
import { CriticalInjurySheet } from "../sheet/critical-injury.js";
import { MalignancySheet } from "../sheet/malignancy.js";
import { MentalDisorderSheet } from "../sheet/mental-disorder.js";
import { MutationSheet } from "../sheet/mutation.js";
import { PsychicPowerSheet } from "../sheet/psychic-power.js";
import { TalentSheet } from "../sheet/talent.js";
import { SpecialAbilitySheet } from "../sheet/special-ability.js";
import { TraitSheet } from "../sheet/trait.js";
import { initializeHandlebars } from "./handlebars.js";

Hooks.once("init", () => {
    CONFIG.Combat.initiative = { formula: "@initiative.base + @initiative.bonus", decimals: 0 };
    CONFIG.Actor.entityClass = DarkHeresyActor;
    CONFIG.Item.entityClass = DarkHeresyItem;
    CONFIG.fontFamilies.push("Caslon Antique");
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dark-heresy", AcolyteSheet, { types: ["acolyte"], makeDefault: true });
    Actors.registerSheet("dark-heresy", NpcSheet, { types: ["npc"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dark-heresy", WeaponSheet, { types: ["weapon"], makeDefault: true });
    Items.registerSheet("dark-heresy", AmmunitionSheet, { types: ["ammunition"], makeDefault: true });
    Items.registerSheet("dark-heresy", WeaponModificationSheet, { types: ["weaponModification"], makeDefault: true });
    Items.registerSheet("dark-heresy", ArmourSheet, { types: ["armour"], makeDefault: true });
    Items.registerSheet("dark-heresy", ForceFieldSheet, { types: ["forceField"], makeDefault: true });
    Items.registerSheet("dark-heresy", CyberneticSheet, { types: ["cybernetic"], makeDefault: true });
    Items.registerSheet("dark-heresy", DrugSheet, { types: ["drug"], makeDefault: true });
    Items.registerSheet("dark-heresy", GearSheet, { types: ["gear"], makeDefault: true });
    Items.registerSheet("dark-heresy", ToolSheet, { types: ["tool"], makeDefault: true });
    Items.registerSheet("dark-heresy", CriticalInjurySheet, { types: ["criticalInjury"], makeDefault: true });
    Items.registerSheet("dark-heresy", MalignancySheet, { types: ["malignancy"], makeDefault: true });
    Items.registerSheet("dark-heresy", MentalDisorderSheet, { types: ["mentalDisorder"], makeDefault: true });
    Items.registerSheet("dark-heresy", MutationSheet, { types: ["mutation"], makeDefault: true });
    Items.registerSheet("dark-heresy", PsychicPowerSheet, { types: ["psychicPower"], makeDefault: true });
    Items.registerSheet("dark-heresy", TalentSheet, { types: ["talent"], makeDefault: true });
    Items.registerSheet("dark-heresy", SpecialAbilitySheet, { types: ["specialAbility"], makeDefault: true });
    Items.registerSheet("dark-heresy", TraitSheet, { types: ["trait"], makeDefault: true });
    initializeHandlebars();
});

Hooks.on("preCreateActor", (createData) => {
    mergeObject(createData, {
        "token.bar1" :{ "attribute" : "wounds" },
        "token.bar2" :{ "attribute" : "fatigue" },
        "token.displayName" : CONST.TOKEN_DISPLAY_MODES.HOVER,
        "token.displayBars" : CONST.TOKEN_DISPLAY_MODES.ALWAYS,
        "token.disposition" : CONST.TOKEN_DISPOSITIONS.NEUTRAL,
        "token.name" : createData.name
    });
    if (createData.type === "acolyte") {
        createData.token.vision = true;
        createData.token.actorLink = true;
    }
});