import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from 'src/pokemon/entities/pokemon.entity';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    // MongooseModule.forFeature(
    //   [{
    //     name: Pokemon.name,
    //     schema: PokemonSchema
    //   }
    //   ]
    // )
    PokemonModule
  ]
})
export class SeedModule {}
