export const playerBadgeClasses = {
    destaque:
        'inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800',
    peso: 'inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800',
};

export const playerBackgroundClasses = {
    destaque: 'bg-green-300',
    peso: 'bg-red-300',
};

export function getPlayerBackgroundClass({
    destaque,
    peso,
    ativo = true,
    baseWhenNeutral,
}: {
    destaque?: boolean;
    peso?: boolean;
    ativo?: boolean;
    baseWhenNeutral?: string;
}): string {
    const tone = destaque
        ? playerBackgroundClasses.destaque
        : peso
        ? playerBackgroundClasses.peso
        : baseWhenNeutral;

    const state = ativo ? '' : 'opacity-50';

    return [tone, state].filter(Boolean).join(' ').trim();
}
