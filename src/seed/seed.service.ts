import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokemonInsert } from './interfaces/poke-insert.interface';
import internal from 'stream';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>
  ) { }

  private readonly axios: AxiosInstance = axios;

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }
  handleExceptions(error: any) {
    throw new Error('Method not implemented.');
  }

  async executeSeed() {
    await this.pokemonModel.deleteMany({});
    const { data } = await axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=610');

    const insertPromisesArray = [];
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      const item = { name, no };
      //const create = await this.create(item);
      // insertPromisesArray.push(
      //   this.pokemonModel.create(item)
      // )
      pokemonToInsert.push(item);
      //console.log(item);
    });

    //await Promise.all(insertPromisesArray);    
    this.pokemonModel.insertMany(pokemonToInsert);

    return data;
  }
}
