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
              'Sardar Patel Institute of Technology',
              'Veermata Jijabai Technological Institute',
              'S. P. Jain Institute of Management and Research',
            ],
          },
          {
            name: 'Pune',
            universities: [
              'University of Pune',
              'Indian Institute of Science Education and Research Pune',
              'College of Engineering Pune',
              'Symbiosis International University',
              'Flame University',
            ],
          },
          {
            name: 'Nagpur',
            universities: [
              'Visvesvaraya National Institute of Technology Nagpur',
              'Rashtrasant Tukadoji Maharaj Nagpur University',
              'Government College of Engineering Nagpur',
            ],
          },
          {
            name: 'Nashik',
            universities: [
              'Yashwantrao Chavan Maharashtra Open University',
              'Maharashtra Institute of Technology Nashik',
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
              'PES University',
              'BMS College of Engineering',
              'International Institute of Information Technology Bangalore',
              'National Institute of Design Bangalore',
            ],
          },
          {
            name: 'Mysuru',
            universities: [
              'University of Mysore',
              'National Institute of Engineering Mysore',
              'Sri Jayachamarajendra College of Engineering',
            ],
          },
          {
            name: 'Manipal',
            universities: [
              'Manipal Academy of Higher Education',
              'Manipal Institute of Technology',
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
              'Netaji Subhas University of Technology',
              'Delhi Technological University',
              'Indraprastha Institute of Information Technology Delhi',
              'Ambedkar University Delhi',
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
              'SRM Institute of Science and Technology',
              'Vellore Institute of Technology Chennai',
              'Madras Christian College',
              'Loyola College Chennai',
            ],
          },
          {
            name: 'Coimbatore',
            universities: [
              'Coimbatore Institute of Technology',
              'PSG College of Technology',
              'Avinashilingam University',
              'Bharathiar University',
            ],
          },
          {
            name: 'Madurai',
            universities: [
              'Madurai Kamaraj University',
              'Thiagarajar College of Engineering',
            ],
          },
        ],
      },
      {
        name: 'Telangana',
        cities: [
          {
            name: 'Hyderabad',
            universities: [
              'University of Hyderabad',
              'Indian Institute of Technology Hyderabad',
              'Osmania University',
              'International Institute of Information Technology Hyderabad',
              'Jawaharlal Nehru Technological University Hyderabad',
              'NALSAR University of Law',
            ],
          },
          {
            name: 'Warangal',
            universities: [
              'National Institute of Technology Warangal',
              'Kakatiya University',
            ],
          },
        ],
      },
      {
        name: 'West Bengal',
        cities: [
          {
            name: 'Kolkata',
            universities: [
              'Jadavpur University',
              'University of Calcutta',
              'Indian Institute of Management Calcutta',
              'Indian Statistical Institute Kolkata',
              'West Bengal University of Technology',
              'Presidency University Kolkata',
              'St. Xavier\'s College Kolkata',
            ],
          },
          {
            name: 'Kharagpur',
            universities: [
              'Indian Institute of Technology Kharagpur',
            ],
          },
        ],
      },
      {
        name: 'Uttar Pradesh',
        cities: [
          {
            name: 'Kanpur',
            universities: [
              'Indian Institute of Technology Kanpur',
              'Harcourt Butler Technical University Kanpur',
              'Chhatrapati Shahu Ji Maharaj University',
            ],
          },
          {
            name: 'Lucknow',
            universities: [
              'University of Lucknow',
              'Indian Institute of Management Lucknow',
              'Babasaheb Bhimrao Ambedkar University',
              'King George\'s Medical University',
              'Dr. Ram Manohar Lohia Institute of Medical Sciences',
              'Sanjay Gandhi Postgraduate Institute of Medical Sciences',
              'Era University',
              'Integral University',
              'Amity University Lucknow',
              'Shri Ramswaroop Memorial University',
              'Lucknow University Faculty of Law',
              'National Institute of Pharmaceutical Education and Research Lucknow',
              'Indian Institute of Technology Kanpur (Lucknow Campus)',
              'Central University of Karnataka (Lucknow Campus)',
              'Rajarshi Tandon Girls Degree College',
              'National PG College',
              'Shia Degree College',
              'Isabella Thoburn Degree College',
              'Mahila Mahavidyalaya',
              'Christ Church College',
              'Sri Jai Narain PG College',
              'Guru Nanak Girls Degree College',
              'D.A.V. PG College',
              'Awadh Girls Degree College',
              'Kanya Kubja PG College',
              'Shri Jai Narain Misra PG College',
              'Lucknow Christian Degree College',
              'Nari Shiksha Niketan Degree College',
              'Gurukul Degree College',
              'Loyola Degree College',
              'Bhagwati Degree College',
              'Maharana Pratap Degree College',
              'Dayanand Diwakar Degree College',
              'Sanjay Gandhi Degree College',
              'Arya Kanya Degree College',
              'Pt. Deen Dayal Upadhyaya Degree College',
              'Kanya Gurukul Degree College',
              'Swami Vivekanand Degree College',
              'Sardar Patel Degree College',
              'Jubilee Degree College',
              'Ram Dulare Degree College',
              'Rama Degree College',
              'Sita Ram Degree College',
              'Rajkiya Degree College',
              'Sahajanand Degree College',
              'Shri Guru Ram Rai Degree College',
              'Adarsh Degree College',
              'B.R. Ambedkar Degree College',
              'Chaudhary Charan Singh Degree College',
              'Devta Shukla Degree College',
              'Dr. Ambedkar Degree College',
              'Guru Ram Rai Degree College',
              'Jai Narain Degree College',
              'K.D. Degree College',
            ],
          },
          {
            name: 'Varanasi',
            universities: [
              'Banaras Hindu University',
              'Indian Institute of Technology Varanasi',
              'Sampurnanand Sanskrit University',
            ],
          },
          {
            name: 'Allahabad',
            universities: [
              'University of Allahabad',
              'Motilal Nehru National Institute of Technology Allahabad',
              'Indian Institute of Information Technology Allahabad',
            ],
          },
        ],
      },
      {
        name: 'Rajasthan',
        cities: [
          {
            name: 'Jaipur',
            universities: [
              'Malaviya National Institute of Technology Jaipur',
              'University of Rajasthan',
              'Birla Institute of Technology and Science Pilani',
              'Manipal University Jaipur',
              'JECRC University',
            ],
          },
          {
            name: 'Jodhpur',
            universities: [
              'Indian Institute of Technology Jodhpur',
              'Jai Narain Vyas University',
              'National Law University Jodhpur',
            ],
          },
        ],
      },
      {
        name: 'Gujarat',
        cities: [
          {
            name: 'Ahmedabad',
            universities: [
              'Indian Institute of Management Ahmedabad',
              'Nirma University',
              'Gujarat University',
              'Gujarat Technological University',
              'Dhirubhai Ambani Institute of Information and Communication Technology',
            ],
          },
          {
            name: 'Vadodara',
            universities: [
              'Maharaja Sayajirao University of Baroda',
              'Parul University',
              'Sumandeep Vidyapeeth',
            ],
          },
          {
            name: 'Surat',
            universities: [
              'Sardar Vallabhbhai National Institute of Technology Surat',
              'Veer Narmad South Gujarat University',
            ],
          },
        ],
      },
      {
        name: 'Andhra Pradesh',
        cities: [
          {
            name: 'Visakhapatnam',
            universities: [
              'Andhra University',
              'GITAM University',
              'Indian Institute of Management Visakhapatnam',
            ],
          },
          {
            name: 'Tirupati',
            universities: [
              'Sri Venkateswara University',
              'Indian Institute of Technology Tirupati',
            ],
          },
        ],
      },
      {
        name: 'Kerala',
        cities: [
          {
            name: 'Kochi',
            universities: [
              'Cochin University of Science and Technology',
              'National University of Advanced Legal Studies',
              'Sree Sankaracharya University of Sanskrit',
            ],
          },
          {
            name: 'Thiruvananthapuram',
            universities: [
              'University of Kerala',
              'Indian Institute of Space Science and Technology',
              'College of Engineering Trivandrum',
            ],
          },
          {
            name: 'Kozhikode',
            universities: [
              'University of Calicut',
              'National Institute of Technology Kozhikode',
            ],
          },
        ],
      },
      {
        name: 'Punjab',
        cities: [
          {
            name: 'Chandigarh',
            universities: [
              'Panjab University',
              'Punjab Engineering College',
              'University Institute of Engineering and Technology',
            ],
          },
          {
            name: 'Amritsar',
            universities: [
              'Guru Nanak Dev University',
              'Indian Institute of Technology Ropar',
            ],
          },
        ],
      },
      {
        name: 'Madhya Pradesh',
        cities: [
          {
            name: 'Indore',
            universities: [
              'Indian Institute of Technology Indore',
              'Devi Ahilya Vishwavidyalaya',
              'Sri Aurobindo Institute of Technology',
            ],
          },
          {
            name: 'Bhopal',
            universities: [
              'Maulana Azad National Institute of Technology Bhopal',
              'Barkatullah University',
              'Indian Institute of Science Education and Research Bhopal',
            ],
          },
        ],
      },
      {
        name: 'Odisha',
        cities: [
          {
            name: 'Bhubaneswar',
            universities: [
              'Indian Institute of Technology Bhubaneswar',
              'KIIT University',
              'Utkal University',
              'National Institute of Technology Rourkela',
            ],
          },
          {
            name: 'Cuttack',
            universities: [
              'Utkal University',
              'Sri Sri University',
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
