import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// shadcn/ui components
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// Player form UI primitives moved to shared component; imports removed to avoid duplication
import { registerJogador, registerOrganizador } from '../services/auth';
import { useSearchParams } from 'react-router-dom';
// Player preview component removed from this page to avoid unused import
import PlayerForm from '@/components/player/PlayerForm';
import type { PlayerFormData } from '@/models/player';
import type { OrganizerFormData } from '@/models/organizer';

// ────────────────────────────────────────────────────────────────────────────────
// Schemas
// ────────────────────────────────────────────────────────────────────────────────
const organizerSchema = z.object({
    nome: z.string().min(2, 'Mínimo 2 caracteres'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
});

// POSICOES moved to PlayerForm component

// Player schema moved to shared `PlayerForm` component; using its types instead of duplicating schema

// ────────────────────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────────────────────
// use centralized models
// OrganizerFormData and PlayerFormData imported from models

// ────────────────────────────────────────────────────────────────────────────────
// Helper components
// ────────────────────────────────────────────────────────────────────────────────
function ErrorText({ message }: { message?: string }) {
    if (!message) return null;
    return <p className="text-sm text-red-600 mt-1">{message}</p>;
}

function Field({
    label,
    children,
    htmlFor,
}: {
    label: string;
    children: React.ReactNode;
    htmlFor?: string;
}) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={htmlFor}>{label}</Label>
            {children}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────────────────────
// Organizer form
// ────────────────────────────────────────────────────────────────────────────────
function OrganizerForm({
    onSubmit,
}: {
    onSubmit: (data: OrganizerFormData, reset: () => void) => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<OrganizerFormData>({
        resolver: zodResolver(organizerSchema),
        defaultValues: { nome: '', email: '', password: '' },
    });

    return (
        <form
            id="organizer-form"
            onSubmit={handleSubmit((data) => {
                onSubmit(data, reset);
            })}
            className="grid gap-4"
        >
            <Field label="Nome" htmlFor="nome-org">
                <Input id="nome-org" placeholder="Seu nome" {...register('nome')} />
                <ErrorText message={errors.nome?.message} />
            </Field>

            <Field label="E-mail" htmlFor="email-org">
                <Input
                    id="email-org"
                    type="email"
                    placeholder="voce@email.com"
                    {...register('email')}
                />
                <ErrorText message={errors.email?.message} />
            </Field>

            <Field label="Senha" htmlFor="password-org">
                <Input
                    id="password-org"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                />
                <ErrorText message={errors.password?.message} />
            </Field>
            {/* <div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    Cadastrar como Organizador
                </Button>
            </div> */}
        </form>
    );
}

export default function RegisterPage() {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const token = (location.state as { token?: string } | null)?.token ?? searchParams.get('token');
    const [role, setRole] = React.useState<'organizador' | 'jogador'>(
        token ? 'jogador' : 'organizador',
    );
    // preview state removed (not used on this page)
    const [organizerCode, setOrganizerCode] = React.useState<string | null>(null);
    const [loadingOrg, setLoadingOrg] = React.useState(false);
    const [loadingPlayer, setLoadingPlayer] = React.useState(false);
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
    const playerFormRef = React.useRef<{ submit: () => Promise<PlayerFormData | null> } | null>(
        null,
    );
    const [submittingPlayer, setSubmittingPlayer] = React.useState(false);

    async function handleOrganizerSubmit(data: OrganizerFormData, reset: () => void) {
        setErrorMsg(null);
        setLoadingOrg(true);
        try {
            const result = await registerOrganizador(data);
            // backend returns organizador object with Codigo
            const obj = result as Record<string, unknown>;
            const codigo = (obj && (obj['codigo'] ?? obj['Codigo'])) ?? null;
            if (codigo) setOrganizerCode(String(codigo));
            // prefer backend-provided message when available
            const resObj = result as unknown as { message?: string; mensagem?: string } | null;
            const backendMessage = resObj?.message ?? resObj?.mensagem ?? null;
            toast.success(backendMessage ?? 'Organizador cadastrado com sucesso');
            reset();
        } catch (err: unknown) {
            // prefer structured ErrorResponse model when available
            const isErrorResponse = (v: unknown): v is import('../models/api').ErrorResponse => {
                if (typeof v !== 'object' || v === null) return false;
                const obj = v as Record<string, unknown>;
                if (!('error' in obj)) return false;
                const errObj = obj['error'] as Record<string, unknown> | undefined;
                return !!errObj && typeof errObj.message === 'string';
            };

            const message = isErrorResponse(err)
                ? err.error.message
                : err instanceof Error
                ? err.message
                : String(err);

            setErrorMsg(message);
            toast.error(message);
        } finally {
            setLoadingOrg(false);
        }
    }

    async function handlePlayerSubmit(data: PlayerFormData) {
        setErrorMsg(null);
        setLoadingPlayer(true);
        try {
            const result = await registerJogador(data);
            const resObj = result as { message?: string; mensagem?: string } | null;
            const backendMessage = resObj?.message ?? resObj?.mensagem ?? null;
            toast.success(backendMessage ?? 'Jogador cadastrado com sucesso');
            // successful creation — do not throw so the form can reset
            return;
        } catch (err: unknown) {
            const isErrorResponse = (v: unknown): v is import('../models/api').ErrorResponse => {
                if (typeof v !== 'object' || v === null) return false;
                const obj = v as Record<string, unknown>;
                if (!('error' in obj)) return false;
                const errObj = obj['error'] as Record<string, unknown> | undefined;
                return !!errObj && typeof errObj.message === 'string';
            };

            const message = isErrorResponse(err)
                ? err.error.message
                : err instanceof Error
                ? err.message
                : String(err);

            setErrorMsg(message);
            toast.error(message);
            // propagate the error so the form won't reset and data is preserved
            throw err;
        } finally {
            setLoadingPlayer(false);
        }
    }

    return (
        <div className="min-h-[calc(100dvh-4rem)] grid place-items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-3xl"
            >
                <Card className="rounded-2xl shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl">Criar conta</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        {/* Role selector - hide when token is present (collaborator flow) */}
                        {!token && (
                            <div className="grid gap-2">
                                <Label>Tipo de conta</Label>
                                <RadioGroup
                                    value={role}
                                    onValueChange={(v: string) =>
                                        setRole(v === 'jogador' ? 'jogador' : 'organizador')
                                    }
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                >
                                    <label
                                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer hover:bg-muted ${
                                            role === 'organizador' ? 'border-primary' : ''
                                        }`}
                                    >
                                        <RadioGroupItem value="organizador" />
                                        <span>Organizador</span>
                                    </label>
                                    <label
                                        className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer hover:bg-muted ${
                                            role === 'jogador' ? 'border-primary' : ''
                                        }`}
                                    >
                                        <RadioGroupItem value="jogador" />
                                        <span>Jogador</span>
                                    </label>
                                </RadioGroup>
                            </div>
                        )}
                        {role === 'organizador' ? (
                            <OrganizerForm onSubmit={handleOrganizerSubmit} />
                        ) : (
                            <div>
                                <PlayerForm
                                    ref={playerFormRef}
                                    showPreview={true}
                                    onSubmit={handlePlayerSubmit}
                                    token={token}
                                    showSubmit={false}
                                    requireCodigo={true}
                                />
                            </div>
                        )}

                        {errorMsg && <div className="mt-3 text-sm text-red-600">{errorMsg}</div>}

                        {organizerCode && role === 'organizador' && (
                            <div className="mt-4 rounded-xl bg-green-50 p-3 flex items-center justify-between">
                                <div>
                                    <div className="text-sm text-muted-foreground">
                                        Código do organizador
                                    </div>
                                    <div className="font-mono font-semibold">{organizerCode}</div>
                                </div>
                                <div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => navigator.clipboard.writeText(organizerCode)}
                                    >
                                        Copiar
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button variant="link" size="sm" asChild>
                                <Link to="/login">Voltar</Link>
                            </Button>
                        </div>
                        {role === 'jogador' && (
                            <div>
                                <Button
                                    className="ml-4"
                                    onClick={async () => {
                                        try {
                                            setSubmittingPlayer(true);
                                            await playerFormRef.current?.submit();
                                            // handlePlayerSubmit will run via the form's onSubmit
                                        } finally {
                                            setSubmittingPlayer(false);
                                        }
                                    }}
                                    disabled={submittingPlayer || loadingPlayer}
                                >
                                    Cadastrar Jogador
                                </Button>
                            </div>
                        )}
                        {role === 'organizador' && (
                            <div>
                                <Button
                                    className="ml-4"
                                    form="organizer-form"
                                    type="submit"
                                    disabled={loadingOrg}
                                >
                                    {loadingOrg ? 'Cadastrando...' : 'Cadastrar como Organizador'}
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
