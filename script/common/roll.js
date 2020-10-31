export async function commonRoll(rollData) {
    _rollTarget(rollData);
    await _sendToChat(rollData);
}

export async function combatRoll(rollData) {
    _rollTarget(rollData);
    if (rollData.isSuccess) {
        rollData.hasDamage = true;
        _rollDamage(rollData);
        _rollPenetration(rollData);
    }
    await _sendToChat(rollData);
}

async function _sendToChat(rollData) {
    console.log(rollData)
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

function _getDegree(a, b) {
    return Math.floor(a / 10) - Math.floor(b / 10);
}