export function buildRoundsFromInitial(teamIds: string[]): string[][][] {
    const initial = [...teamIds];
    const rounds: string[][][] = [];
    const firstRound: string[][] = [];
    for (let i = 0; i < initial.length; i += 2) {
        firstRound.push([initial[i] ?? '', initial[i + 1] ?? '']);
    }
    rounds.push(firstRound);

    let prevCount = firstRound.length;
    while (prevCount > 1) {
        const nextRound: string[][] = new Array(Math.ceil(prevCount / 2)).fill(0).map(() => ['', '']);
        rounds.push(nextRound);
        prevCount = nextRound.length;
    }

    // auto-advance byes: when a pair has only one team, move it to next round
    for (let r = 0; r < rounds.length - 1; r++) {
        const round = rounds[r];
        const next = rounds[r + 1];
        for (let i = 0; i < round.length; i++) {
            const [a, b] = round[i];
            if (a && !b) {
                const targetIdx = Math.floor(i / 2);
                const pos = i % 2 === 0 ? 0 : 1;
                if (!next[targetIdx]) next[targetIdx] = ['', ''];
                if (!next[targetIdx][pos]) next[targetIdx][pos] = a;
            } else if (!a && b) {
                const targetIdx = Math.floor(i / 2);
                const pos = i % 2 === 0 ? 0 : 1;
                if (!next[targetIdx]) next[targetIdx] = ['', ''];
                if (!next[targetIdx][pos]) next[targetIdx][pos] = b;
            }
        }
    }

    return rounds;
}

export function advanceWinner(
    rounds: string[][][],
    roundIdx: number,
    matchIdx: number,
    winnerId: string,
): string[][][] {
    const newRounds = rounds.map((r) => r.map((p) => [p[0], p[1]]));
    const nextRoundIdx = roundIdx + 1;

    if (nextRoundIdx >= newRounds.length) {
        return newRounds;
    }

    const targetPairIndex = Math.floor(matchIdx / 2);
    const pos = matchIdx % 2 === 0 ? 0 : 1;

    if (!newRounds[nextRoundIdx]) newRounds[nextRoundIdx] = [];
    if (!newRounds[nextRoundIdx][targetPairIndex])
        newRounds[nextRoundIdx][targetPairIndex] = ['', ''];
    newRounds[nextRoundIdx][targetPairIndex][pos] = winnerId;

    const filledInNext = newRounds[nextRoundIdx].flat().filter((x) => x && x.trim()).length;
    const matchesInThisRound = newRounds[roundIdx].length;

    if (filledInNext >= matchesInThisRound) {
        const winners = newRounds[nextRoundIdx].flat().filter((x) => x && x.trim());

        if (winners.length % 2 === 1 && nextRoundIdx + 1 < newRounds.length) {
            const winnerToAdvance = winners.shift() as string;

            const newNext: string[][] = [];
            for (let i = 0; i < winners.length; i += 2) {
                newNext.push([winners[i] ?? '', winners[i + 1] ?? '']);
            }
            newRounds[nextRoundIdx] = newNext;

            const targetRound = newRounds[nextRoundIdx + 1];
            if (!targetRound[0]) targetRound[0] = ['', ''];
            if (!targetRound[0][0]) targetRound[0][0] = winnerToAdvance;
            else if (!targetRound[0][1]) targetRound[0][1] = winnerToAdvance;
            else {
                let placed = false;
                for (let i = 0; i < targetRound.length && !placed; i++) {
                    if (!targetRound[i][0]) {
                        targetRound[i][0] = winnerToAdvance;
                        placed = true;
                    } else if (!targetRound[i][1]) {
                        targetRound[i][1] = winnerToAdvance;
                        placed = true;
                    }
                }
                if (!placed) targetRound.push([winnerToAdvance, '']);
            }
        }
    }

    return newRounds;
}
