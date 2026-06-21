/**
 * Name suggestion data for the Step 1 "suggest a name" button.
 *
 * Structure: per species, ten first names for each of the three genders, plus
 * twenty surnames shared across all genders ("universal by species"). The
 * suggester picks one first name (from the chosen gender's pool, or all pools
 * if no gender is chosen) and one surname at random.
 *
 * These lists are original, written to evoke each species' conventional fantasy
 * phonetics rather than copied from any published name table — keeping the
 * project's content CC-BY-clean. They're meant to be edited/expanded freely;
 * nothing in the code assumes a fixed length.
 */

import type { Gender } from '../types/character';

export interface SpeciesNames {
  first: Record<Gender, string[]>;
  last: string[];
}

export const NAMES: Record<string, SpeciesNames> = {
  Aasimar: {
    first: {
      male: ['Caelen', 'Soriel', 'Auren', 'Tobiah', 'Marevel', 'Ioram', 'Castiel', 'Nathiel', 'Eliam', 'Sariot'],
      female: ['Seraphel', 'Liora', 'Auriel', 'Ceriane', 'Naviel', 'Talael', 'Mireille', 'Eloria', 'Saphiel', 'Ysolde'],
      nonbinary: ['Vael', 'Ealor', 'Sariel', 'Noven', 'Aurix', 'Lumiel', 'Caval', 'Theriel', 'Oriel', 'Sevael'],
    },
    last: [
      'Dawnwhisper', 'Lightborn', 'Halloran', 'Sunmantle', 'Everbright', 'Sorrowsong', 'Highvale', 'Goldmercy',
      'Mornhaven', 'Truelight', 'Aurelane', 'Sacristan', 'Brightveil', 'Hopebearer', 'Starcaller', 'Valisar',
      'Lumengrace', 'Skyholt', 'Mendaris', 'Whitechorus',
    ],
  },

  Dragonborn: {
    first: {
      male: ['Rhogar', 'Balasar', 'Kriv', 'Tarhun', 'Verthax', 'Donaar', 'Garrok', 'Medrash', 'Pandjed', 'Heskan'],
      female: ['Sora', 'Kava', 'Mishann', 'Thava', 'Perra', 'Nala', 'Surina', 'Daar', 'Korin', 'Vezera'],
      nonbinary: ['Sethrix', 'Vorel', 'Khaaz', 'Pyrax', 'Ouren', 'Skarn', 'Velmar', 'Tazrik', 'Ghesh', 'Aurzan'],
    },
    last: [
      'Clethtinthiallor', 'Verthisathurgiesh', 'Kepeshkmolik', 'Myastan', 'Norixius', 'Daardendrian', 'Fenkenkabradon',
      'Yarjerit', 'Shestendeliath', 'Turnuroth', 'Ophinshtalajiir', 'Prexijandilin', 'Akambheryllion', 'Drachedandion',
      'Linxakasendalor', 'Kerrhylon', 'Baharoosh', 'Tiamash', 'Vrakavor', 'Zaltheskan',
    ],
  },

  Dwarf: {
    first: {
      male: ['Thrum', 'Bardin', 'Durgan', 'Kazrim', 'Brohm', 'Orin', 'Veit', 'Harbek', 'Dolgrin', 'Morgran'],
      female: ['Helga', 'Vistra', 'Brunor', 'Dagna', 'Torra', 'Kathra', 'Eldeth', 'Riswynn', 'Gunnloda', 'Mardred'],
      nonbinary: ['Korl', 'Brynd', 'Thraid', 'Ovik', 'Snorrin', 'Dwalik', 'Hrun', 'Balgrim', 'Tordek', 'Yurin'],
    },
    last: [
      'Ironbeard', 'Stonehand', 'Deepdelver', 'Coalhewer', 'Ambergrim', 'Boulderfist', 'Gravelmaw', 'Forgewright',
      'Hammerfall', 'Oremantle', 'Frostforge', 'Battlehorn', 'Granitegrip', 'Emberhall', 'Goldvein', 'Rockmarrow',
      'Steelbrow', 'Underbrook', 'Brightaxe', 'Caskbottom',
    ],
  },

  Elf: {
    first: {
      male: ['Aelar', 'Varis', 'Theren', 'Erevan', 'Lucan', 'Sylvar', 'Caelynn', 'Riardon', 'Aramil', 'Galinndan'],
      female: ['Shava', 'Lia', 'Naevys', 'Aelene', 'Thiala', 'Mireska', 'Saelihn', 'Quelenna', 'Birel', 'Vaeril'],
      nonbinary: ['Aerin', 'Sael', 'Faen', 'Liriel', 'Aien', 'Quarion', 'Nym', 'Thelvyn', 'Aelo', 'Ilryn'],
    },
    last: [
      'Moonwhisper', 'Silverleaf', 'Nightbreeze', 'Starwind', 'Amakiir', 'Galanodel', 'Holimion', 'Liadon',
      'Meliamne', 'Naïlo', 'Siannodel', 'Xiloscient', 'Duskmantle', 'Faronel', 'Aluviel', 'Morningdew',
      'Withervale', 'Sunshadow', 'Caerdonel', 'Brightmere',
    ],
  },

  Gnome: {
    first: {
      male: ['Boddynock', 'Fonkin', 'Glim', 'Wrenn', 'Zook', 'Alston', 'Dimble', 'Gerbo', 'Namfoodle', 'Roondar'],
      female: ['Bimpnottin', 'Caramip', 'Ellyjobell', 'Mardnab', 'Nissa', 'Tana', 'Lilli', 'Orla', 'Breena', 'Duvamil'],
      nonbinary: ['Pock', 'Zib', 'Fizwidget', 'Snik', 'Quill', 'Bizzle', 'Tinkin', 'Nope', 'Gimble', 'Whirr'],
    },
    last: [
      'Tinklink', 'Cogspark', 'Fizzlebang', 'Gearwhistle', 'Sprocketts', 'Glittergleam', 'Wobblefoot', 'Brassbottom',
      'Nimblefingers', 'Quickwick', 'Bafflestone', 'Tumtwiddle', 'Springwidget', 'Coppernock', 'Murnig', 'Pellbottle',
      'Fiddlefen', 'Whirligig', 'Tallowtinker', 'Scheppen',
    ],
  },

  Goliath: {
    first: {
      male: ['Aukan', 'Eglath', 'Kavaki', 'Thalai', 'Vimak', 'Gauthak', 'Lo-kag', 'Maveith', 'Orhuk', 'Paavu'],
      female: ['Gae-al', 'Kuori', 'Manneo', 'Nalla', 'Pethani', 'Uthal', 'Vaunea', 'Ilydi', 'Theldra', 'Anneka'],
      nonbinary: ['Keothi', 'Surek', 'Vand', 'Aleki', 'Bruta', 'Hethu', 'Kalo', 'Norai', 'Tavar', 'Uvali'],
    },
    last: [
      'Stonepeak', 'Cloudchaser', 'Anakalathai', 'Elanithino', 'Gathakanathi', 'Kalagiano', 'Vaikanninoran',
      'Thuliaga', 'Ironwind', 'Skybreaker', 'Frostcrag', 'Boulderborn', 'Highsummit', 'Avalanche', 'Stormcrest',
      'Granitestride', 'Coldhollow', 'Talonridge', 'Snowmantle', 'Thunderstep',
    ],
  },

  Halfling: {
    first: {
      male: ['Alton', 'Cade', 'Eldon', 'Garret', 'Lyle', 'Milo', 'Osborn', 'Roscoe', 'Wellby', 'Finnan'],
      female: ['Andry', 'Bree', 'Callie', 'Euphemia', 'Jillian', 'Lavinia', 'Nedda', 'Seraphina', 'Verna', 'Marigold'],
      nonbinary: ['Perrin', 'Lidda', 'Ander', 'Cobble', 'Wrenna', 'Tibb', 'Hollin', 'Posy', 'Quincey', 'Bramble'],
    },
    last: [
      'Goodbarrel', 'Underbough', 'Tealeaf', 'Thorngage', 'Greenbottle', 'Highhill', 'Brushgather', 'Tosscobble',
      'Brightmoor', 'Quickstep', 'Hilltopple', 'Goodfellow', 'Warmkettle', 'Appledew', 'Mossfoot', 'Tenpenny',
      'Fairwind', 'Honeypot', 'Burrows', 'Littlebrook',
    ],
  },

  Human: {
    first: {
      male: ['Darian', 'Marcus', 'Aldric', 'Tomas', 'Joren', 'Rolf', 'Kael', 'Bram', 'Cassius', 'Halden'],
      female: ['Mara', 'Elise', 'Rowan', 'Cora', 'Ysabel', 'Lena', 'Talia', 'Wrenna', 'Sabira', 'Imara'],
      nonbinary: ['Ash', 'Robin', 'Sael', 'Quinn', 'Eren', 'Devi', 'Lior', 'Marek', 'Noa', 'Vale'],
    },
    last: [
      'Ashford', 'Vance', 'Hollis', 'Karras', 'Dunmore', 'Whitlock', 'Sorrel', 'Calder', 'Marsh', 'Thorne',
      'Bellamy', 'Garrick', 'Ostrander', 'Quill', 'Faversham', 'Renner', 'Stroud', 'Vaughn', 'Halloway', 'Mercer',
    ],
  },

  Orc: {
    first: {
      male: ['Grukk', 'Thokk', 'Murog', 'Drazgar', 'Karash', 'Brughol', 'Vrang', 'Ognar', 'Hrothag', 'Skarn'],
      female: ['Emen', 'Yevelda', 'Baggi', 'Shautha', 'Volen', 'Greshka', 'Ootah', 'Myeva', 'Drenna', 'Kansif'],
      nonbinary: ['Zogg', 'Rukh', 'Vasha', 'Othra', 'Gell', 'Brakka', 'Nurz', 'Tang', 'Ulga', 'Morv'],
    },
    last: [
      'Skullcleaver', 'Bonegnasher', 'Bloodtusk', 'Ironmaw', 'Gravesnarl', 'Ashfang', 'Stormgore', 'Redhowl',
      'Brokentooth', 'Doomgrip', 'Rotjaw', 'Spinecrusher', 'Grimscar', 'Fellroar', 'Warbringer', 'Blackvein',
      'Skarmaw', 'Hollowgut', 'Cragback', 'Venomsnap',
    ],
  },

  Tiefling: {
    first: {
      male: ['Damaron', 'Iados', 'Mordai', 'Kaesh', 'Therai', 'Barakas', 'Skamos', 'Vharel', 'Ronoth', 'Ekemon'],
      female: ['Akta', 'Nemeia', 'Rieta', 'Criella', 'Phelaia', 'Seressa', 'Valeris', 'Bryseis', 'Damaia', 'Orianna'],
      nonbinary: ['Mavet', 'Ari', 'Sahar', 'Velis', 'Korash', 'Nyx', 'Ravel', 'Ember', 'Solenn', 'Vesh'],
    },
    last: [
      'Nightfall', 'Ashveil', 'Emberhart', 'Vexren', 'Mourningstar', 'Hellebore', 'Cindermoor', 'Voidwhisper',
      'Sorrowmask', 'Duskborn', 'Pyreheart', 'Wormwood', 'Ravenhollow', 'Gloomthorn', 'Sablewing', 'Thornquell',
      'Direlight', 'Crowmantle', 'Ashentide', 'Brimstone',
    ],
  },
};

const pick = <T>(arr: T[]): T | undefined => (arr.length === 0 ? undefined : arr[Math.floor(Math.random() * arr.length)]);

/**
 * Suggest a random "First Last" name for a species. If `gender` is given, the
 * first name is drawn from that gender's pool; otherwise it's drawn from all
 * pools combined. Returns null for species with no name data (e.g. homebrew).
 */
export function suggestName(species: string, gender?: Gender): string | null {
  const entry = NAMES[species];
  if (!entry) return null;
  const firstPool = gender ? entry.first[gender] : [...entry.first.male, ...entry.first.nonbinary, ...entry.first.female];
  const first = pick(firstPool);
  if (!first) return null;
  const last = pick(entry.last);
  return last ? `${first} ${last}` : first;
}

/** True if the species has name data the suggester can use. */
export const hasNames = (species: string): boolean => species in NAMES;
