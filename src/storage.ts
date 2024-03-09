interface IKeyGen {
  challenge: (challenge: string) => string;
  credential: (username: string) => string;
}

export const KeyGen: IKeyGen = {
  challenge: (c) => `challenge-${c}`,
  credential: (u) => `credential-${u}`,
};
