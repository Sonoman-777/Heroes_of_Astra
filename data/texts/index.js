import ru from './ru.js';
import en from './en.js';

const texts = { ru, en };

let currentLang = 'ru';

export function setLanguage(lang) {
    if (texts[lang]) {
        currentLang = lang;
    }
}

export function getText(key) {
    return texts[currentLang][key] || key;
}

export function getCurrentLanguage() {
    return currentLang;
}

// Для удобства — прямой доступ к объекту текстов
export function getTexts() {
    return texts[currentLang];
}
