import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import pl from 'date-fns/esm/locale/pl/index.js';

export interface PlantProps{
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
    hour: string;
    dateTimeNotification: Date;
}

export interface StoragePlantProps {
    [id: string]: {
        data: PlantProps;
    }
}

export async function savePlant(plant: PlantProps) : Promise<void>{
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        //converte em tipo json pro tipo StoragePlantProps caso contrario retorna vazio
        const oldPlant = data ? (JSON.parse(data) as StoragePlantProps) : {};

        //pega a planta atual e adiciona
        const newPlant = {
            [plant.id]: {
                data: plant
            }
        }
        // pega o antigo junta com o novo e transforma em string
        //salva na chave '@plantmanager:plants'
        await AsyncStorage.setItem('@plantmanager:plants',
            JSON.stringify({
                ... newPlant,
                ... oldPlant
            })
        )

    }catch(error){
        throw new Error(error);
    }
}

export async function loadPlant() : Promise<PlantProps[]>{
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        //converte em tipo json pro tipo StoragePlantProps caso contrario retorna vazio
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        const plantsSorted = Object
        .keys(plants)
        .map((plant) => {
            return {
                ...plants[plant].data,
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
            }
        })
        //busca o menor
        .sort((a, b)=>
            Math.floor(
                new Date(a.dateTimeNotification).getTime() / 1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
            )
        );

        return plantsSorted;

    }catch(error){
        throw new Error(error);
    }
}