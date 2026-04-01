import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const sampleEntries = [
  {
    organization_name: 'Nairobi Tech Academy',
    organization_location: { lat: -1.2865, lng: 36.8172 },
    primary_contact_name: 'Jane Kipchoge',
    primary_contact_email: 'jane@nairobitech.org',
    primary_contact_phone: '+254 712 345 678',
    organization_type: 'School',
    device_usage: ['Individual learning', 'Group work'],
    internet_type: 'Mobile network (e.g. Cellular)',
    internet_reliability: 'Consistent',
    kolibri_version: '0.17.0',
    monthly_active_users: 'Between 100-500',
    languages_supported: ['English', 'Swahili'],
    subjects_taught: ['Math', 'Science', 'Language Arts'],
    assessment_tools_used: 'Yes',
    community_channels: 'Khan Academy, Code.org',
    public_channels: 'Favorite Kolibri Library',
    additional_notes: 'Successfully serving rural communities with offline-first learning.',
    photo_url: '/sample-photos/entry-1.jpg',
    status: 'approved',
    created_at: new Date('2026-01-15T10:30:00Z').toISOString(),
    updated_at: new Date('2026-01-20T14:22:00Z').toISOString(),
  },
  {
    organization_name: 'Centro de Aprendizaje Comunitario - Colombia',
    organization_location: { lat: 4.7110, lng: -74.0721 },
    primary_contact_name: 'Carlos Mendez',
    primary_contact_email: 'carlos@centroaprendizaje.co',
    primary_contact_phone: '+57 301 555 8765',
    organization_type: 'Community Center',
    device_usage: ['Whole class instruction'],
    internet_type: 'Fixed broadband',
    internet_reliability: 'Intermittent',
    kolibri_version: '0.16.5',
    monthly_active_users: 'Between 50-100',
    languages_supported: ['Spanish'],
    subjects_taught: ['Math', 'Social Studies', 'Vocational Skills'],
    assessment_tools_used: 'Yes',
    community_channels: 'TED-Ed, MIT OpenCourseWare',
    public_channels: 'Favorite Kolibri Library',
    additional_notes: 'Teaching adults vocational skills with emphasis on digital literacy.',
    photo_url: '/sample-photos/entry-2.jpg',
    status: 'approved',
    created_at: new Date('2026-02-03T08:15:00Z').toISOString(),
    updated_at: new Date('2026-02-10T16:45:00Z').toISOString(),
  },
  {
    organization_name: 'Ahmedabad Learning Hub - India',
    organization_location: { lat: 23.0225, lng: 72.5714 },
    primary_contact_name: 'Priya Sharma',
    primary_contact_email: 'priya@ahmedabadlearning.in',
    primary_contact_phone: '+91 98765 43210',
    organization_type: 'NGO',
    device_usage: ['Individual learning', 'Group work', 'Whole class instruction'],
    internet_type: 'Fixed broadband',
    internet_reliability: 'Consistent',
    kolibri_version: '0.17.1',
    monthly_active_users: 'Between 500-1000',
    languages_supported: ['English', 'Hindi', 'Gujarati'],
    subjects_taught: ['Math', 'Science', 'Language Arts', 'Social Studies'],
    assessment_tools_used: 'Yes',
    community_channels: 'Pratham OpenSchool, CK-12',
    public_channels: 'Favorite Kolibri Library',
    additional_notes: 'Large-scale deployment serving underserved urban communities with multilingual support.',
    photo_url: '/sample-photos/entry-3.jpg',
    status: 'approved',
    created_at: new Date('2026-02-22T11:20:00Z').toISOString(),
    updated_at: new Date('2026-02-28T09:35:00Z').toISOString(),
  },
  {
    organization_name: 'Refugee Learning Initiative - Uganda (PENDING)',
    organization_location: { lat: 0.0236, lng: 32.5735 },
    primary_contact_name: 'Dr. Emmanuel Okonkwo',
    primary_contact_email: 'emmanuel@refugeelearning.org',
    primary_contact_phone: '+256 772 123 456',
    organization_type: 'NGO',
    device_usage: ['Group work'],
    internet_type: 'Satellite',
    internet_reliability: 'Inconsistent',
    kolibri_version: '0.17.0',
    monthly_active_users: 'Between 100-500',
    languages_supported: ['English', 'Swahili', 'Somali'],
    subjects_taught: ['Math', 'Language Arts', 'Life Skills'],
    assessment_tools_used: 'No',
    community_channels: 'BBC Learning English, World Education Services',
    public_channels: 'Favorite Kolibri Library',
    additional_notes: 'Supporting education access in refugee camps with limited connectivity.',
    photo_url: '/sample-photos/entry-4.jpg',
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
