/**
 * Data types that are result of frontend quires
 * @description Stored in redux. Serve as single source of truth about data
 * on frontend. Are different from view data types, that are transformed version
 * of these data types, user for showing data
 */
export interface Myself {
  id: string;

  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  avatar: string | null;

  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;

  gender: "M" | "F";
  advice: string;

  age: number;
}

export type CreateErrorObject<T extends { [key: string]: any }> = {
  [actionName in keyof T]?: string | string[];
};
