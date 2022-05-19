export interface CardViewModel {
  id: string;
  name: string;
  number: string;
  expiresOn: Date;
}

export interface CardCommand {
  name: string;
  number: string;
  expiresOn: string;
}
