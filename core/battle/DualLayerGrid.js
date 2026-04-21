// ============================================================================
//  МОДУЛЬ 7: ДВУХСЛОЙНАЯ СЕТКА (16×14)
// ============================================================================

import { BATTLEFIELD_CONFIG } from './config.js';

export class DualLayerGrid {
    constructor(battle) {
        this.battle = battle;
        this.bottom = Array(16).fill().map(() => Array(14).fill(null));
        this.top = Array(11).fill().map(() => Array(9).fill(null));
        this.topOffsetX = 2;
        this.topOffsetY = 2;
    }
    
    synchronize() {
        for (let x = 0; x < 16; x++) {
            for (let y = 0; y < 14; y++) {
                this.bottom[x][y] = null;
            }
        }
        for (let x = 0; x < 11; x++) {
            for (let y = 0; y < 9; y++) {
                this.top[x][y] = null;
            }
        }
        
        if (this.battle.attackerWarMachines) {
            for (let machine of this.battle.attackerWarMachines) {
                if (!machine.isAlive) continue;
                const cells = machine.getOccupiedCells();
                for (let cell of cells) {
                    if (cell.x >= 0 && cell.x < 16 && cell.y >= 0 && cell.y < 14) {
                        this.bottom[cell.x][cell.y] = machine;
                    }
                }
            }
        }
        if (this.battle.defenderWarMachines) {
            for (let machine of this.battle.defenderWarMachines) {
                if (!machine.isAlive) continue;
                const cells = machine.getOccupiedCells();
                for (let cell of cells) {
                    if (cell.x >= 0 && cell.x < 16 && cell.y >= 0 && cell.y < 14) {
                        this.bottom[cell.x][cell.y] = machine;
                    }
                }
            }
        }
        
        const allStacks = [...this.battle.attackerStacks, ...this.battle.defenderStacks];
        for (let stack of allStacks) {
            if (!stack.isAlive()) continue;
            if (stack.isLarge()) {
                const topX = stack.gridX, topY = stack.gridY;
                if (topX >= 0 && topX < 11 && topY >= 0 && topY < 9) {
                    this.top[topX][topY] = stack;
                    const bottomCells = this.getBottomCellsFromTop(topX, topY);
                    for (let cell of bottomCells) {
                        if (cell.x >= 0 && cell.x < 16 && cell.y >= 0 && cell.y < 14) {
                            this.bottom[cell.x][cell.y] = stack;
                        }
                    }
                    stack.bottomX = topX + this.topOffsetX;
                    stack.bottomY = topY + this.topOffsetY;
                    stack.x = stack.bottomX;
                    stack.y = stack.bottomY;
                }
            } else {
                const bottomX = stack.bottomX, bottomY = stack.bottomY;
                if (bottomX >= 0 && bottomX < 16 && bottomY >= 0 && bottomY < 14) {
                    this.bottom[bottomX][bottomY] = stack;
                    if (bottomX >= this.topOffsetX && bottomX < this.topOffsetX + 12 && 
                        bottomY >= this.topOffsetY && bottomY < this.topOffsetY + 10) {
                        const topX = bottomX - this.topOffsetX, topY = bottomY - this.topOffsetY;
                        const topCells = this.getTopCellsFromBottom(topX, topY);
                        for (let cell of topCells) {
                            if (cell.x >= 0 && cell.x < 11 && cell.y >= 0 && cell.y < 9) {
                                this.top[cell.x][cell.y] = stack;
                            }
                        }
                    }
                    stack.gridX = bottomX - this.topOffsetX;
                    stack.gridY = bottomY - this.topOffsetY;
                    stack.x = bottomX;
                    stack.y = bottomY;
                }
            }
        }
    }
    
    getBottomCellsFromTop(topX, topY) {
        const bottomX = topX + this.topOffsetX, bottomY = topY + this.topOffsetY;
        return [
            { x: bottomX, y: bottomY }, 
            { x: bottomX + 1, y: bottomY }, 
            { x: bottomX, y: bottomY + 1 }, 
            { x: bottomX + 1, y: bottomY + 1 }
        ];
    }
    
    getTopCellsFromBottom(bottomX, bottomY) {
        const cells = [];
        const topX = bottomX - this.topOffsetX, topY = bottomY - this.topOffsetY;
        for (let dx = -1; dx <= 0; dx++) {
            for (let dy = -1; dy <= 0; dy++) {
                const tx = topX + dx, ty = topY + dy;
                if (tx >= 0 && tx < 11 && ty >= 0 && ty < 9) {
                    cells.push({ x: tx, y: ty });
                }
            }
        }
        return cells;
    }
    
    isInPlayableZone(bottomX, bottomY) {
        return bottomX >= this.topOffsetX && bottomX < this.topOffsetX + 12 && 
               bottomY >= this.topOffsetY && bottomY < this.topOffsetY + 10;
    }
    
