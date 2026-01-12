import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Trophy } from 'lucide-react';
import { passwordRecoveryService } from '@/services/passwordRecovery';

const schema = z
    .object({
        senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
        confirmaSenha: z.string(),
    })
    .refine((data) => data.senha === data.confirmaSenha, {
        message: 'As senhas não coincidem',
        path: ['confirmaSenha'],
    });

type RedefinirSenhaForm = z.infer<typeof schema>;

export default function RedefinirSenhaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get('token');

    const form = useForm<RedefinirSenhaForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            senha: '',
            confirmaSenha: '',
        },
        mode: 'onBlur',
    });

    if (!token) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
                <Card className="shadow-2xl border-red-100">
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-600 font-semibold mb-4">Link de recuperação inválido ou expirado</p>
                        <Link to="/recuperar-senha">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                Solicitar novo link
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const onSubmit = async (data: RedefinirSenhaForm) => {
        setIsLoading(true);
        try {
            await passwordRecoveryService.redefinirSenha(token, data.senha);

            toast.success('Senha redefinida com sucesso!');
            setSucesso(true);
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err: any) {
            const message = err?.message || 'Erro ao processar redefinição de senha. Tente novamente.';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                <div className="flex items-center justify-center gap-2 mb-6">
                    <Trophy className="h-10 w-10 text-green-600" />
                    <span className="text-3xl font-bold text-gray-900">FutebolSort</span>
                </div>

                <Card className="shadow-2xl border-green-100 p-0 pb-6">
                    <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
                        <CardTitle className="text-center text-2xl">Redefinir senha</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {!sucesso ? (
                            <>
                                <p className="text-sm text-gray-600 mb-6">Digite sua nova senha</p>

                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="senha"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label htmlFor="senha">Nova senha *</Label>
                                                    <FormControl>
                                                        <Input
                                                            id="senha"
                                                            type="password"
                                                            placeholder="••••••••"
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
                                            name="confirmaSenha"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <Label htmlFor="confirmaSenha">Confirmar senha *</Label>
                                                    <FormControl>
                                                        <Input
                                                            id="confirmaSenha"
                                                            type="password"
                                                            placeholder="••••••••"
                                                            disabled={isLoading}
                                                            aria-required="true"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button
                                            type="submit"
                                            className="w-full bg-green-600 hover:bg-green-700 h-11"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Redefinindo...
                                                </>
                                            ) : (
                                                'Redefinir senha'
                                            )}
                                        </Button>
                                    </form>
                                </Form>
                            </>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Senha redefinida com sucesso!</h3>
                                <p className="text-sm text-gray-600">
                                    Você será redirecionado para login em breve...
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
