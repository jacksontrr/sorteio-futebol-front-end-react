import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface TeamConfigPanelProps {
    teamCount: number;
    teamNames: string[];
    onTeamCountChange: (count: number) => void;
    onTeamNameChange: (index: number, name: string) => void;
    onGenerate: () => void;
    disabled?: boolean;
}

export function TeamConfigPanel({
    teamCount,
    teamNames,
    onTeamCountChange,
    onTeamNameChange,
    onGenerate,
    disabled = false,
}: TeamConfigPanelProps) {
    return (
        <div className="p-2">
            <div className="mb-2 font-semibold">Times</div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                <span className="text-sm">Quantidade de times:</span>
                <Input
                    type="number"
                    className="w-28"
                    value={String(teamCount)}
                    onChange={(e) => onTeamCountChange(Number(e.target.value))}
                />
                <Button onClick={onGenerate} disabled={disabled}>
                    Gerar Sorteio
                </Button>
            </div>
            {teamCount > 0 && (
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                    {teamNames.map((name, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <span className="text-sm w-20">Time {i + 1}:</span>
                            <Input
                                value={name}
                                onChange={(e) => onTeamNameChange(i, e.target.value)}
                                placeholder={`Time ${i + 1}`}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
