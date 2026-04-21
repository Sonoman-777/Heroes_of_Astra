// ============================================================================
//  ГЛОБАЛЬНОЕ СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ============================================================================

// Текущий выбранный герой
let currentHero = null;

// Сохранённые герои (прогресс)
let savedHeroes = {};

// Текущая битва
let currentBattle = null;

// Выбранный для размещения отряд в фазе подготовки
let windowSelectedStackForPlacement = null;

// Таймаут для ресайза окна битвы
let resizeTimeout = null;

// Экспорт для использования в других модулях
export {
    currentHero,
    savedHeroes,
    currentBattle,
    windowSelectedStackForPlacement,
    resizeTimeout
};

// Функции для обновления состояния (будут использоваться в других модулях)
export function setCurrentHero(hero) {
    currentHero = hero;
}

export function setSavedHeroes(heroes) {
    savedHeroes = heroes;
}

export function setCurrentBattle(battle) {
    currentBattle = battle;
}

export function setWindowSelectedStackForPlacement(stack) {
    windowSelectedStackForPlacement = stack;
}

export function setResizeTimeout(timeout) {
    resizeTimeout = timeout;
}
