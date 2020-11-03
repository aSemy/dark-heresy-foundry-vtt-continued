export async function commonRoll(rollData) {
    _computeTarget(rollData);
    _rollTarget(rollData);
    await _sendToChat(rollData);
}

export async function combatRoll(rollData) {
    _computeTarget(rollData);
    _rollTarget(rollData);
    if (rollData.isSuccess) {
        rollData.hasDamage = true;
        _rollDamage(rollData);
        _rollPenetration(rollData);
    }
    await _sendToChat(rollData);
}

async function _sendToChat(rollData) {
    const html = await renderTemplate("systems/dark-heresy/template/chat/roll.html", rollData);
    let chatData = {
        user: game.user._id,
        rollMode: game.settings.get("core", "rollMode"),
        content: html,
    };
    if (["gmroll", "blindroll"].includes(chatData.rollMode)) {
        chatData.whisper = ChatMessage.getWhisperRecipients("GM");
    } else if (chatData.rollMode === "selfroll") {
        chatData.whisper = [game.user];
    }
    ChatMessage.create(chatData);
}

function _computeTarget(rollData) {
    const range = (rollData.range) ? rollData.range : "0";
    const attackType = (rollData.attackType) ? rollData.attackType : "0";
    const formula = `${rollData.modifier} + ${range} + ${attackType}`;
    let r = new Roll(formula, {});
    r.evaluate();
    if (r.total > 60) {
        rollData.target = rollData.baseTarget + 60;
    } else if (r.total < -60) {
        rollData.target = rollData.baseTarget + -60;
    } else {
        rollData.target = rollData.baseTarget + r.total;
    }
}

function _rollTarget(rollData) {
    let r = new Roll("1d100", {});
    r.evaluate();
    rollData.result = r.total;
    rollData.isSuccess = rollData.result <= rollData.target;
    if (rollData.isSuccess) {
        rollData.dof = 0;
        rollData.dos = 1 + _getDegree(rollData.target, rollData.result);
    } else {
        rollData.dos = 0;
        rollData.dof = 1 + _getDegree(rollData.result, rollData.target);
    }
}

function _rollDamage(rollData) {
    let formula = "0";
    if (rollData.damageFormula) formula = `${rollData.damageFormula} + ${rollData.damageBonus}`;
    let r = new Roll(formula, {});
    r.evaluate();
    let hasReplaceDice = false;
    let total = r.total;
    r.terms.forEach((term) => {
        if (typeof term === 'object' && term !== null) {
            if (term.total === term.faces) rollData.righteousFury = _rollRighteousFury(term);
            if (!hasReplaceDice && term.total < rollData.dos) {
                hasReplaceDice = true;
                total += (rollData.dos - term.total);
            }
        }
    });
    rollData.location = _getLocation(rollData.result);
    rollData.damage = total;
}

function _rollPenetration(rollData) {
    (rollData.penetrationFormula) ? rollData.penetrationFormula : "0";
    let r = new Roll(rollData.penetrationFormula, {});
    r.evaluate();
    rollData.penetration = r.total;
}

function _rollRighteousFury() {
    let r = new Roll("1d5", {});
    r.evaluate();
    return r.total;
}

function _getLocation(result) {
    const locationTarget = parseFloat(result.toString().split('').reverse().join('')) * Math.sign(result);
    if (locationTarget <= 10) {
        return "ARMOUR.HEAD";
    } else if (locationTarget >= 11 && locationTarget <= 20) {
        return "ARMOUR.RIGHT_ARM";
    } else if (locationTarget >= 21 && locationTarget <= 30) {
        return "ARMOUR.LEFT_ARM";
    } else if (locationTarget >= 31 && locationTarget <= 70) {
        return "ARMOUR.BODY";
    } else if (locationTarget >= 71 && locationTarget <= 85) {
        return "ARMOUR.RIGHT_LEG";
    } else if (locationTarget >= 86 && locationTarget <= 100) {
        return "ARMOUR.LEFT_LEG";
    } else {
        return "ARMOUR.BODY";
    }
}

function _getDegree(a, b) {
    return Math.floor(a / 10) - Math.floor(b / 10);
}