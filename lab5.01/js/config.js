'use strict';


var BLOOD_DROP_URL = 'fe3d8c77-bc74-42c9-8c38-2c6a70d22dc9 (1).png';

var BONE_URL = 'c17515cd-4e7e-4cbb-9e1f-0464c9864db3 (2).png';

var CARD_ARTS = {
    'Squirrel': '95729e26-702d-4156-94f7-7171f6bc82d5.png',
    'Stoat': 'ff53dc76-c456-4c13-aabc-1d6be1fe8c66.png',
    'Wolf': '66e6809b-9b66-4847-af00-d012aab07e16.png',
    'WolfCub': '8db688c0-df92-4262-afc8-91f86b93331f.png',
    'Bullfrog': '66591f48-4952-44a1-bbcc-c58a0d8b7c2b.png',
    'Cat': '9e77c732-055d-4d00-b731-454b9637c604.png',
    'Mantis': '073c168e-a73f-451d-99dd-327becbf5947.png',
    'Cockroach': '4d53f76d-5029-4e4e-bdbc-687ff2a3f618.png',
    'CorpseMaggots': '7305a46d-3b9d-43bc-8c79-b9ca00fec881.png',
    'Magpie': 'a9258eea-b21a-4997-870e-0c3c02ec96ba.png',
    'Ouroboros': 'a7c1da58-1dc8-4fec-a36c-a8f4b5cc1600.png',
    'Urayuli': 'c46b77c8-cf7e-4eac-95c3-eceaec421cf2.png'
};

var ICON_PAW = '<svg viewBox="0 0 20 20" fill="#1a0800" xmlns="http://www.w3.org/2000/svg"><ellipse cx="10" cy="13.5" rx="5" ry="4.5"/><ellipse cx="4.5" cy="9" rx="2.2" ry="2.8"/><ellipse cx="15.5" cy="9" rx="2.2" ry="2.8"/><ellipse cx="7" cy="5.5" rx="1.8" ry="2.3"/><ellipse cx="13" cy="5.5" rx="1.8" ry="2.3"/></svg>';
var ICON_HEART = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 17 C10 17 2 11 2 6.5 A4 4 0 0 1 10 5.2 A4 4 0 0 1 18 6.5 C18 11 10 17 10 17Z" fill="#8b0000"/></svg>';
var ICON_BONE = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#c4a870"><rect x="7" y="4" width="6" height="12" rx="2"/><circle cx="5" cy="5" r="3"/><circle cx="15" cy="5" r="3"/><circle cx="5" cy="15" r="3"/><circle cx="15" cy="15" r="3"/></svg>';
var ICON_INSECT = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" fill="#4a3a10"><ellipse cx="10" cy="11" rx="4" ry="5"/><ellipse cx="10" cy="5.5" rx="2.5" ry="2.5"/><line x1="3" y1="9" x2="7" y2="11" stroke="#4a3a10" stroke-width="1.5"/><line x1="17" y1="9" x2="13" y2="11" stroke="#4a3a10" stroke-width="1.5"/><line x1="2" y1="12" x2="7" y2="13" stroke="#4a3a10" stroke-width="1.5"/><line x1="18" y1="12" x2="13" y2="13" stroke="#4a3a10" stroke-width="1.5"/></svg>';


var SIGIL_RU = {
    'Airborne': 'Полёт',
    'Bifurcated Strike': 'Раздвоенный удар',
    'Trifurcated Strike': 'Тройной удар',
    'Burrower': 'Рытьё',
    'Mighty Leap': 'Прыжок',
    'Fledgling': 'Взрослеет',
    'Unkillable': 'Неубиваемый',
    'Many Lives': 'Девять жизней',
    'Corpse Eater': 'Пожиратель трупов',
    'Dam Builder': 'Строитель плотин',
    'Bone King': 'Костяной король',
    'Hoarder': 'Коллекционер',
    'Stinky': 'Вонь',
    'Touch of Death': 'Смертельное касание',
    'Sharp Quills': 'Острые иглы',
    'Fecundity': 'Плодовитость',
    'Swarm': 'Рой',
    'Undying': 'Бессмертный',
};

function sigilRu(sigil) {
    return SIGIL_RU[sigil] || sigil;
}

var DEFAULT_DECK = [{
        type: 'beast',
        name: 'Squirrel',
        power: 0,
        health: 1,
        blood: 0,
        bones: 0,
        sigils: [],
        rarity: 'common',
        flavor: 'Просто белка. Используй её как жертву.'
    },
    {
        type: 'beast',
        name: 'Stoat',
        power: 1,
        health: 3,
        blood: 1,
        bones: 0,
        sigils: [],
        rarity: 'common',
        flavor: 'Он говорил о лесе вещи, которые лучше не знать.'
    },
    {
        type: 'beast',
        name: 'Wolf',
        power: 3,
        health: 2,
        blood: 2,
        bones: 0,
        sigils: [],
        rarity: 'uncommon',
        flavor: 'В темноте горят два жёлтых огня.'
    },
    {
        type: 'beast',
        name: 'WolfCub',
        power: 1,
        health: 1,
        blood: 1,
        bones: 0,
        sigils: ['Fledgling'],
        rarity: 'uncommon',
        flavor: 'Вырастет в нечто опасное... если доживёт.'
    },
    {
        type: 'beast',
        name: 'Bullfrog',
        power: 1,
        health: 3,
        blood: 1,
        bones: 0,
        sigils: ['Mighty Leap'],
        rarity: 'common',
        flavor: 'Болото ждёт возвращения своего хозяина.'
    },
    {
        type: 'beast',
        name: 'Cat',
        power: 0,
        health: 1,
        blood: 1,
        bones: 0,
        sigils: ['Many Lives'],
        rarity: 'uncommon',
        flavor: 'Девять жизней — и всё же он возвращается.'
    },
    {
        type: 'insect',
        name: 'Mantis',
        power: 1,
        health: 1,
        blood: 1,
        bones: 0,
        sigils: ['Bifurcated Strike'],
        rarity: 'uncommon',
        flavor: 'Два удара — два трупа.'
    },
    {
        type: 'insect',
        name: 'Cockroach',
        power: 1,
        health: 1,
        blood: 0,
        bones: 3,
        sigils: ['Unkillable'],
        rarity: 'common',
        flavor: 'Он был здесь до нас. Будет после.'
    },
    {
        type: 'insect',
        name: 'CorpseMaggots',
        power: 1,
        health: 2,
        blood: 0,
        bones: 0,
        sigils: ['Corpse Eater'],
        rarity: 'rare',
        flavor: 'Голодны всегда. Платить им не нужно.'
    },
    {
        type: 'beast',
        name: 'Magpie',
        power: 1,
        health: 1,
        blood: 2,
        bones: 0,
        sigils: ['Airborne', 'Hoarder'],
        rarity: 'rare',
        flavor: 'Коллекционирует чужую боль и собственную мудрость.'
    },
    {
        type: 'undead',
        name: 'Ouroboros',
        power: 1,
        health: 1,
        blood: 0,
        bones: 0,
        sigils: ['Unkillable'],
        rarity: 'unique',
        boneYield: 3,
        flavor: 'Конец — это начало. Начало — это конец.'
    },
    {
        type: 'beast',
        name: 'Urayuli',
        power: 7,
        health: 7,
        blood: 4,
        bones: 0,
        sigils: [],
        rarity: 'rare',
        flavor: 'Лес расступается перед ним. Даже Лэши молчит.'
    }
];