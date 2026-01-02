import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import type { StandingRow } from '@/lib/standings';

export interface StandingsTableProps {
    standings: StandingRow[];
    teamNameMap?: Record<string | number, string>;
}

export function StandingsTable({ standings, teamNameMap = {} }: StandingsTableProps) {
    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pos</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>P</TableHead>
                        <TableHead>J</TableHead>
                        <TableHead>V</TableHead>
                        <TableHead>E</TableHead>
                        <TableHead>D</TableHead>
                        <TableHead>GM</TableHead>
                        <TableHead>GC</TableHead>
                        <TableHead>SG</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {standings.map((row, idx) => {
                        const pontos = row.v * 3 + row.e;
                        const saldo = row.gm - row.gc;
                        const teamName = teamNameMap[row.id] || row.id;
                        return (
                            <TableRow key={row.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{teamName}</TableCell>
                                <TableCell>{pontos}</TableCell>
                                <TableCell>{row.jogos}</TableCell>
                                <TableCell>{row.v}</TableCell>
                                <TableCell>{row.e}</TableCell>
                                <TableCell>{row.d}</TableCell>
                                <TableCell>{row.gm}</TableCell>
                                <TableCell>{row.gc}</TableCell>
                                <TableCell>{saldo}</TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
