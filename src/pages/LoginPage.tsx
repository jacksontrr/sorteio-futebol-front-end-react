import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { loginWithGoogle } from '@/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '@/services/auth';
import { toast } from 'sonner';
import { Loader2, Trophy } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
        mode: 'onBlur',
    });

    const navigate = useNavigate();

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
                const remember = !!form.getValues('remember');
                if (remember) localStorage.setItem('token', token);
                else sessionStorage.setItem('token', token);

                toast.success('Login realizado com sucesso!');
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

    const onSubmit = async (data: LoginForm) => {
        setIsLoading(true);
        try {
            const res = await login(data.email, data.password, !!data.remember);
            const token = (res as { token?: string })?.token;

            if (token) {
                if (data.remember) localStorage.setItem('token', token);
                else sessionStorage.setItem('token', token);

                toast.success('Bem-vindo de volta!');
                navigate('/organizer');
            } else {
                toast.error('Credenciais inválidas. Verifique seu e-mail e senha.');
            }
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.response?.data?.error?.message || err?.message || 'E-mail ou senha incorretos. Tente novamente.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Trophy className="h-10 w-10 text-green-600" />
                    <span className="text-3xl font-bold text-gray-900">FutebolSort</span>
                </div>

                <Card className="shadow-2xl border-green-100 p-0 pb-6">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-center text-2xl">Entrar na sua conta</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="email">E-mail *</Label>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="seu@email.com"
                                                    autoComplete="email"
                                                    disabled={isLoading}
                                                    aria-required="true"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="password">Senha *</Label>
                                                <Link
                                                    to="/recuperar-senha"
                                                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                                                >
                                                    Esqueceu a senha?
                                                </Link>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="••••••••"
                                                    autoComplete="current-password"
                                                    disabled={isLoading}
                                                    aria-required="true"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                                        disabled={isLoading}
                                        {...form.register('remember')}
                                    />
                                    <label htmlFor="remember" className="text-sm cursor-pointer select-none" title="Manter conectado por 30 dias">
                                        Manter conectado
                                    </label>
                                </div>

                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-11" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Entrando...
                                        </>
                                    ) : (
                                        'Entrar'
                                    )}
                                </Button>

                                <div className="text-center text-sm">
                                    Não tem uma conta?{' '}
                                    <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold hover:underline">
                                        Cadastre-se grátis
                                    </Link>
                                </div>
                            </form>
                        </Form>

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
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
