import type { Player } from '@/models/player';

type ExtPlayer = Player & { destaque?: boolean; peso?: boolean };

function isDestaque(p: Player): boolean {
    return (p as unknown as ExtPlayer).destaque === true;
}

function isPeso(p: Player): boolean {
    return (p as unknown as ExtPlayer).peso === true;
}

function shuffleArray<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function distributePlayersToTeams(
    players: Player[],
    teamNames: string[],
): Record<string, Player[]> {
    const alloc: Record<string, Player[]> = {};
    teamNames.forEach((n) => (alloc[n] = []));

    const highlights = shuffleArray(players.filter((p) => isDestaque(p)));
    const heavies = shuffleArray(players.filter((p) => isPeso(p)));
    const assigned = new Set<string>();

    // Distribui destaques (um por time, round-robin)
    let ti = 0;
    for (const p of highlights) {
        const tname = teamNames[ti % teamNames.length];
        alloc[tname].push(p);
        assigned.add(String(p.id));
        ti++;
    }

    // Distribui pesados (sem duplicar se já destacado)
    for (const p of heavies) {
        if (assigned.has(String(p.id))) continue;
        const tname = teamNames[ti % teamNames.length];
        alloc[tname].push(p);
        assigned.add(String(p.id));
        ti++;
    }

    // Restante: balanceado por round-robin
    const rest = shuffleArray(players.filter((p) => !assigned.has(String(p.id))));
    for (const p of rest) {
        const tname = teamNames[ti % teamNames.length];
        alloc[tname].push(p);
        ti++;
    }

    return alloc;
}
