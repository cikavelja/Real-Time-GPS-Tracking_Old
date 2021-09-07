export class Register {
    public constructor(init?: Partial<Register>) {
      Object.assign(this, init);
    }
  
    userName: string;
    password: string;
  }
  