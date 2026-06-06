const CREATURES_ASTRAL = {
    // ═══════════════════════════ ТИР 1 ═══════════════════════════
    astral_imp: {
        id: "astral_imp",
        names: { ru: "Бес", en: "Imp" },
        faction: "astral",
        tier: 1,
        upgradeTo: "astral_familiar",
        upgradeFrom: null,
        stats: {
            attack: 1, defense: 1, health: 5,
            damageMin: 2, damageMax: 3,
            speed: 7, initiative: 11,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow"],
        spells: [],
        cost: { gold: 30 },
        growth: 17,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Imp.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Imp.png",
        lore: {
            ru: "Низшие твари Тёмного мира. Бесы неконтролируемы, дики и всегда ищут способ навредить всему живому. Они — пушечное мясо астральных легионов, и никто не считает их потерь. В бою полагаются на численность и врождённую способность ускользать от физических атак, сливаясь с тенью.",
            en: "The lowliest vermin of the Dark Realm. Imps are wild, uncontrollable, and ever eager to harm all living things. They are the cannon fodder of the Astral legions, and none bother to count their losses. In battle they rely on sheer numbers and an innate ability to meld with shadow, evading physical blows."
        }
    },

    astral_familiar: {
        id: "astral_familiar",
        names: { ru: "Фамильяр", en: "Familiar" },
        faction: "astral",
        tier: 1,
        upgradeTo: null,
        upgradeFrom: "astral_imp",
        stats: {
            attack: 2, defense: 1, health: 7,
            damageMin: 3, damageMax: 3,
            speed: 7, initiative: 10,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "hitAndReturn"],
        spells: [],
        cost: { gold: 50 },
        growth: 17,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Familiar.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Familiar.png",
        lore: {
            ru: "Более статные и разумные собратья бесов. Фамильяры охотно идут на контакт и служат астральным командирам в качестве гонцов, шпионов и диверсантов. В бою быстры и непредсказуемы: наносят молниеносный удар и тут же отступают обратно, не давая врагу ответить.",
            en: "The more imposing and cunning kin of imps. Familiars readily serve Astral commanders as messengers, spies, and saboteurs. In battle they are swift and unpredictable: they strike like lightning and retreat before the foe can answer."
        }
    },

    // ═══════════════════════════ ТИР 2 ═══════════════════════════
    astral_demon: {
        id: "astral_demon",
        names: { ru: "Демон", en: "Demon" },
        faction: "astral",
        tier: 2,
        upgradeTo: "astral_shade",
        upgradeFrom: null,
        stats: {
            attack: 3, defense: 3, health: 11,
            damageMin: 2, damageMax: 5,
            speed: 4, initiative: 9,
            shots: 2, mana: 0, shootRange: 5
        },
        abilities: ["shadow", "shooter"],
        spells: [],
        cost: { gold: 70 },
        growth: 12,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Demon.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Demon.png",
        lore: {
            ru: "Основная каста Тёмного мира. Демоны подобны малой аристократии: у каждого есть свои владения и свита из бесов. В бою они предпочитают дистанцию, осыпая врага сгустками тёмной энергии, но и в ближней схватке их клешни способны разорвать плоть.",
            en: "The backbone caste of the Dark Realm. Demons resemble petty aristocracy, each with its own domain and retinue of imps. In battle they favour ranged combat, pelting foes with orbs of dark energy, yet their claws can rend flesh when the enemy draws close."
        }
    },

    astral_shade: {
        id: "astral_shade",
        names: { ru: "Тень", en: "Shade" },
        faction: "astral",
        tier: 2,
        upgradeTo: null,
        upgradeFrom: "astral_demon",
        stats: {
            attack: 4, defense: 3, health: 13,
            damageMin: 3, damageMax: 7,
            speed: 4, initiative: 10,
            shots: 3, mana: 10, shootRange: 6
        },
        abilities: ["shadow", "shooter", "caster"],
        spells: ["weakness"],
        cost: { gold: 100 },
        growth: 12,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Shade.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Shade.png",
        lore: {
            ru: "Тени — демоны, посвятившие себя искусству скрытности и магии. В отличие от простых собратьев, они владеют заклинаниями, способными ослабить врага прежде, чем вонзить в него стрелу. Их присутствие на поле боя предвещает череду несчастий для противника.",
            en: "Shades are demons devoted to the arts of stealth and sorcery. Unlike their simpler kin, they wield spells that weaken the enemy before an arrow is loosed. Their presence on the field heralds a string of misfortunes for the foe."
        }
    },

    // ═══════════════════════════ ТИР 3 ═══════════════════════════
    astral_legion: {
        id: "astral_legion",
        names: { ru: "Легион", en: "Legion" },
        faction: "astral",
        tier: 3,
        upgradeTo: "astral_devourer",
        upgradeFrom: null,
        stats: {
            attack: 5, defense: 3, health: 16,
            damageMin: 3, damageMax: 9,
            speed: 4, initiative: 8,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "magicResist25", "bravery"],
        spells: [],
        cost: { gold: 120 },
        growth: 9,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Legion.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Legion.png",
        lore: {
            ru: "Когда несколько демонов пытаются проникнуть в материальный мир одновременно, их сущности порой сливаются в одно тело. Так рождается Легион — массивное существо, чьё имя говорит само за себя. Несмотря на хаотичную природу, легионы яростны в бою и никогда не отступают.",
            en: "When several demons attempt to breach the material world at once, their essences sometimes fuse into a single body. Thus a Legion is born — a hulking being whose name speaks for itself. Despite their chaotic nature, legions are ferocious in battle and never retreat."
        }
    },

    astral_devourer: {
        id: "astral_devourer",
        names: { ru: "Пожиратель", en: "Devourer" },
        faction: "astral",
        tier: 3,
        upgradeTo: null,
        upgradeFrom: "astral_legion",
        stats: {
            attack: 7, defense: 4, health: 20,
            damageMin: 5, damageMax: 11,
            speed: 4, initiative: 9,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "magicResist50", "doubleStrike"],
        spells: [],
        cost: { gold: 170 },
        growth: 9,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Devourer.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Devourer.png",
        lore: {
            ru: "Древние и могучие легионы становятся Пожирателями. Их голод неутолим, а магия почти не причиняет им вреда. Пожиратели обрушивают на врага град ударов, действуя с удвоенной яростью — и горе тому, кто окажется на их пути.",
            en: "Ancient and mighty legions become Devourers. Their hunger is insatiable, and magic barely scratches them. Devourers unleash a flurry of blows upon the enemy, striking with twice the fury — and woe to any who stand in their way."
        }
    },

    // ═══════════════════════════ ТИР 4 ═══════════════════════════
    astral_succubus: {
        id: "astral_succubus",
        names: { ru: "Суккуб", en: "Succubus" },
        faction: "astral",
        tier: 4,
        upgradeTo: "astral_megaera",
        upgradeFrom: null,
        stats: {
            attack: 9, defense: 9, health: 17,
            damageMin: 15, damageMax: 15,
            speed: 4, initiative: 8,
            shots: 5, mana: 0, shootRange: 6
        },
        abilities: ["shadow", "shooter"],
        spells: [],
        cost: { gold: 200 },
        growth: 7,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Succubus.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Succubus.png",
        lore: {
            ru: "Демонессы Асмодейи, Княгини Похоти. Суккубы парят над полем боя на пучках щупалец, осыпая врагов точными выстрелами тёмной энергии. Их облик прекрасен и смертоносен одновременно — они воплощают соблазн, за которым следует гибель.",
            en: "The demonesses of Asmodea, the Duchess of Lust. Succubi hover above the battlefield on clusters of tendrils, raining precise bolts of dark energy upon their foes. Their form is beautiful and deadly at once — the embodiment of temptation followed by doom."
        }
    },

    astral_megaera: {
        id: "astral_megaera",
        names: { ru: "Мегера", en: "Megaera" },
        faction: "astral",
        tier: 4,
        upgradeTo: null,
        upgradeFrom: "astral_succubus",
        stats: {
            attack: 12, defense: 9, health: 22,
            damageMin: 12, damageMax: 18,
            speed: 4, initiative: 9,
            shots: 5, mana: 20, shootRange: 7
        },
        abilities: ["shadow", "shooter", "caster"],
        spells: ["fury"],
        cost: { gold: 260 },
        growth: 7,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Megaera.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Megaera.png",
        lore: {
            ru: "Порождения хрупкого союза Асмодейи и Сономана. Мегеры утратили привлекательность своих сестёр, но обрели ярость, неведомую прочим демонам. Их единственный глаз видит слабости врага, а заклинания сеют безумие в рядах противника.",
            en: "Spawn of the fragile union between Asmodea and Sonoman. Megaeras have lost the allure of their sisters but gained a fury unknown to other demons. Their single eye sees the enemy's weaknesses, and their spells sow madness among the foe."
        }
    },

    // ═══════════════════════════ ТИР 5 ═══════════════════════════
    astral_beholder: {
        id: "astral_beholder",
        names: { ru: "Созерцатель", en: "Beholder" },
        faction: "astral",
        tier: 5,
        upgradeTo: "astral_amalgam",
        upgradeFrom: null,
        stats: {
            attack: 12, defense: 10, health: 45,
            damageMin: 11, damageMax: 22,
            speed: 3, initiative: 8,
            shots: 7, mana: 30, shootRange: 6
        },
        abilities: ["shadow", "shooter", "caster", "flying", "large"],
        spells: ["slow", "weakness", "dreadfulHowl"],
        cost: { gold: 570 },
        growth: 4,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Beholder.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Beholder.png",
        lore: {
            ru: "Некогда сияющий серафим, чьи молитвы помогли смертным в час Второй Астральной войны. Оверлорд Сономан разорвал его на части и пересобрал заново — так появились Созерцатели, пародия на былую святость. Теперь они парят над полем боя, извергая магию из единственного глаза, и имя падшего ангела стало символом трагической жертвы.",
            en: "Once a radiant seraph whose prayers aided mortals during the Second Astral War. Overlord Sonoman tore him apart and rebuilt him anew — thus Beholders came to be, a mockery of former sanctity. Now they hover above the battlefield, unleashing magic from a single eye, and the fallen angel's name has become a symbol of tragic sacrifice."
        }
    },

    astral_amalgam: {
        id: "astral_amalgam",
        names: { ru: "Амальгама", en: "Amalgam" },
        faction: "astral",
        tier: 5,
        upgradeTo: null,
        upgradeFrom: "astral_beholder",
        stats: {
            attack: 12, defense: 12, health: 50,
            damageMin: 10, damageMax: 20,
            speed: 3, initiative: 8,
            shots: 0, mana: 30, shootRange: 0
        },
        abilities: ["shadow", "caster", "astralBody", "chainShot", "large", "flying"],
        spells: ["phantom", "paralysis", "confusion"],
        cost: { gold: 700 },
        growth: 4,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Amalgam.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Amalgam.png",
        lore: {
            ru: "Дальнейшая мутация Созерцателей. Полупрозрачное тело Амальгамы усеяно десятками глаз, что смотрят во все стороны одновременно. Их астральная природа делает их неуязвимыми для физического оружия, а заклинания способны поражать сразу несколько целей.",
            en: "A further mutation of Beholders. An Amalgam's translucent body is studded with dozens of eyes, peering in all directions at once. Their astral nature renders them impervious to physical weapons, and their spells can strike multiple targets at once."
        }
    },

    // ═══════════════════════════ ТИР 6 ═══════════════════════════
    astral_monstrosity: {
        id: "astral_monstrosity",
        names: { ru: "Чудище", en: "Monstrosity" },
        faction: "astral",
        tier: 6,
        upgradeTo: "astral_spawn",
        upgradeFrom: null,
        stats: {
            attack: 17, defense: 15, health: 50,
            damageMin: 20, damageMax: 40,
            speed: 6, initiative: 10,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "large", "sweepingStrike"],
        spells: [],
        cost: { gold: 1200 },
        growth: 2,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Monstrosity.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Monstrosity.png",
        lore: {
            ru: "Верные звери Оверлорда, созданные по его образу и подобию. Чудища напоминают исполинских богомолов с четырьмя клешнями-ногами. Их размашистые удары способны снести целый отряд, а преданность хозяину абсолютна.",
            en: "The Overlord's loyal beasts, shaped in his own image. Monstrosities resemble colossal mantises with four clawed legs. Their sweeping strikes can crush an entire unit, and their loyalty to their master is absolute."
        }
    },

    astral_spawn: {
        id: "astral_spawn",
        names: { ru: "Отродье", en: "Spawn" },
        faction: "astral",
        tier: 6,
        upgradeTo: null,
        upgradeFrom: "astral_monstrosity",
        stats: {
            attack: 17, defense: 17, health: 59,
            damageMin: 25, damageMax: 42,
            speed: 6, initiative: 10,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "large", "livingRam", "sweepingStrike"],
        spells: [],
        cost: { gold: 1700 },
        growth: 2,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Spawn.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Spawn.png",
        lore: {
            ru: "Древние Чудища, закалённые веками службы. Шесть конечностей и хитиновая корона на голове отличают их от младших собратьев. Отродья способны крушить крепостные стены, а их ярость в бою не знает равных среди демонов их ранга.",
            en: "Ancient Monstrosities, hardened by centuries of service. Six limbs and a chitinous crown upon the head set them apart from their younger kin. Spawn can shatter fortress walls, and their battle-fury knows no equal among demons of their rank."
        }
    },

    // ═══════════════════════════ ТИР 7 ═══════════════════════════
    astral_ouroboros: {
        id: "astral_ouroboros",
        names: { ru: "Уроборос", en: "Ouroboros" },
        faction: "astral",
        tier: 7,
        upgradeTo: "astral_leviathan",
        upgradeFrom: null,
        stats: {
            attack: 27, defense: 20, health: 120,
            damageMin: 45, damageMax: 60,
            speed: 5, initiative: 11,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "large", "fear"],
        spells: [],
        cost: { gold: 2700 },
        growth: 1,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Ouroboros.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Ouroboros.png",
        lore: {
            ru: "Гигантские многоножки, воплощающие бесконечный цикл разрушения. Одно присутствие Уробороса на поле боя вселяет ужас в сердца врагов, заставляя их медлить и ошибаться. Их броня толста, а укус смертелен.",
            en: "Colossal centipedes embodying the endless cycle of destruction. The mere presence of an Ouroboros on the battlefield strikes terror into the hearts of foes, making them falter and err. Their carapace is thick, and their bite is death."
        }
    },

    astral_leviathan: {
        id: "astral_leviathan",
        names: { ru: "Левиафан", en: "Leviathan" },
        faction: "astral",
        tier: 7,
        upgradeTo: null,
        upgradeFrom: "astral_ouroboros",
        stats: {
            attack: 30, defense: 23, health: 170,
            damageMin: 50, damageMax: 70,
            speed: 5, initiative: 11,
            shots: 0, mana: 0, shootRange: 0
        },
        abilities: ["shadow", "large", "teleport", "roar"],
        spells: [],
        cost: { gold: 3600 },
        growth: 1,
        portrait: "assets/images/portraits/creatures/astral/Portrait_Creature_Astral_Leviathan.png",
        sprite: "assets/images/sprites/creatures/astral/Sprite_Creature_Astral_Leviathan.png",
        lore: {
            ru: "Вершина астральной эволюции. Тело Левиафана усеяно щупальцами, а из пасти вырываются пучки чёрных тентаклей. Он способен мгновенно перемещаться сквозь ткань реальности, и его рокот в начале битвы подрывает дух целой армии.",
            en: "The pinnacle of Astral evolution. A Leviathan's body is covered in tendrils, and clusters of black tentacles burst from its maw. It can shift through the fabric of reality in an instant, and its roar at the battle's outset breaks the spirit of an entire army."
        }
    }
};

export default CREATURES_ASTRAL;
