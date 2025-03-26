
export interface Contact {
  id: string;
  name: string;
  familyName?: string;
  phoneNumber?: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}
