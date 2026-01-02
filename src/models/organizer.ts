export type Organizer = {
  id?: string;
  nome: string;
  email: string;
  codigo?: string;
  createdAt?: string;
};

export type OrganizerFormData = {
  nome: string;
  email: string;
  password: string;
};
