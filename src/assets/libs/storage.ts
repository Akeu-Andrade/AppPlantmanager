import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

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
    dateTimeNotification: Date;
}

interface StoragePlantProps {
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

export async function loadPlant() : Promise<StoragePlantProps>{
    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        //converte em tipo json pro tipo StoragePlantProps caso contrario retorna vazio
        const plants = data ? (JSON.parse(data) as StoragePlantProps) : {};

        return plants;

    }catch(error){
        throw new Error(error);
    }
}