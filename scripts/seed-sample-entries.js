import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sampleEntries = [
  {
    name: 'Jane Kipchoge',
    email: 'jane@nairobitech.org',
    organization_name: 'Nairobi Tech Academy',
    location: 'Nairobi, Kenya',
    latitude: -1.2865,
    longitude: 36.8172,
    organization_website: 'https://nairobitech.org',
    start_year: '2021',
    implementation_settings: ['Rural areas', 'Public schools'],
    learner_types: ['K-12 students'],
    number_of_learners: '250',
    number_of_teachers: '15',
    device_usage: ['Individual learning', 'Group work'],
    server_devices: ['Raspberry Pi'],
    client_device_types: ['Tablets', 'Laptops'],
    hardware_model: ['Generic tablet', 'Generic laptop'],
    blended_learning_model: ['Online and offline'],
    kolibri_usage_description: 'We use Kolibri for offline-first learning in areas with limited connectivity. Students access educational content on tablets and laptops.',
    primary_language: 'English, Swahili',
    public_channels: 'Favorite Kolibri Library Channels',
    uses_kolibri_studio: true,
    testimonials: 'Kolibri has been transformative for our students. They can now access quality educational content even without internet.',
    reports: 'https://nairobitech.org/impact-report-2025.pdf',
    twitter_handle: '@nairobitech',
    facebook_handle: 'nairobitech',
    instagram_handle: 'nairobitech_academy',
    linkedin_handle: 'nairobi-tech-academy',
    forum_username: 'jane_kipchoge',
    other_social: '',
    receive_updates: true,
    email_visible: true,
    photo_url: '/sample-photos/entry-1.jpg',
    program_links: { primaryPartner: 'Khan Academy', secondaryPartner: 'Code.org' },
    status: 'approved',
    created_at: new Date('2026-01-15T10:30:00Z').toISOString(),
    updated_at: new Date('2026-01-20T14:22:00Z').toISOString(),
  },
  {
    name: 'Carlos Mendez',
    email: 'carlos@centroaprendizaje.co',
    organization_name: 'Centro de Aprendizaje Comunitario',
    location: 'Bogotá, Colombia',
    latitude: 4.7110,
    longitude: -74.0721,
    organization_website: 'https://centroaprendizaje.co',
    start_year: '2022',
    implementation_settings: ['Urban areas', 'Community centers'],
    learner_types: ['Adult learners'],
    number_of_learners: '75',
    number_of_teachers: '8',
    device_usage: ['Whole class instruction'],
    server_devices: ['Desktop computer'],
    client_device_types: ['Shared laptops'],
    hardware_model: ['Generic laptop'],
    blended_learning_model: ['In-person with digital support'],
    kolibri_usage_description: 'Used for whole-class instruction in vocational training programs. Students learn digital skills alongside technical vocations.',
    primary_language: 'Spanish',
    public_channels: 'Favorite Kolibri Library Channels',
    uses_kolibri_studio: false,
    testimonials: 'The community has gained digital literacy skills through Kolibri-based instruction. Life-changing opportunity for working adults.',
    reports: 'https://centroaprendizaje.co/training-outcomes-2025.pdf',
    twitter_handle: '@centroaprendizaje',
    facebook_handle: 'centroAprendizajeCol',
    instagram_handle: 'centro_aprendizaje_co',
    linkedin_handle: 'centro-de-aprendizaje-comunitario',
    forum_username: 'carlos_mendez',
    other_social: 'WhatsApp community group',
    receive_updates: true,
    email_visible: true,
    photo_url: '/sample-photos/entry-2.jpg',
    program_links: { primaryPartner: 'TED-Ed', secondaryPartner: 'MIT OpenCourseWare' },
    status: 'approved',
    created_at: new Date('2026-02-03T08:15:00Z').toISOString(),
    updated_at: new Date('2026-02-10T16:45:00Z').toISOString(),
  },
  {
    name: 'Priya Sharma',
    email: 'priya@ahmedabadlearning.in',
    organization_name: 'Ahmedabad Learning Hub',
    location: 'Ahmedabad, India',
    latitude: 23.0225,
    longitude: 72.5714,
    organization_website: 'https://ahmedabadlearning.in',
    start_year: '2020',
    implementation_settings: ['Urban slums', 'NGO centers'],
    learner_types: ['K-12 students', 'Out-of-school youth'],
    number_of_learners: '850',
    number_of_teachers: '35',
    device_usage: ['Individual learning', 'Group work', 'Whole class instruction'],
    server_devices: ['Raspberry Pi', 'Desktop computer'],
    client_device_types: ['Tablets', 'Laptops', 'Phones'],
    hardware_model: ['Generic tablet', 'Generic laptop', 'Budget smartphone'],
    blended_learning_model: ['Hybrid - mix of online, offline, and hybrid'],
    kolibri_usage_description: 'Large-scale deployment with multiple learning centers. Students use Kolibri for personalized learning, group projects, and teacher-led instruction. Content available in multiple Indian languages.',
    primary_language: 'English, Hindi, Gujarati',
    public_channels: 'Favorite Kolibri Library Channels',
    uses_kolibri_studio: true,
    testimonials: 'Kolibri has enabled us to provide quality education to over 800 students in underserved communities. The multilingual support is invaluable. Our students show 40% improvement in learning outcomes.',
    reports: 'https://ahmedabadlearning.in/annual-report-2025.pdf',
    twitter_handle: '@ahmedabadlearning',
    facebook_handle: 'ahmedabadlearninghub',
    instagram_handle: 'ahmedabad_learning_hub',
    linkedin_handle: 'ahmedabad-learning-hub',
    forum_username: 'priya_sharma',
    other_social: 'Telegram education channel',
    receive_updates: true,
    email_visible: true,
    photo_url: '/sample-photos/entry-3.jpg',
    program_links: { primaryPartner: 'Pratham OpenSchool', secondaryPartner: 'CK-12' },
    status: 'approved',
    created_at: new Date('2026-02-22T11:20:00Z').toISOString(),
    updated_at: new Date('2026-02-28T09:35:00Z').toISOString(),
  },
  {
    name: 'Dr. Emmanuel Okonkwo',
    email: 'emmanuel@refugeelearning.org',
    organization_name: 'Refugee Learning Initiative',
    location: 'Kampala, Uganda',
    latitude: 0.0236,
    longitude: 32.5735,
    organization_website: 'https://refugeelearning.org',
    start_year: '2024',
    implementation_settings: ['Refugee camps', 'Emergency response'],
    learner_types: ['K-12 students', 'Out-of-school children'],
    number_of_learners: '300',
    number_of_teachers: '12',
    device_usage: ['Group work'],
    server_devices: ['Raspberry Pi'],
    client_device_types: ['Tablets', 'Shared devices'],
    hardware_model: ['Low-cost tablet', 'Refurbished device'],
    blended_learning_model: ['Offline-first'],
    kolibri_usage_description: 'Emergency education provision in refugee camps. Using Kolibri with satellite internet for educational continuity. Focus on foundational literacy and numeracy.',
    primary_language: 'English, Swahili, Somali',
    public_channels: 'Favorite Kolibri Library Channels',
    uses_kolibri_studio: false,
    testimonials: 'In challenging circumstances, Kolibri provides consistent educational access. Children maintain learning continuity despite displacement.',
    reports: '',
    twitter_handle: '@refugeelearning',
    facebook_handle: 'refugeelearninginitiative',
    instagram_handle: 'refugee_learning',
    linkedin_handle: 'refugee-learning-initiative',
    forum_username: 'emmanuel_okonkwo',
    other_social: 'Refugee aid networks',
    receive_updates: true,
    email_visible: false,
    photo_url: '/sample-photos/entry-4.jpg',
    program_links: { primaryPartner: 'BBC Learning English', secondaryPartner: 'World Education Services' },
    status: 'pending',
    created_at: new Date('2026-03-20T13:45:00Z').toISOString(),
    updated_at: new Date('2026-03-20T13:45:00Z').toISOString(),
  },
];

async function seed() {
  try {
    console.log('Inserting sample entries...');
    
    const { data, error } = await supabase
      .from('submissions')
      .insert(sampleEntries)
      .select();

    if (error) {
      console.error('Error inserting data:', error);
      process.exit(1);
    }

    console.log(`Successfully inserted ${data.length} sample entries:`);
    data.forEach((entry, idx) => {
      console.log(`  ${idx + 1}. ${entry.organization_name} (${entry.status})`);
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

seed();
