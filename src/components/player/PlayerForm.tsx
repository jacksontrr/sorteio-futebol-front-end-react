import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Player from '@/components/player/Player';
import type { PlayerFormData } from '@/models/player';
import type { Resolver } from 'react-hook-form';
import { isAuthenticated } from '@/services/auth';

const POSICOES = ['Ataque', 'Meio-campo', 'Defesa', 'Goleiro'] as const;

const playerSchema = z.object({
    nome: z.string().min(2),
    posicoes: z.array(z.enum(POSICOES)).nonempty(),
    observacoes: z.string().optional(),
    token: z.string().optional(),
    codigo: z.string().optional(),
    destaque: z.boolean().optional(),
    peso: z.boolean().optional(),
});

type FormValues = PlayerFormData;

import React from 'react';
import { forwardRef, useImperativeHandle } from 'react';

const PlayerFormComponent = forwardRef(function PlayerForm(
    {
        onSubmit,
        defaultValues,
        token,
        onPreviewChange,
        showSubmit,
        requireCodigo,
        showPreview,
    }: {
        onSubmit: (data: PlayerFormData) => void | Promise<void>;
        defaultValues?: Partial<PlayerFormData>;
        token?: string | null;
        onPreviewChange?: (p: Partial<PlayerFormData>) => void;
        showSubmit?: boolean;
        requireCodigo?: boolean;
        showPreview?: boolean;
    },
    ref: React.Ref<{ submit: () => Promise<PlayerFormData | null> }>,
) {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(playerSchema) as unknown as Resolver<PlayerFormData>,
        defaultValues: {
            nome: '',
            posicoes: [] as unknown as FormValues['posicoes'],
            destaque: false,
            peso: false,
            observacoes: '',
            ...defaultValues,
            token: token ?? undefined,
        },
    });

    const posicoesSel = watch('posicoes');
    const nomeVal = watch('nome');
    const destaqueVal = watch('destaque');
    const pesoVal = watch('peso');

    React.useEffect(() => {
        if (!onPreviewChange) return;
        const sub = watch((value) => {
            onPreviewChange({
                nome: value.nome ?? '',
                posicoes: (value.posicoes ?? []) as FormValues['posicoes'],
                observacoes: value.observacoes,
                destaque: value.destaque,
                peso: value.peso,
            });
        });
        return () => sub && (sub.unsubscribe ? sub.unsubscribe() : undefined);
    }, [watch, onPreviewChange]);

    function togglePosicao(p: (typeof POSICOES)[number]) {
        const atual = new Set(posicoesSel as string[]);
        if (atual.has(p)) atual.delete(p);
        else atual.add(p);
        setValue('posicoes', Array.from(atual) as unknown as FormValues['posicoes'], {
            shouldValidate: true,
        });
    }

    // expose a submit method that always resolves (payload on success, null on validation/error)
    useImperativeHandle(ref, () => ({
        submit: () =>
            new Promise<PlayerFormData | null>((resolve) => {
                const onValid = (data: FormValues) => {
                    const payload: PlayerFormData = {
                        nome: data.nome,
                        posicoes: data.posicoes,
                        observacoes: data.observacoes,
                        token: data.token,
                        codigo: data.codigo,
                        destaque: data.destaque,
                        peso: data.peso,
                    };
                    console.log(data, payload);

                    Promise.resolve(onSubmit(payload))
                        .then(() => {
                            // reset the form after successful submission
                            reset();
                            resolve(payload);
                        })
                        .catch(() => resolve(null));
                };

                const onInvalid = () => {
                    // validation failed - resolve with null so callers don't hang
                    resolve(null);
                };

                // use handleSubmit with both success and error callbacks
                (
                    handleSubmit as unknown as (
                        onValid: (d: FormValues) => void,
                        onInvalid?: (e: unknown) => void,
                    ) => () => void
                )(onValid, onInvalid)();
            }),
    }));

    // create a typed submit handler to use as the form onSubmit prop
    const internalSubmit = (
        handleSubmit as unknown as (
            cb: (data: FormValues) => Promise<void>,
        ) => (e?: unknown) => Promise<void>
    )(async (data: FormValues) => {
        if (requireCodigo && !data.codigo) {
            setError('codigo' as keyof FormValues, {
                type: 'manual',
                message: 'Código é obrigatório',
            });
            return;
        }

        const payload: PlayerFormData = {
            nome: data.nome,
            posicoes: data.posicoes,
            observacoes: data.observacoes,
            token: data.token,
            codigo: data.codigo,
            destaque: data.destaque,
            peso: data.peso,
        };
        await onSubmit(payload);
        reset();
    }) as (e?: unknown) => Promise<void>;

    return (
        <form onSubmit={internalSubmit} className="grid gap-4">
            <div className="grid gap-2">
                <Label>Nome</Label>
                <Input {...register('nome')} />
            </div>

            <div>
                <Label>Posições</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                    {POSICOES.map((p) => (
                        <label
                            key={p}
                            className="inline-flex items-center gap-2 rounded-xl border p-2 cursor-pointer"
                        >
                            <Checkbox
                                checked={(posicoesSel as string[]).includes(p)}
                                onCheckedChange={() => togglePosicao(p)}
                            />
                            <span>{p}</span>
                        </label>
                    ))}
                </div>
            </div>
            {isAuthenticated() && (
                <div>
                    <Label>Características (Opcional)</Label>
                    <RadioGroup
                        value={destaqueVal ? 'destaque' : pesoVal ? 'peso' : 'nenhum'}
                        onValueChange={(value) => {
                            if (value === 'destaque') {
                                setValue('destaque', true, { shouldValidate: true });
                                setValue('peso', false, { shouldValidate: true });
                            } else if (value === 'peso') {
                                setValue('destaque', false, { shouldValidate: true });
                                setValue('peso', true, { shouldValidate: true });
                            } else {
                                setValue('destaque', false, { shouldValidate: true });
                                setValue('peso', false, { shouldValidate: true });
                            }
                        }}
                        className="mt-2"
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <label className="flex items-center gap-2 rounded-xl border p-2 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="nenhum" />
                                <span>Nenhum</span>
                            </label>
                            <label className="flex items-center gap-2 rounded-xl border p-2 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="destaque" />
                                <span>Destaque</span>
                            </label>
                            <label className="flex items-center gap-2 rounded-xl border p-2 cursor-pointer hover:bg-accent">
                                <RadioGroupItem value="peso" />
                                <span>Pesado</span>
                            </label>
                        </div>
                    </RadioGroup>
                </div>
            )}

            <Separator />

            {showPreview && (
                <div className="mt-4">
                    <div className="rounded-xl bg-muted/10 p-3">
                        <Player
                            nome={String(nomeVal ?? '')}
                            posicoes={(posicoesSel as string[]) ?? []}
                            observacoes={watch('observacoes')}
                            destaque={watch('destaque')}
                            peso={watch('peso')}
                        />
                    </div>
                </div>
            )}
            <div>
                <Label>Observações</Label>
                <Textarea {...register('observacoes')} />
            </div>

            {requireCodigo && (
                <div>
                    <Label>Código</Label>
                    <Input {...register('codigo')} />
                    {errors.codigo && (
                        <p className="text-sm text-red-600 mt-1">{String(errors.codigo.message)}</p>
                    )}
                </div>
            )}

            {showSubmit && (
                <div>
                    <Button type="submit" disabled={isSubmitting} className="w-full">
                        Cadastrar como Jogador
                    </Button>
                </div>
            )}
        </form>
    );
});

export default PlayerFormComponent;
