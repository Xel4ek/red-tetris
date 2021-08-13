import { Injectable } from '@nestjs/common';

@Injectable()
export class TerrainService {
  generateTerrain(): string[] {
    return Array.from({ length: 12 * 21 }, () => '#FFF');
  }
}