    canPlaceLarge(topX, topY, excludeStack = null) {
        if (topX < 0 || topX >= 11 || topY < 0 || topY >= 9) return false;
        const topOccupant = this.top[topX][topY];
        if (topOccupant && topOccupant !== excludeStack) return false;
        const bottomCells = this.getBottomCellsFromTop(topX, topY);
        for (let cell of bottomCells) {
            if (cell.x < 0 || cell.x >= 16 || cell.y < 0 || cell.y >= 14) return false;
            if (!this.isInPlayableZone(cell.x, cell.y)) return false;
            const bottomOccupant = this.bottom[cell.x][cell.y];
            if (bottomOccupant && bottomOccupant !== excludeStack) return false;
        }
        return true;
    }
    
    canPlaceNormal(bottomX, bottomY, excludeStack = null) {
        if (!this.isInPlayableZone(bottomX, bottomY)) return false;
        const bottomOccupant = this.bottom[bottomX][bottomY];
        if (bottomOccupant && bottomOccupant !== excludeStack) return false;
        return true;
    }
    
    getAttackPositions(attacker, target) {
        const positions = [];
        if (attacker.isLarge()) {
            const availableMoves = this.getAvailableMovesForLarge(attacker);
            for (let move of availableMoves) {
                const moveBottomCells = this.getBottomCellsFromTop(move.x, move.y);
                const targetCells = target.getOccupiedCells();
                for (let moveCell of moveBottomCells) {
                    for (let targetCell of targetCells) {
                        if (Math.abs(moveCell.x - targetCell.x) <= 1 && Math.abs(moveCell.y - targetCell.y) <= 1) {
                            if (!positions.some(p => p.x === move.x && p.y === move.y)) {
                                positions.push({ x: move.x, y: move.y });
                            }
                        }
                    }
                }
            }
        } else {
            const availableMoves = this.getAvailableMovesForNormal(attacker);
            const targetCells = target.getOccupiedCells();
            for (let move of availableMoves) {
                for (let targetCell of targetCells) {
                    if (Math.abs(move.x - targetCell.x) <= 1 && Math.abs(move.y - targetCell.y) <= 1) {
                        if (!positions.some(p => p.x === move.x && p.y === move.y)) {
                            positions.push({ x: move.x, y: move.y });
                        }
                    }
                }
            }
        }
        return positions;
    }
    
