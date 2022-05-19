export interface AddressViewModel {
  id: string;
  type: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export interface AddressCommand {
  type: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}
