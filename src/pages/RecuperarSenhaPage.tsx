import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Trophy, ArrowLeft } from 'lucide-react';
import { passwordRecoveryService } from '@/services/passwordRecovery';

const schema = z.object({
    email: z.string().email('E-mail inválido'),
});

type RecuperarSenhaForm = z.infer<typeof schema>;

export default function RecuperarSenhaPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailEnviado, setEmailEnviado] = useState(false);
    const navigate = useNavigate();

    const form = useForm<RecuperarSenhaForm>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: RecuperarSenhaForm) => {
        setIsLoading(true);
        try {
            await passwordRecoveryService.solicitarRecuperacao(data.email);

            toast.success('E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.');
            setEmailEnviado(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            const message = err?.message || 'Erro ao processar recuperação de senha. Tente novamente.';
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
                        <CardTitle className="text-center text-2xl">Recuperar senha</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {!emailEnviado ? (
                            <>
                                <p className="text-sm text-gray-600 mb-6">
                                    Digite seu e-mail para receber um link de recuperação de senha.
                                </p>

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

                                        <Button
                                            type="submit"
                                            className="w-full bg-green-600 hover:bg-green-700 h-11"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Enviando...
                                                </>
                                            ) : (
                                                'Enviar link de recuperação'
                                            )}
                                        </Button>
                                    </form>
                                </Form>

                                <div className="mt-6 text-center">
                                    <Link
                                        to="/login"
                                        className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Voltar para login
                                    </Link>
                                </div>
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
                                <h3 className="text-lg font-semibold text-gray-900">E-mail enviado com sucesso!</h3>
                                <p className="text-sm text-gray-600">
                                    Verifique sua caixa de entrada e clique no link para redefinir sua senha. Redirecionando em breve...
                                </p>
                            </motion.div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
