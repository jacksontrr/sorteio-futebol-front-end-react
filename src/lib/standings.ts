export type MatchRow = { home: string; away: string; homeGoals: number; awayGoals: number };
export type StandingRow = {
    id: string;
    jogos: number;
    v: number;
    e: number;
    d: number;
    gm: number;
    gc: number;
};

export function computeStandings(timeIds: string[], allMatches: MatchRow[]): StandingRow[] {
    const table: StandingRow[] = timeIds.map((id) => ({
        id,
        jogos: 0,
        v: 0,
        e: 0,
        d: 0,
        gm: 0,
        gc: 0,
    }));

    const map = new Map<string, StandingRow>(table.map((t) => [t.id, t]));

    for (const m of allMatches) {
        const home = map.get(m.home);
        const away = map.get(m.away);
        if (!home || !away) continue;

        home.jogos += 1;
        away.jogos += 1;

        home.gm += m.homeGoals;
        home.gc += m.awayGoals;

        away.gm += m.awayGoals;
        away.gc += m.homeGoals;

        if (m.homeGoals > m.awayGoals) {
            home.v += 1;
            away.d += 1;
        } else if (m.homeGoals < m.awayGoals) {
            away.v += 1;
            home.d += 1;
        } else {
            home.e += 1;
            away.e += 1;
        }
    }

    return table.sort((a, b) => {
        const pontosA = a.v * 3 + a.e;
        const pontosB = b.v * 3 + b.e;
        if (pontosB !== pontosA) return pontosB - pontosA;
        const sgA = a.gm - a.gc;
        const sgB = b.gm - b.gc;
        if (sgB !== sgA) return sgB - sgA;
        return b.gm - a.gm;
    });
}
