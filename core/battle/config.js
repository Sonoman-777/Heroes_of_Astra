// ============================================================================
//  КОНФИГУРАЦИЯ ПОЗИЦИЙ ДЛЯ РАСШИРЕННОГО ПОЛЯ 16×14
// ============================================================================

export const BATTLEFIELD_CONFIG = {
    totalWidth: 16,
    totalHeight: 14,
    
    playableZone: {
        startX: 2,
        endX: 13,
        startY: 2,
        endY: 11
    },
    
    attacker: {
        hero: { x: 0, y: 0, width: 2, height: 2 },
        ballista: { x: 0, y: 2, width: 2, height: 2 },
        firstAidTent: { x: 0, y: 6, width: 2, height: 2 },
        ammoCart: { x: 0, y: 10, width: 2, height: 2 }
    },
    
    defender: {
        hero: { x: 14, y: 0, width: 2, height: 2 },
        ballista: { x: 14, y: 2, width: 2, height: 2 },
        firstAidTent: { x: 14, y: 6, width: 2, height: 2 },
        ammoCart: { x: 14, y: 10, width: 2, height: 2 }
    }
};
