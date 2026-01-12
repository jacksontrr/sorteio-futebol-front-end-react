import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy, Users, Shield, Zap, Calendar, TrendingUp } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
            {/* Header/Navigation */}
            <header className="container mx-auto px-4 py-6">
                <nav className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <Trophy className="h-8 w-8 text-green-600" />
                        <span className="text-2xl font-bold text-gray-900">FutebolSort</span>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex gap-4"
                    >
                        <Link to="/login">
                            <Button variant="ghost">Entrar</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-green-600 hover:bg-green-700">
                                Começar Grátis
                            </Button>
                        </Link>
                    </motion.div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Sorteio de times de futebol
                            <span className="text-green-600"> automatizado e justo</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-4">
                            Distribua jogadores em times de forma equilibrada usando sistema de pesos e destaques. 
                            Gerencie partidas, acompanhe pontos corridos e compartilhe resultados publicamente.
                        </p>
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8 rounded-r-lg">
                            <p className="text-lg text-blue-900 font-semibold">
                                💾 Cadastre jogadores UMA VEZ. Reutilize em TODOS os sorteios.
                            </p>
                        </div>
                        <div>
                            <Link to="/register">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                                    Criar Sorteio Agora
                                </Button>
                            </Link>
                            <Link to="/sorteio/1">
                                <Button size="lg" variant="outline">
                                    Ver Exemplo
                                </Button>
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl p-8 shadow-2xl">
                            <div className="bg-white rounded-xl p-6 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Trophy className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">Bobeira Futebol Clube</p>
                                        <p className="text-sm text-gray-500">4 times • 24 jogadores</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Funcionalidades completas para seu torneio
                    </h2>
                    <p className="text-xl text-gray-600">
                        Desde o sorteio até a tabela final - tudo em uma plataforma integrada
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-green-600 py-20">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center text-white">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                                <div className="text-green-100">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="container mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Como funciona
                    </h2>
                    <p className="text-xl text-gray-600">
                        Comece seu torneio em 3 passos simples
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Pronto para sortear seus times?
                        </h2>
                        <p className="text-xl text-green-100 mb-8">
                            Cadastre-se gratuitamente e faça seu primeiro sorteio equilibrado agora
                        </p>
                        <Link to="/register">
                            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                                Começar Agora - É Grátis
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="h-6 w-6 text-green-500" />
                                <span className="text-xl font-bold">FutebolSort</span>
                            </div>
                            <p className="text-gray-400">
                                Organize torneios de futebol com facilidade e profissionalismo.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Produto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#features" className="hover:text-white">Recursos</a></li>
                                <li><a href="#how-it-works" className="hover:text-white">Como funciona</a></li>
                                <li><Link to="/register" className="hover:text-white">Começar grátis</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Suporte</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="mailto:suporte@futebolsort.com" className="hover:text-white">Contato</a></li>
                                <li><Link to="/login" className="hover:text-white">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><span className="text-gray-500">Em desenvolvimento</span></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026 FutebolSort. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

const features = [
    {
        icon: <Users className="h-6 w-6 text-green-600" />,
        title: 'Banco de Jogadores Permanente',
        description: 'Cadastre seus jogadores uma única vez e reutilize em infinitos sorteios. Sem retrabalho, sem perda de dados.',
    },
    {
        icon: <Zap className="h-6 w-6 text-green-600" />,
        title: 'Sorteio Inteligente',
        description: 'Sistema de pesos e destaques para distribuir jogadores de forma equilibrada entre os times.',
    },
    {
        icon: <Calendar className="h-6 w-6 text-green-600" />,
        title: 'Controle de Partidas',
        description: 'Registre placares, acompanhe partidas pendentes e finalizadas em tempo real.',
    },
    {
        icon: <TrendingUp className="h-6 w-6 text-green-600" />,
        title: 'Tabela de Pontos Corridos',
        description: 'Classificação automática com pontos, vitórias, empates, derrotas e saldo de gols.',
    },
    {
        icon: <Shield className="h-6 w-6 text-green-600" />,
        title: 'Visualização Pública',
        description: 'Compartilhe sorteios com link público - jogadores acompanham sem precisar de login.',
    },
    {
        icon: <Trophy className="h-6 w-6 text-green-600" />,
        title: 'Gestão Completa',
        description: 'Gerencie jogadores com posições, pesos, observações e status. Organize tudo em um só lugar.',
    },
];

const stats = [
    { value: '1 min', label: 'Para criar sorteio' },
    { value: '∞', label: 'Sorteios possíveis' },
    { value: '100%', label: 'Equilibrado' },
    { value: 'R$ 0', label: 'Custo' },
];

const steps = [
    {
        title: 'Cadastre jogadores UMA VEZ',
        description: 'Crie seu banco de jogadores permanente com nome, posição e pesos. Nos próximos sorteios, apenas selecione quem vai jogar.',
    },
    {
        title: 'Realize o sorteio',
        description: 'Escolha a quantidade de times e deixe o sistema distribuir os jogadores automaticamente.',
    },
    {
        title: 'Gerencie o campeonato',
        description: 'Registre placares das partidas e acompanhe a tabela de pontos corridos atualizada.',
    },
];
