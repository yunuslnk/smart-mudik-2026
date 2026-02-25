import { Test, TestingModule } from '@nestjs/testing';
import { MudikService } from './mudik.service';

describe('MudikService', () => {
  let service: MudikService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MudikService],
    }).compile();

    service = module.get<MudikService>(MudikService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
