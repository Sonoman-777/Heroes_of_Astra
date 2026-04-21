// ============================================================================
//  СВЕРХМАССИВ 6: АРТЕФАКТЫ — ОБЪЕДИНЕНИЕ ВСЕХ ТИПОВ
// ============================================================================

import { ARTIFACTS_COMMON } from './common.js';
// Импорты остальных редкостей будут добавлены по мере создания
// import { ARTIFACTS_RARE } from './rare.js';
// import { ARTIFACTS_EPIC } from './epic.js';
// import { ARTIFACTS_LEGENDARY } from './legendary.js';

// Модуль: Сильные артефакты — пустой, для расширения
const ARTIFACTS_RARE = {};

// Модуль: Великие артефакты — пустой, для расширения
const ARTIFACTS_EPIC = {};

// Модуль: Легендарные артефакты — пустой, для расширения
const ARTIFACTS_LEGENDARY = {};

// СВЕРХМАССИВ АРТЕФАКТОВ
const ARTIFACTS_DB = { 
    ...ARTIFACTS_COMMON,
    ...ARTIFACTS_RARE,
    ...ARTIFACTS_EPIC,
    ...ARTIFACTS_LEGENDARY
};

export { 
    ARTIFACTS_DB,
    ARTIFACTS_COMMON,
    ARTIFACTS_RARE,
    ARTIFACTS_EPIC,
    ARTIFACTS_LEGENDARY
};