    getAvailableMovesForLarge(stack) {
        if (stack.hasMoved) return [];
        const speed = stack.creature.speed;
        const startX = stack.gridX, startY = stack.gridY;
        const available = [];
        const queue = [{ x: startX, y: startY, cost: 0 }];
        const visited = new Set();
        visited.add(`${startX},${startY}`);
        
        while (queue.length > 0) {
            const cur = queue.shift();
            if (cur.cost > 0 && cur.cost <= speed) {
                available.push({ x: cur.x, y: cur.y });
            }
            if (cur.cost >= speed) continue;
            
            const dirs = [
                { dx: 0, dy: -1 }, { dx: 0, dy: 1 }, 
                { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
            ];
            
            for (let d of dirs) {
                const nx = cur.x + d.dx, ny = cur.y + d.dy, key = `${nx},${ny}`;
                if (visited.has(key)) continue;
                if (nx < 0 || nx >= 11 || ny < 0 || ny >= 9) continue;
                
                const bottomCells = this.getBottomCellsFromTop(nx, ny);
                let canStand = true;
                
                for (let cell of bottomCells) {
                    if (cell.x < 0 || cell.x >= 16 || cell.y < 0 || cell.y >= 14) { 
                        canStand = false; 
                        break; 
                    }
                    if (!this.isInPlayableZone(cell.x, cell.y)) { 
                        canStand = false; 
                        break; 
                    }
                    if (!stack.isFlying) {
                        for (let s of [...this.battle.attackerStacks, ...this.battle.defenderStacks]) {
                            if (s === stack || !s.isAlive()) continue;
                            if (s.isLarge()) {
                                const sBottom = this.getBottomCellsFromTop(s.gridX, s.gridY);
                                if (sBottom.some(sc => sc.x === cell.x && sc.y === cell.y)) { 
                                    canStand = false; 
                                    break; 
                                }
                            } else if (s.bottomX === cell.x && s.bottomY === cell.y) { 
                                canStand = false; 
                                break; 
                            }
                        }
                    }
                    if (!canStand) break;
                }
                
                if (!stack.isFlying && d.dx !== 0 && d.dy !== 0) {
                    const corner1X = cur.x + d.dx, corner1Y = cur.y;
                    const corner2X = cur.x, corner2Y = cur.y + d.dy;
                    const corner1Bottom = this.getBottomCellsFromTop(corner1X, corner1Y);
                    const corner2Bottom = this.getBottomCellsFromTop(corner2X, corner2Y);
                    let blocked = false;
                    
                    for (let s of [...this.battle.attackerStacks, ...this.battle.defenderStacks]) {
                        if (s === stack || !s.isAlive()) continue;
                        if (s.isLarge()) {
                            const sBottom = this.getBottomCellsFromTop(s.gridX, s.gridY);
                            if (corner1Bottom.some(cb => sBottom.some(sb => sb.x === cb.x && sb.y === cb.y)) || 
                                corner2Bottom.some(cb => sBottom.some(sb => sb.x === cb.x && sb.y === cb.y))) { 
                                blocked = true; 
                                break; 
                            }
                        } else {
                            if (corner1Bottom.some(cb => cb.x === s.bottomX && cb.y === s.bottomY) || 
                                corner2Bottom.some(cb => cb.x === s.bottomX && cb.y === s.bottomY)) { 
                                blocked = true; 
                                break; 
                            }
                        }
                    }
                    if (blocked) continue;
                }
                
                if (canStand) { 
                    visited.add(key); 
                    queue.push({ x: nx, y: ny, cost: cur.cost + 1 }); 
                }
            }
        }
        return available;
    }
    
    getAvailableMovesForNormal(stack) {
        if (stack.hasMoved) return [];
        const speed = stack.creature.speed;
        const startX = stack.bottomX, startY = stack.bottomY;
        const available = [];
        const queue = [{ x: startX, y: startY, cost: 0 }];
        const visited = new Set();
        visited.add(`${startX},${startY}`);
        
        while (queue.length > 0) {
            const cur = queue.shift();
            if (cur.cost > 0 && cur.cost <= speed) {
                available.push({ x: cur.x, y: cur.y });
            }
            if (cur.cost >= speed) continue;
            
            const dirs = [
                { dx: 0, dy: -1, cost: 1 }, { dx: 0, dy: 1, cost: 1 }, 
                { dx: -1, dy: 0, cost: 1 }, { dx: 1, dy: 0, cost: 1 },
                { dx: -1, dy: -1, cost: 1.5 }, { dx: 1, dy: -1, cost: 1.5 }, 
                { dx: -1, dy: 1, cost: 1.5 }, { dx: 1, dy: 1, cost: 1.5 }
            ];
            
            for (let d of dirs) {
                const nx = cur.x + d.dx, ny = cur.y + d.dy, key = `${nx},${ny}`;
                if (visited.has(key)) continue;
                if (!this.isInPlayableZone(nx, ny)) continue;
                
                if (!stack.isFlying) {
                    let occupied = false;
                    for (let s of [...this.battle.attackerStacks, ...this.battle.defenderStacks]) {
                        if (s === stack || !s.isAlive()) continue;
                        if (s.occupiesCell(nx, ny)) { occupied = true; break; }
                    }
                    if (!occupied) {
                        for (let m of [...(this.battle.attackerWarMachines || []), ...(this.battle.defenderWarMachines || [])]) {
                            if (m.isAlive && m.occupiesCell(nx, ny)) { occupied = true; break; }
                        }
                    }
                    if (occupied) continue;
                }
                
                const newCost = cur.cost + d.cost;
                if (newCost <= speed) { 
                    visited.add(key); 
                    queue.push({ x: nx, y: ny, cost: newCost }); 
                }
            }
        }
        return available;
    }
    
    moveStack(stack, newX, newY) {
        const oldGridX = stack.gridX, oldGridY = stack.gridY;
        const oldBottomX = stack.bottomX, oldBottomY = stack.bottomY;
        
        if (stack.isLarge()) { 
            stack.gridX = newX; 
            stack.gridY = newY; 
        } else { 
            stack.bottomX = newX; 
            stack.bottomY = newY; 
        }
        
        const isValid = stack.isLarge() ? 
            this.canPlaceLarge(stack.gridX, stack.gridY, stack) : 
            this.canPlaceNormal(stack.bottomX, stack.bottomY, stack);
            
        if (!isValid) { 
            stack.gridX = oldGridX; 
            stack.gridY = oldGridY; 
            stack.bottomX = oldBottomX; 
            stack.bottomY = oldBottomY; 
            return false; 
        }
        
        stack.hasMoved = true;
        return true;
    }
    
    isInAttackRange(attacker, target) {
        const attackerCells = attacker.getOccupiedCells();
        const targetCells = target.getOccupiedCells();
        for (let ac of attackerCells) {
            for (let tc of targetCells) {
                if (Math.abs(ac.x - tc.x) <= 1 && Math.abs(ac.y - tc.y) <= 1) {
                    return true;
                }
            }
        }
        return false;
    }
    
    getTargetsInPlayableZone(side) {
        const targets = [];
        const stacks = side === 'attacker' ? this.battle.defenderStacks : this.battle.attackerStacks;
        for (let stack of stacks) {
            if (stack.isAlive() && this.isInPlayableZone(stack.bottomX, stack.bottomY)) {
                targets.push(stack);
            }
        }
        const enemyMachines = side === 'attacker' ? this.battle.defenderWarMachines : this.battle.attackerWarMachines;
        if (enemyMachines) {
            for (let machine of enemyMachines) {
                if (machine.isAlive) {
                    targets.push(machine);
                }
            }
        }
        return targets;
    }
                    }
