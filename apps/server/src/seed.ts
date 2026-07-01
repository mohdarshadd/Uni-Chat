import mongoose from 'mongoose';
import { Country } from './models/Country.js';
import { State } from './models/State.js';
import { City } from './models/City.js';
import { University } from './models/University.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/campus-chat';

const data = [
  {
    country: { name: 'United States', code: 'US' },
    states: [
      {
        name: 'California',
        cities: [
          {
            name: 'Los Angeles',
            universities: [
              'University of California, Los Angeles',
              'University of Southern California',
              'California State University, Los Angeles',
              'Loyola Marymount University',
            ],
          },
          {
            name: 'Berkeley',
            universities: [
              'University of California, Berkeley',
            ],
          },
          {
            name: 'Stanford',
            universities: [
              'Stanford University',
            ],
          },
          {
            name: 'San Diego',
            universities: [
              'University of California, San Diego',
              'San Diego State University',
            ],
          },
        ],
      },
      {
        name: 'New York',
        cities: [
          {
            name: 'New York City',
            universities: [
              'Columbia University',
              'New York University',
              'City University of New York',
              'Fordham University',
            ],
          },
          {
            name: 'Ithaca',
            universities: [
              'Cornell University',
            ],
          },
          {
            name: 'Rochester',
            universities: [
              'University of Rochester',
              'Rochester Institute of Technology',
            ],
          },
        ],
      },
      {
        name: 'Massachusetts',
        cities: [
          {
            name: 'Cambridge',
            universities: [
              'Harvard University',
              'Massachusetts Institute of Technology',
            ],
          },
          {
            name: 'Boston',
            universities: [
              'Boston University',
              'Northeastern University',
              'Boston College',
            ],
          },
        ],
      },
      {
        name: 'Illinois',
        cities: [
          {
            name: 'Chicago',
            universities: [
              'University of Chicago',
              'Northwestern University',
              'University of Illinois Chicago',
              'DePaul University',
            ],
          },
          {
            name: 'Evanston',
            universities: [
              'Northwestern University',
            ],
          },
        ],
      },
      {
        name: 'Texas',
        cities: [
          {
            name: 'Austin',
            universities: [
              'University of Texas at Austin',
            ],
          },
          {
            name: 'Houston',
            universities: [
              'Rice University',
              'University of Houston',
            ],
          },
          {
            name: 'Dallas',
            universities: [
              'Southern Methodist University',
              'University of Texas at Dallas',
            ],
          },
        ],
      },
      {
        name: 'Washington',
        cities: [
          {
            name: 'Seattle',
            universities: [
              'University of Washington',
              'Seattle University',
            ],
          },
        ],
      },
      {
        name: 'Pennsylvania',
        cities: [
          {
            name: 'Philadelphia',
            universities: [
              'University of Pennsylvania',
              'Drexel University',
              'Temple University',
            ],
          },
          {
            name: 'Pittsburgh',
            universities: [
              'Carnegie Mellon University',
              'University of Pittsburgh',
            ],
          },
        ],
      },
      {
        name: 'Michigan',
        cities: [
          {
            name: 'Ann Arbor',
            universities: [
              'University of Michigan',
            ],
          },
          {
            name: 'East Lansing',
            universities: [
              'Michigan State University',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'United Kingdom', code: 'GB' },
    states: [
      {
        name: 'England',
        cities: [
          {
            name: 'Oxford',
            universities: ['University of Oxford'],
          },
          {
            name: 'Cambridge',
            universities: ['University of Cambridge'],
          },
          {
            name: 'London',
            universities: [
              'Imperial College London',
              'University College London',
              'London School of Economics',
              'King\'s College London',
              'University of London',
            ],
          },
          {
            name: 'Manchester',
            universities: [
              'University of Manchester',
              'Manchester Metropolitan University',
            ],
          },
          {
            name: 'Birmingham',
            universities: [
              'University of Birmingham',
            ],
          },
          {
            name: 'Edinburgh',
            universities: [
              'University of Edinburgh',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'Canada', code: 'CA' },
    states: [
      {
        name: 'Ontario',
        cities: [
          {
            name: 'Toronto',
            universities: [
              'University of Toronto',
              'Ryerson University',
              'York University',
            ],
          },
          {
            name: 'Waterloo',
            universities: [
              'University of Waterloo',
            ],
          },
          {
            name: 'Ottawa',
            universities: [
              'University of Ottawa',
              'Carleton University',
            ],
          },
        ],
      },
      {
        name: 'British Columbia',
        cities: [
          {
            name: 'Vancouver',
            universities: [
              'University of British Columbia',
              'Simon Fraser University',
            ],
          },
        ],
      },
      {
        name: 'Quebec',
        cities: [
          {
            name: 'Montreal',
            universities: [
              'McGill University',
              'Université de Montréal',
              'Concordia University',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'Australia', code: 'AU' },
    states: [
      {
        name: 'New South Wales',
        cities: [
          {
            name: 'Sydney',
            universities: [
              'University of Sydney',
              'University of New South Wales',
              'University of Technology Sydney',
            ],
          },
        ],
      },
      {
        name: 'Victoria',
        cities: [
          {
            name: 'Melbourne',
            universities: [
              'University of Melbourne',
              'Monash University',
              'RMIT University',
            ],
          },
        ],
      },
      {
        name: 'Queensland',
        cities: [
          {
            name: 'Brisbane',
            universities: [
              'University of Queensland',
              'Queensland University of Technology',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'India', code: 'IN' },
    states: [
      {
        name: 'Maharashtra',
        cities: [
          {
            name: 'Mumbai',
            universities: [
              'University of Mumbai',
              'Indian Institute of Technology Bombay',
            ],
          },
          {
            name: 'Pune',
            universities: [
              'University of Pune',
              'Indian Institute of Science Education and Research Pune',
            ],
          },
        ],
      },
      {
        name: 'Karnataka',
        cities: [
          {
            name: 'Bengaluru',
            universities: [
              'Indian Institute of Science',
              'R V College of Engineering',
              'Bangalore University',
            ],
          },
        ],
      },
      {
        name: 'Delhi',
        cities: [
          {
            name: 'New Delhi',
            universities: [
              'University of Delhi',
              'Indian Institute of Technology Delhi',
              'Jawaharlal Nehru University',
            ],
          },
        ],
      },
      {
        name: 'Tamil Nadu',
        cities: [
          {
            name: 'Chennai',
            universities: [
              'Anna University',
              'Indian Institute of Technology Madras',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'Germany', code: 'DE' },
    states: [
      {
        name: 'Bavaria',
        cities: [
          {
            name: 'Munich',
            universities: [
              'Ludwig Maximilian University of Munich',
              'Technical University of Munich',
            ],
          },
        ],
      },
      {
        name: 'Berlin',
        cities: [
          {
            name: 'Berlin',
            universities: [
              'Humboldt University of Berlin',
              'Free University of Berlin',
              'Technical University of Berlin',
            ],
          },
        ],
      },
      {
        name: 'North Rhine-Westphalia',
        cities: [
          {
            name: 'Aachen',
            universities: [
              'RWTH Aachen University',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'France', code: 'FR' },
    states: [
      {
        name: 'Île-de-France',
        cities: [
          {
            name: 'Paris',
            universities: [
              'Sorbonne University',
              'Université Paris-Saclay',
              'École Polytechnique',
            ],
          },
        ],
      },
      {
        name: 'Auvergne-Rhône-Alpes',
        cities: [
          {
            name: 'Lyon',
            universities: [
              'Université Claude Bernard Lyon 1',
              'École Normale Supérieure de Lyon',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'Japan', code: 'JP' },
    states: [
      {
        name: 'Tokyo',
        cities: [
          {
            name: 'Tokyo',
            universities: [
              'University of Tokyo',
              'Tokyo Institute of Technology',
              'Waseda University',
              'Keio University',
            ],
          },
        ],
      },
      {
        name: 'Kyoto',
        cities: [
          {
            name: 'Kyoto',
            universities: [
              'Kyoto University',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'Singapore', code: 'SG' },
    states: [
      {
        name: 'Singapore',
        cities: [
          {
            name: 'Singapore',
            universities: [
              'National University of Singapore',
              'Nanyang Technological University',
            ],
          },
        ],
      },
    ],
  },
  {
    country: { name: 'United Arab Emirates', code: 'AE' },
    states: [
      {
        name: 'Dubai',
        cities: [
          {
            name: 'Dubai',
            universities: [
              'University of Dubai',
              'American University of Sharjah',
            ],
          },
        ],
      },
      {
        name: 'Abu Dhabi',
        cities: [
          {
            name: 'Abu Dhabi',
            universities: [
              'Khalifa University',
              'United Arab Emirates University',
            ],
          },
        ],
      },
    ],
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('[Seed] Connected to MongoDB');

  await Country.deleteMany({});
  await State.deleteMany({});
  await City.deleteMany({});
  await University.deleteMany({});
  console.log('[Seed] Cleared existing data');

  for (const entry of data) {
    const country = await Country.create(entry.country);
    console.log(`[Seed] Country: ${country.name}`);

    for (const stateEntry of entry.states) {
      const state = await State.create({
        name: stateEntry.name,
        countryId: country._id,
      });

      for (const cityEntry of stateEntry.cities) {
        const city = await City.create({
          name: cityEntry.name,
          stateId: state._id,
          countryId: country._id,
        });

        for (const uniName of cityEntry.universities) {
          const memberCount = Math.floor(Math.random() * 80) + 5;
          await University.create({
            name: uniName,
            cityId: city._id,
            stateId: state._id,
            countryId: country._id,
            memberCount,
          });
        }

        console.log(`  [Seed] City: ${city.name} (${cityEntry.universities.length} universities)`);
      }
    }
  }

  const counts = await Promise.all([
    Country.countDocuments(),
    State.countDocuments(),
    City.countDocuments(),
    University.countDocuments(),
  ]);

  console.log('[Seed] Done!');
  console.log(`  Countries: ${counts[0]}`);
  console.log(`  States: ${counts[1]}`);
  console.log(`  Cities: ${counts[2]}`);
  console.log(`  Universities: ${counts[3]}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('[Seed] Error:', err);
  process.exit(1);
});
