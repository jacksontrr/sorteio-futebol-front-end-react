export type Player = {
  id?: string;
  nome: string;
  createdAt?: string;
  posicoes?: string[];
  observacoes?: string;
  destaque?: boolean;
  peso?: boolean;
  ativo?: boolean;
};

export type PlayerFormData = {
  nome: string;
  posicoes: string[];
  observacoes?: string;
  token?: string;
  codigo?: string;
  destaque?: boolean;
  peso?: boolean;
};
