import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '@/services/auth';
import { Loader2, ChevronLeft, Trophy } from 'lucide-react';

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
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = (location.state as { token?: string } | null)?.token ?? searchParams.get('token');
    const [role, setRole] = React.useState<'organizador' | 'jogador'>(
        token ? 'jogador' : 'organizador',
    );
    // preview state removed (not used on this page)
    const [organizerCode, setOrganizerCode] = React.useState<string | null>(null);
    const [loadingOrg, setLoadingOrg] = React.useState(false);
    const [loadingPlayer, setLoadingPlayer] = React.useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);
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

    const onGoogleSuccess = async ({
        clientId,
        credential,
    }: {
        clientId?: string;
        credential: string;
    }) => {
        const effectiveClientId = clientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

        if (!effectiveClientId) {
            toast.error('Erro de configuração do Google Login');
            return;
        }

        setIsGoogleLoading(true);
        try {
            const res = await loginWithGoogle(effectiveClientId, credential);
            const token = (res as { token?: string })?.token;
            if (token) {
                sessionStorage.setItem('token', token);
                toast.success('Conta criada com sucesso!');
                navigate('/organizer');
            } else {
                toast.error('Erro ao processar autenticação');
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.message || 'Erro ao fazer login com Google. Tente novamente.';
            toast.error(message);
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid place-items-center p-3 sm:p-6 bg-gradient-to-br from-green-50 via-white to-blue-50">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="w-full max-w-md"
            >
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/')}
                    className="mb-4 flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium text-sm"
                >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Voltar</span>
                </motion.button>

                <div className="flex items-center justify-center gap-2 mb-6">
                    <Trophy className="h-10 w-10 text-green-600" />
                    <span className="text-3xl font-bold text-gray-900">FutebolSort</span>
                </div>

                <Card className="shadow-2xl border-0 p-0">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-center text-2xl">Criar conta</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:gap-6 px-4 sm:px-6 py-4 sm:py-6">
                        {/* Role selector - hide when token is present (collaborator flow) */}
                        {!token && (
                            <div className="grid gap-3">
                                <Label className="text-base font-semibold">Tipo de conta</Label>
                                <RadioGroup
                                    value={role}
                                    onValueChange={(v: string) =>
                                        setRole(v === 'jogador' ? 'jogador' : 'organizador')
                                    }
                                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
                                >
                                    <label
                                        className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border p-2.5 sm:p-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                                            role === 'organizador' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                        }`}
                                    >
                                        <RadioGroupItem value="organizador" />
                                        <span className="text-sm sm:text-base">Organizador</span>
                                    </label>
                                    <label
                                        className={`flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border p-2.5 sm:p-3 cursor-pointer hover:bg-green-50 transition-colors ${
                                            role === 'jogador' ? 'border-green-500 bg-green-50' : 'border-gray-200'
                                        }`}
                                    >
                                        <RadioGroupItem value="jogador" />
                                        <span className="text-sm sm:text-base">Jogador</span>
                                    </label>
                                </RadioGroup>
                            </div>
                        )}
                        {role === 'organizador' ? (
                            <>
                                <OrganizerForm onSubmit={handleOrganizerSubmit} />
                                
                                <div className="relative my-4 text-center text-sm text-muted-foreground">
                                    <span className="bg-white px-2 relative z-10">ou</span>
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    {isGoogleLoading ? (
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Autenticando com Google...
                                        </div>
                                    ) : (
                                        <GoogleLogin
                                            onSuccess={(response) => {
                                                if (!response.credential) return;
                                                onGoogleSuccess({
                                                    clientId: response.clientId,
                                                    credential: response.credential,
                                                });
                                            }}
                                            onError={() => {
                                                toast.error('Erro ao autenticar com Google. Tente novamente.');
                                            }}
                                        />
                                    )}
                                </div>
                            </>
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

                        {errorMsg && <div className="mt-3 text-xs sm:text-sm text-red-600 bg-red-50 p-3 rounded-lg">{errorMsg}</div>}

                        {organizerCode && role === 'organizador' && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 rounded-lg sm:rounded-xl bg-green-50 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                            >
                                <div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        Código do organizador
                                    </div>
                                    <div className="font-mono font-semibold text-sm sm:text-base mt-1">{organizerCode}</div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigator.clipboard.writeText(organizerCode)}
                                    className="w-full sm:w-auto"
                                >
                                    Copiar
                                </Button>
                            </motion.div>
                        )}
                    </CardContent>
                    <CardFooter className="text-xs sm:text-sm text-muted-foreground flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-t border-gray-100">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                        >
                            <Link to="/login">Voltar ao login</Link>
                        </Button>
                        {role === 'jogador' && (
                            <Button
                                className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
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
                                {submittingPlayer || loadingPlayer ? 'Cadastrando...' : 'Cadastrar Jogador'}
                            </Button>
                        )}
                        {role === 'organizador' && (
                            <Button
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                                form="organizer-form"
                                type="submit"
                                disabled={loadingOrg}
                            >
                                {loadingOrg ? 'Cadastrando...' : 'Cadastrar'}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
