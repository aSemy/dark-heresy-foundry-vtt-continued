import { commonRoll, combatRoll } from "./roll.js";

export async function prepareCommonRoll(rollData) {
    const html = await renderTemplate("systems/dark-heresy/template/dialog/common-roll.html", rollData);
    let dialog = new Dialog({
        title: game.i18n.localize(rollData.name),
        content: html,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("BUTTON.ROLL"),
                callback: async (html) => {
                    rollData.name = game.i18n.localize(rollData.name);
                    rollData.baseTarget = parseInt(html.find("#target")[0].value, 10);
                    rollData.modifier = html.find("#modifier")[0].value;
                    await commonRoll(rollData);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("BUTTON.CANCEL"),
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    }, {width: 200});
    dialog.render(true);
}

export async function prepareCombatRoll(rollData) {
    let psyRatingRegex = /PR/gi;
    let psy = (rollData.psy) ? rollData.psy : 0;
    const html = await renderTemplate("systems/dark-heresy/template/dialog/combat-roll.html", rollData);
    let dialog = new Dialog({
        title: rollData.name,
        content: html,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("BUTTON.ROLL"),
                callback: async (html) => {
                    rollData.name = game.i18n.localize(rollData.name);
                    rollData.baseTarget = parseInt(html.find("#target")[0].value, 10);
                    rollData.modifier = html.find("#modifier")[0].value;
                    const range = html.find("#range")[0];
                    if (typeof range !== "undefined" && range !== null) {
                        rollData.range = range.value;
                    }
                    rollData.attackType = html.find("#attackType")[0].value;
                    rollData.damageFormula = html.find("#damageFormula")[0].value.replace(psyRatingRegex, psy);
                    rollData.damageType = html.find("#damageType")[0].value;
                    rollData.damageBonus = parseInt(html.find("#damageBonus")[0].value, 10);
                    rollData.penetrationFormula = html.find("#penetration")[0].value.replace(psyRatingRegex, psy);
                    await combatRoll(rollData);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("BUTTON.CANCEL"),
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    }, {width: 200});
    dialog.render(true);
}

export async function preparePsychicPowerRoll(rollData) {
    let psyRatingRegex = /PR/gi;
    const html = await renderTemplate("systems/dark-heresy/template/dialog/psychic-power-roll.html", rollData);
    let dialog = new Dialog({
        title: rollData.name,
        content: html,
        buttons: {
            roll: {
                icon: '<i class="fas fa-check"></i>',
                label: game.i18n.localize("BUTTON.ROLL"),
                callback: async (html) => {
                    rollData.name = game.i18n.localize(rollData.name);
                    rollData.baseTarget = parseInt(html.find("#target")[0].value, 10);
                    rollData.modifier = html.find("#modifier")[0].value;
                    rollData.psy = parseInt(html.find("#psy")[0].value, 10);
                    rollData.damageFormula = html.find("#damageFormula")[0].value.replace(psyRatingRegex, rollData.psy);
                    rollData.damageType = html.find("#damageType")[0].value;
                    rollData.damageBonus = parseInt(html.find("#damageBonus")[0].value, 10);
                    rollData.penetrationFormula = html.find("#penetration")[0].value.replace(psyRatingRegex, rollData.psy);
                    await combatRoll(rollData);
                },
            },
            cancel: {
                icon: '<i class="fas fa-times"></i>',
                label: game.i18n.localize("BUTTON.CANCEL"),
                callback: () => {},
            },
        },
        default: "roll",
        close: () => {},
    }, {width: 200});
    dialog.render(true);
}