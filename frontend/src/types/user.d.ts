export type LoginUser = {
  email: string;
  password: string;
};

export interface SignInProps {
  email: string;
  password: string;
}

export type SignUpParams = {
  first_name: string;
  last_name: string;
  address1: string;
  city: string;
  postal_code: string;
  date_of_birth: string;
  email: string;
  password: string;
};

export type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string; 
  address1: string;
  city: string;
  postal_code: string;
  date_of_birth: string;
};

export interface GetUserInfoProps {
  user_id: string;
}

export type NewUserParams = {
  user_id: string;
  email: string;
  name: string;
  password: string;
};
