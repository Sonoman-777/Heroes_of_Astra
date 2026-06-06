const HEROES_ASTRAL = {
    Sonoman: {
        id: "Sonoman",
        names: { ru: "Сономан", en: "Sonoman" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Sonoman.png",
        battleSprite: "assets/images/sprites/heroes/astral/Sonoman_battle.png",
        specializationId: "astral_wind_master",
        biography: {
            ru: "Сономан, величаемый Оверлордом и Лордом Гордыни, занимает место семнадцатого демонического владыки Астрального пантеона. Когда пал Протоастральный Владыка и завершилась Первая Астральная война, его сущность раскололась на сотни осколков — каждый из них стал воплощением греха, одержимости или безумия. Сономан, рождённый из Гордыни, с самого начала вознамерился стать единоличным правителем Астрала. Столетиями он плёл хитроумную паутину, стравливая меж собой и смертных, и собратьев-демонов, шаг за шагом расчищая путь к трону. Именно его деяния во многом породили хаос, захлестнувший мир в эпоху Раздора. Когда же сильнейшие демоны Тёмного Пантеона истощили силы в междоусобицах, Сономан нанёс единственный, точно выверенный удар, запустив череду событий, вошедших в историю как Семь Судных дней. Не встретив более сопротивления в Астрале, новоявленный Оверлорд обрушил легионы тьмы на материальный мир, развязав Вторую Астральную войну. И хотя война не принесла Тёмному миру окончательной победы, плоды её оказались весомы: смертные последователи пополнили ряды почитателей, а мир осознал — древняя угроза обрела невиданное прежде могущество.",
            en: "Sonoman, called the Overlord and Lord of Pride, stands as the seventeenth demonic sovereign of the Astral Pantheon. When the Protoastral Overlord fell and the First Astral War came to its end, his essence shattered into a hundred fragments, each an embodiment of sin, obsession, or madness. Born of Pride, Sonoman was determined from the very first to rule the Astral realm alone. For centuries he wove an intricate web, pitting mortals and fellow demons against one another, clearing his path to the throne step by step. It was his hand that kindled much of the chaos of the Age of Discord. Once the mightiest demons of the Dark Pantheon had bled themselves dry in internecine strife, Sonoman struck a single, perfectly aimed blow, setting in motion the events remembered as the Seven Days of Judgement. With none left in the Astral to oppose him, the Overlord unleashed his dark legions upon the mortal world, beginning the Second Astral War. Though victory was not absolute, its fruits were rich: mortal devotees swelled the ranks of his faithful, and the world understood that the ancient menace had grown more terrible than ever."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [{ key: "sorcery", level: 1, perks: ["manaReplenish"] }],
            artifacts: [],
            army: [
                { creatureId: "astral_familiar", count: 15 },
                { creatureId: "astral_demon", count: 8 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 4, defense: 2, spellpower: 7, knowledge: 4 },
            level: 15,
            skills: [
                { key: "sorcery", level: 3, perks: ["manaReplenish", "arcaneKnowledge", "wisdom"] },
                { key: "darkMagic", level: 2, perks: ["mindLord"] },
                { key: "attack", level: 2, perks: ["tactics", "shooting"] },
                { key: "defense", level: 1, perks: ["evasion"] }
            ],
            artifacts: ["crown_of_chaos", "astral_piercer", "ring_of_mana"],
            army: [
                { creatureId: "astral_familiar", count: 140 },
                { creatureId: "astral_shade", count: 70 },
                { creatureId: "astral_devourer", count: 45 },
                { creatureId: "astral_megaera", count: 30 },
                { creatureId: "astral_amalgam", count: 15 },
                { creatureId: "astral_spawn", count: 7 },
                { creatureId: "astral_leviathan", count: 3 }
            ],
            warMachines: ["catapult", "ballista", "ammoCart", "firstAidTent"],
            captain: null,
            spells: []
        }
    },

    Lamia: {
        id: "Lamia",
        names: { ru: "Ламия", en: "Lamia" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Lamia.png",
        battleSprite: "assets/images/sprites/heroes/astral/Lamia_battle.png",
        specializationId: "envious_gaze",
        biography: {
            ru: "Ламия, тринадцатая среди демонических владык Тёмного Пантеона, известна как Княгиня Зависти. Зависть её ко всему сущему служит и оружием, и бременем: она позволяет Ламии превосходить многих собратьев, но вместе с тем открывает уязвимости для чужого влияния. Принимая облик исполинской осы, она является смертным в их грёзах, даруя то, чего они вожделеют, и отнимая то, что возжелала сама. Ламия — главная соперница Сономана в борьбе за трон Тёмного мира, неустанно плетущая козни против брата, чьё положение не даёт ей покоя.",
            en: "Lamia, the thirteenth demonic sovereign of the Dark Pantheon, is called the Duchess of Envy. Her boundless envy of all things is both her weapon and her burden: it elevates her above many of her kin, yet lays bare vulnerabilities that others may exploit. Appearing in the shape of a colossal wasp, she visits mortals in their dreams, granting what they crave and taking what she herself desires. Lamia is Sonoman's chief rival in the struggle for the throne of the Dark Realm, forever weaving schemes against the brother whose station she covets so fiercely."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [{ key: "education", level: 1, perks: ["secretUnravel"] }],
            artifacts: [],
            army: [
                { creatureId: "astral_familiar", count: 12 },
                { creatureId: "astral_demon", count: 10 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 3, defense: 2, spellpower: 8, knowledge: 4 },
            level: 15,
            skills: [
                { key: "education", level: 3, perks: ["secretUnravel", "magicAttraction", "scholar"] },
                { key: "sorcery", level: 2, perks: ["manaReplenish", "arcaneKnowledge"] },
                { key: "lightMagic", level: 2, perks: ["blessingGiver"] },
                { key: "luck", level: 1, perks: ["magicResist"] }
            ],
            artifacts: ["thorn_necklace", "veil_of_secrets", "mana_stone"],
            army: [
                { creatureId: "astral_familiar", count: 120 },
                { creatureId: "astral_shade", count: 80 },
                { creatureId: "astral_devourer", count: 55 },
                { creatureId: "astral_megaera", count: 40 },
                { creatureId: "astral_amalgam", count: 22 },
                { creatureId: "astral_spawn", count: 8 },
                { creatureId: "astral_leviathan", count: 4 }
            ],
            warMachines: ["catapult", "ballista", "ammoCart"],
            captain: null,
            spells: []
        }
    },

    Azazel: {
        id: "Azazel",
        names: { ru: "Азазель", en: "Azazel" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Azazel.png",
        battleSprite: "assets/images/sprites/heroes/astral/Azazel_battle.png",
        specializationId: "chaos_commander",
        biography: {
            ru: "Азазель, второй демонический лорд Астрала, есть живое воплощение гнева и войны. Кровавый Король — пожалуй, самый прямодушный из демонов, и потому самый часто используемый. Неутолимая жажда битвы делает его могучим орудием, но и лёгкой добычей для манипуляций: старшие братья не раз направляли его ярость на собственные цели. Несмотря на колоссальную силу и свирепость, простота и некоторая недальновидность Азазеля уберегли его от когтей Оверлорда — ибо тот не видел в нём истинного соперника.",
            en: "Azazel, second demonic lord of the Astral, is wrath and war made flesh. The Blood King is perhaps the most straightforward of all demons, and for that reason the most readily exploited. His unquenchable thirst for battle makes him a fearsome weapon, yet also an easy mark for manipulation; his elder brethren have often steered his fury toward their own ends. In spite of his colossal might, Azazel's simple nature and want of guile shielded him from the Overlord's claws — for he was never seen as a true rival."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [
                { key: "attack", level: 1, perks: [] },
                { key: "chaosMagic", level: 1, perks: [] }
            ],
            artifacts: [],
            army: [
                { creatureId: "astral_imp", count: 8 },
                { creatureId: "astral_demon", count: 14 },
                { creatureId: "astral_legion", count: 4 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 6, defense: 3, spellpower: 5, knowledge: 2 },
            level: 15,
            skills: [
                { key: "attack", level: 3, perks: ["tactics", "battleFury", "hasteSpell"] },
                { key: "chaosMagic", level: 3, perks: ["fireLord", "secretsOfChaos"] },
                { key: "leadership", level: 2, perks: ["diplomacy", "troopGather"] },
                { key: "defense", level: 1, perks: ["resilience"] }
            ],
            artifacts: ["blade_of_abyss", "commander_helm", "fire_amulet"],
            army: [
                { creatureId: "astral_imp", count: 60 },
                { creatureId: "astral_demon", count: 90 },
                { creatureId: "astral_legion", count: 55 },
                { creatureId: "astral_megaera", count: 30 },
                { creatureId: "astral_amalgam", count: 15 },
                { creatureId: "astral_spawn", count: 8 },
                { creatureId: "astral_leviathan", count: 4 }
            ],
            warMachines: ["catapult", "ballista"],
            captain: null,
            spells: []
        }
    },

    Mammon: {
        id: "Mammon",
        names: { ru: "Маммон", en: "Mammon" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Mammon.png",
        battleSprite: "assets/images/sprites/heroes/astral/Mammon_battle.png",
        specializationId: "dark_treasurer",
        biography: {
            ru: "Маммон, Тёмный Казначей и Князь Жадности, занимает место четвёртого демонического лорда Астрала. Он питается алчностью смертных, собирая в своих подземных чертогах горы золота, артефактов и диковин — зачастую тех, что ему вовсе без надобности. Являясь в облике исполинской многоножки, он оплетает сокровища кольцами сегментированного тела, словно стремясь врасти в них навеки. Маммон также исполняет роль хранителя демонических контрактов, властвуя над сделками, что заключают его собратья — и никто не посмеет нарушить договор, зная, что Казначей этого не забудет.",
            en: "Mammon, the Dark Treasurer and Prince of Greed, holds the seat of the fourth demonic lord of the Astral. He feeds upon the covetousness of mortals, amassing mountains of gold, relics, and curiosities within his subterranean vaults — things he often has no real use for. Manifesting as a colossal centipede, he coils his segmented body around his treasures as though yearning to fuse with them for eternity. Mammon also serves as the keeper of demonic contracts, holding sway over every bargain struck by his kind — and none dare break an accord, knowing the Treasurer does not forget."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [{ key: "leadership", level: 1, perks: [] }],
            artifacts: [],
            army: [
                { creatureId: "astral_imp", count: 18 },
                { creatureId: "astral_demon", count: 7 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 4, defense: 3, spellpower: 6, knowledge: 3 },
            level: 15,
            skills: [
                { key: "leadership", level: 3, perks: ["diplomacy", "treasury", "troopGather", "speedAura"] },
                { key: "luck", level: 2, perks: ["luckOnRoad", "trophies"] },
                { key: "defense", level: 2, perks: ["resilience", "stoneSkin"] },
                { key: "logistics", level: 1, perks: ["pathfinding"] }
            ],
            artifacts: ["endless_gold", "merchant_ring", "lucky_coin"],
            army: [
                { creatureId: "astral_imp", count: 150 },
                { creatureId: "astral_demon", count: 100 },
                { creatureId: "astral_familiar", count: 80 },
                { creatureId: "astral_megaera", count: 25 },
                { creatureId: "astral_amalgam", count: 12 },
                { creatureId: "astral_spawn", count: 5 },
                { creatureId: "astral_leviathan", count: 2 }
            ],
            warMachines: ["catapult", "ammoCart"],
            captain: null,
            spells: []
        }
    },

    Vestas: {
        id: "Vestas",
        names: { ru: "Вестас", en: "Vestas" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Vestas.png",
        battleSprite: "assets/images/sprites/heroes/astral/Vestas_battle.png",
        specializationId: "machine_spirit",
        biography: {
            ru: "Вестас, один из могущественнейших демонических принцев, воплощает одержимость смертных технологиями и прогрессом. Среди демонов Астрала он стоит особняком: его полная сила начала раскрываться лишь недавно, когда Тёмный Инженер пережил «плен» — хотя вернее назвать это гостеприимством — у безумных мастеров Кузни, чьё общество пришлось ему неожиданно по нраву. Нетипичный для своего рода, Вестас не стремится к трону или интригам; его помыслы заняты лишь грохотом механизмов и жаром кузнечного горна.",
            en: "Vestas, among the mightiest of the demonic princes, embodies the obsession of mortals with technology and progress. He stands apart from his Astral kin: his full power has only recently begun to unfold, after the Dark Engineer endured 'captivity' — though 'hospitality' may be the truer word — among the mad inventors of the Forge, whose company he found unexpectedly agreeable. Untypical of his kind, Vestas harbours no designs upon the throne; his mind is given wholly to the roar of engines and the glow of the smithy's fire."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [{ key: "warMachines", level: 1, perks: ["ballista"] }],
            artifacts: [],
            army: [
                { creatureId: "astral_imp", count: 14 },
                { creatureId: "astral_demon", count: 8 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 5, defense: 2, spellpower: 5, knowledge: 4 },
            level: 15,
            skills: [
                { key: "warMachines", level: 3, perks: ["catapult", "ballista", "firstAid", "wallBreaker", "rapidBallista"] },
                { key: "attack", level: 2, perks: ["tactics", "shooting"] },
                { key: "logistics", level: 2, perks: ["scouting", "pathfinding"] },
                { key: "sorcery", level: 1, perks: ["manaReplenish"] }
            ],
            artifacts: ["engineer_goggles", "reinforced_armor", "gear_oil"],
            army: [
                { creatureId: "astral_familiar", count: 110 },
                { creatureId: "astral_shade", count: 75 },
                { creatureId: "astral_devourer", count: 50 },
                { creatureId: "astral_megaera", count: 35 },
                { creatureId: "astral_amalgam", count: 20 },
                { creatureId: "astral_spawn", count: 10 },
                { creatureId: "astral_leviathan", count: 3 }
            ],
            warMachines: ["catapult", "ballista", "ammoCart", "firstAidTent"],
            captain: null,
            spells: []
        }
    },

    Vekna: {
        id: "Vekna",
        names: { ru: "Векна", en: "Vekna" },
        faction: "astral",
        heroClass: "shadowlord",
        portrait: "assets/images/portraits/heroes/astral/Vekna.png",
        battleSprite: "assets/images/sprites/heroes/astral/Vekna_battle.png",
        specializationId: "illusionist",
        biography: {
            ru: "Векна, демонический принц иллюзий и обмана, плетёт паутины интриг, оставаясь незримым для большинства. Он является в облике Паука, и тело его несёт на себе отметины давней гибели — ибо сам принц мёртв уже многие столетия. В эпоху Раздора Векна был ближайшим братом Сономана, преданно помогая тому в Великой игре. По горькой иронии судьбы принц обмана был обманут и пал в цепи событий Семи Судных дней, и лишь малая часть его сущности уцелела — оставленная Оверлордом как память о былом братстве. И поныне Векна остаётся приближённым Астрального Владыки, и, быть может, единственным, кому тот способен доверять — пусть от прежнего принца и сохранилось лишь эхо былого могущества.",
            en: "Vekna, the demonic prince of illusions and deceit, spins webs of intrigue from the shadows, unseen by most. He manifests as a Spider, his form scarred by the marks of an ancient death — for the prince himself has lain dead for centuries. In the Age of Discord, Vekna was Sonoman's closest brother, faithfully aiding him in the Grand Game. By bitter irony, the prince of deceit was himself deceived and fell in the chain of events known as the Seven Days of Judgement; only a shard of his essence survived, kept by the Overlord as a keepsake of lost brotherhood. Even now, Vekna remains at the Astral Sovereign's side — perhaps the sole being in whom he still places his trust, though what remains of the prince is but an echo of his former power."
        },
        base: {
            stats: { attack: 1, defense: 0, spellpower: 1, knowledge: 0 },
            level: 1, exp: 0,
            skills: [
                { key: "darkMagic", level: 1, perks: [] },
                { key: "summonMagic", level: 1, perks: [] }
            ],
            artifacts: [],
            army: [
                { creatureId: "astral_imp", count: 6 },
                { creatureId: "astral_demon", count: 10 }
            ],
            warMachines: ["catapult"],
            captain: null,
            spells: []
        },
        duel: {
            stats: { attack: 3, defense: 2, spellpower: 8, knowledge: 5 },
            level: 15,
            skills: [
                { key: "darkMagic", level: 3, perks: ["mindLord", "painLord", "sealOfDarkness"] },
                { key: "summonMagic", level: 3, perks: ["lifeLord", "charmLord", "elementalBalance"] },
                { key: "sorcery", level: 2, perks: ["manaReplenish", "arcaneKnowledge"] },
                { key: "education", level: 1, perks: ["secretUnravel"] }
            ],
            artifacts: ["stuff_of_shadows", "mantle_of_dreams", "illusionist_prism"],
            army: [
                { creatureId: "astral_familiar", count: 130 },
                { creatureId: "astral_shade", count: 65 },
                { creatureId: "astral_devourer", count: 40 },
                { creatureId: "astral_megaera", count: 35 },
                { creatureId: "astral_amalgam", count: 25 },
                { creatureId: "astral_spawn", count: 12 },
                { creatureId: "astral_leviathan", count: 3 }
            ],
            warMachines: ["catapult", "firstAidTent"],
            captain: null,
            spells: []
        }
    }
};

export default HEROES_ASTRAL;
