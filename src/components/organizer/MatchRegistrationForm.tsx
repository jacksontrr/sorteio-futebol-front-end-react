import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface MatchRegistrationFormProps {
    teams: Array<{ id: string | number; nome: string }>;
    homeTeamId: string | number | null;
    awayTeamId: string | number | null;
    homeGoals: number;
    awayGoals: number;
    onHomeTeamChange: (id: string | number | null) => void;
    onAwayTeamChange: (id: string | number | null) => void;
    onHomeGoalsChange: (goals: number) => void;
    onAwayGoalsChange: (goals: number) => void;
    onSubmit: () => void;
    isLoading?: boolean;
}

export function MatchRegistrationForm({
    teams,
    homeTeamId,
    awayTeamId,
    homeGoals,
    awayGoals,
    onHomeTeamChange,
    onAwayTeamChange,
    onHomeGoalsChange,
    onAwayGoalsChange,
    onSubmit,
    isLoading = false,
}: MatchRegistrationFormProps) {
    return (
        <div className="mb-3 grid gap-2 sm:grid-cols-2 md:grid-cols-5 items-end">
            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Time da casa</span>
                <select
                    value={homeTeamId ?? ''}
                    onChange={(e) => onHomeTeamChange(e.target.value || null)}
                    className="px-2 py-1 border rounded"
                >
                    <option value="">Selecione</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id} disabled={t.id === awayTeamId}>
                            {t.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Gols casa</span>
                <Input
                    type="number"
                    min={0}
                    value={homeGoals}
                    onChange={(e) => onHomeGoalsChange(Number(e.target.value))}
                />
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Gols visitante</span>
                <Input
                    type="number"
                    min={0}
                    value={awayGoals}
                    onChange={(e) => onAwayGoalsChange(Number(e.target.value))}
                />
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-sm text-muted-foreground">Time visitante</span>
                <select
                    value={awayTeamId ?? ''}
                    onChange={(e) => onAwayTeamChange(e.target.value || null)}
                    className="px-2 py-1 border rounded"
                >
                    <option value="">Selecione</option>
                    {teams.map((t) => (
                        <option key={t.id} value={t.id} disabled={t.id === homeTeamId}>
                            {t.nome}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex">
                <Button className="w-full" onClick={onSubmit} disabled={isLoading}>
                    {isLoading ? 'Registrando...' : 'Registrar'}
                </Button>
            </div>
        </div>
    );
}
