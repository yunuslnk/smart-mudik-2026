import { Test, TestingModule } from '@nestjs/testing';
import { MudikController } from './mudik.controller';

describe('MudikController', () => {
  let controller: MudikController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MudikController],
    }).compile();

    controller = module.get<MudikController>(MudikController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
