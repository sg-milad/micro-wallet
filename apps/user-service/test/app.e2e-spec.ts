import { INestApplication } from "@nestjs/common";
import { TestingModule, Test } from "@nestjs/testing";
import * as request from 'supertest';
import { EntityManager, DataSource } from "typeorm";
import { AppModule } from "../src/app.module";
import { options } from "../ormconfig";


let dataSource: DataSource;
describe('', () => {
  let app: INestApplication;
  let manager: EntityManager;
  console.log(process.env.NODE_ENV);


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    dataSource = new DataSource(options);
    await dataSource.initialize();
    manager = dataSource.manager;
  });

  beforeEach(async () => {
    await dataSource.dropDatabase();
    await dataSource.synchronize();
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });
});
