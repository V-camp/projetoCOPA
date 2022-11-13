import { CopaController } from '../src/controller/copaController';
// import { prismaMock } from '../singleton'
import input from "../temp/dadosParaSalvarNoDB.json"

import createPrismaMock from "prisma-mock"

const data = {
    user: [
      {
        id: 1,
        name: "sadfsdf",
        accountId: 1,
      },
    ],
    account: [
      {
        id: 1,
        name: "B",
      },
      {
        id: 2,
        name: "A",
      },
    ],
    stripe: [
      {
        id: 1,
        accountId: 1,
      },
    ],
  };
  
  test("findOne to", async () => {
    const client = await createPrismaMock(data);
    // @ts-ignore
    const user = await client.user.findUnique({
      where: {
        id: 1,
      },
      select: {
        id: 1,
        account: true,
      },
    });
    expect(user).toEqual({
      id: data.user[0].id,
      account: data.account[0],
    });
  });
