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

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    remember: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
    const form = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const navigate = useNavigate();

    const onGoogleSuccess = async ({
        clientId,
        credential,
    }: {
        clientId?: string;
        credential: string;
    }) => {
        // Fallback ao env caso o clientId não venha da resposta do Google
        const effectiveClientId = clientId || (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;

        if (!effectiveClientId) {
            console.error('Client ID do Google não encontrado (header).');
            return;
        }

        try {
            const res = await loginWithGoogle(effectiveClientId, credential);
            const token = (res as { token?: string })?.token;
            if (token) {
                const remember = !!form.getValues('remember');
                if (remember) localStorage.setItem('token', token);
                else sessionStorage.setItem('token', token);
                navigate('/organizer');
            } else {
                console.error('Token não retornado pela API (Google).', res);
            }
        } catch (err) {
            console.error('Erro ao efetuar login com Google:', err);
        }
    };

    const onSubmit = (data: LoginForm) => {
        (async () => {
            try {
                const res = await login(data.email, data.password, !!data.remember);
                const token = (res as { token?: string })?.token;
                if (token) {
                    if (data.remember) localStorage.setItem('token', token);
                    else sessionStorage.setItem('token', token);
                    navigate('/organizer');
                } else {
                    console.error('Token não retornado pela API', res);
                }
            } catch (err) {
                console.error('Erro ao efetuar login:', err);
            }
        })();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Label htmlFor="email">E-mail</Label>
                                            <FormControl>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="seu@email.com"
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
                                            <Label htmlFor="password">Senha</Label>
                                            <FormControl>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    placeholder="******"
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
                                        className="w-4 h-4"
                                        {...form.register('remember')}
                                    />
                                    <label htmlFor="remember">Lembrar-me</label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <Button type="submit" className="w-full">
                                        Entrar
                                    </Button>
                                    <Link to="/register">
                                        <Button className="w-full">Registrar</Button>
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
                            <GoogleLogin
                                onSuccess={(response) => {
                                    if (!response.credential) return;
                                    onGoogleSuccess({
                                        clientId: response.clientId,
                                        credential: response.credential,
                                    });
                                }}
                                onError={() => {
                                    console.error('Erro ao autenticar com Google');
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
