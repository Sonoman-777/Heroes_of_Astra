const ABILITIES = {
    shadow: {
        id: "shadow",
        name: { ru: "Тень", en: "Shadow" },
        desc: {
            ru: "Уменьшает входящий физический урон на 20%, но увеличивает входящий магический урон на 20%.",
            en: "Reduces incoming physical damage by 20%, but increases incoming magical damage by 20%."
        }
    },
    shooter: {
        id: "shooter",
        name: { ru: "Стрелок", en: "Shooter" },
        desc: {
            ru: "Может совершать дальние атаки. Дальность стрельбы указана в характеристиках существа.",
            en: "Can perform ranged attacks. Shooting range is listed in the creature's stats."
        }
    },
    noMeleePenalty: {
        id: "noMeleePenalty",
        name: { ru: "Без штрафа в ближнем бою", en: "No Melee Penalty" },
        desc: {
            ru: "Наносит полный урон в рукопашной схватке.",
            en: "Deals full damage in melee combat."
        }
    },
    meleePenalty: {
        id: "meleePenalty",
        name: { ru: "Штраф в ближнем бою", en: "Melee Penalty" },
        desc: {
            ru: "Урон в рукопашной схватке снижен вдвое.",
            en: "Melee damage is reduced by half."
        }
    },
    caster: {
        id: "caster",
        name: { ru: "Колдун", en: "Caster" },
        desc: {
            ru: "Может использовать заклинания в бою, расходуя ману.",
            en: "Can cast spells in battle using mana."
        }
    },
    magicResist25: {
        id: "magicResist25",
        name: { ru: "Сопротивление магии 25%", en: "Magic Resistance 25%" },
        desc: {
            ru: "Снижает входящий магический урон на 25%.",
            en: "Reduces incoming magical damage by 25%."
        }
    },
    magicResist50: {
        id: "magicResist50",
        name: { ru: "Сопротивление магии 50%", en: "Magic Resistance 50%" },
        desc: {
            ru: "Снижает входящий магический урон на 50%.",
            en: "Reduces incoming magical damage by 50%."
        }
    },
    bravery: {
        id: "bravery",
        name: { ru: "Храбрость", en: "Bravery" },
        desc: {
            ru: "Боевой дух существа всегда положительный (не менее +1).",
            en: "The creature's morale is always positive (at least +1)."
        }
    },
    doubleStrike: {
        id: "doubleStrike",
        name: { ru: "Двойной удар", en: "Double Strike" },
        desc: {
            ru: "Атакует дважды за один ход.",
            en: "Attacks twice per turn."
        }
    },
    flying: {
        id: "flying",
        name: { ru: "Полёт", en: "Flying" },
        desc: {
            ru: "Игнорирует препятствия на поле боя при передвижении.",
            en: "Ignores obstacles on the battlefield when moving."
        }
    },
    large: {
        id: "large",
        name: { ru: "Большое существо", en: "Large Creature" },
        desc: {
            ru: "Занимает 2×2 клетки на поле боя.",
            en: "Occupies 2×2 cells on the battlefield."
        }
    },
    astralBody: {
        id: "astralBody",
        name: { ru: "Астральное тело", en: "Astral Body" },
        desc: {
            ru: "Невосприимчиво к физическим атакам. Получает на 20% больше магического урона.",
            en: "Immune to physical attacks. Takes 20% more magical damage."
        }
    },
    chainShot: {
        id: "chainShot",
        name: { ru: "Цепной выстрел", en: "Chain Shot" },
        desc: {
            ru: "Атака переходит на соседние цели. Урон снижается с каждой целью: 100% → 50% → 25% → 12.5%.",
            en: "Attack chains to adjacent targets. Damage decreases per target: 100% → 50% → 25% → 12.5%."
        }
    },
    sweepingStrike: {
        id: "sweepingStrike",
        name: { ru: "Размашистый удар", en: "Sweeping Strike" },
        desc: {
            ru: "Одновременно атакует 4 клетки перед собой.",
            en: "Strikes 4 cells in front simultaneously."
        }
    },
    livingRam: {
        id: "livingRam",
        name: { ru: "Живой таран", en: "Living Ram" },
        desc: {
            ru: "Может атаковать стены вражеского города при осаде.",
            en: "Can attack enemy town walls during a siege."
        }
    },
    fear: {
        id: "fear",
        name: { ru: "Ужас", en: "Fear" },
        desc: {
            ru: "При атаке может отложить ход цели по шкале инициативы.",
            en: "On attack, may delay the target's turn on the initiative bar."
        }
    },
    teleport: {
        id: "teleport",
        name: { ru: "Телепортация", en: "Teleport" },
        desc: {
            ru: "Может мгновенно перемещаться по полю боя.",
            en: "Can instantly move across the battlefield."
        }
    },
    roar: {
        id: "roar",
        name: { ru: "Рокот", en: "Roar" },
        desc: {
            ru: "В начале боя снижает боевой дух всех вражеских существ на 1.",
            en: "At the start of battle, lowers morale of all enemy creatures by 1."
        }
    },
    hitAndReturn: {
        id: "hitAndReturn",
        name: { ru: "Удар и возврат", en: "Hit and Return" },
        desc: {
            ru: "После атаки существо возвращается на исходную позицию.",
            en: "After attacking, the creature returns to its starting position."
        }
    }
};

export function getAbility(id) {
    return ABILITIES[id] || null;
}

export default ABILITIES;
