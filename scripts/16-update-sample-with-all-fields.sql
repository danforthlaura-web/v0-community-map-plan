-- Update first approved project with all form fields filled in
UPDATE projects
SET
  implementation_settings = ARRAY['School', 'Community learning center'],
  learner_types = ARRAY['Primary school students', 'Secondary school students', 'Teachers/Educators'],
  device_usage = ARRAY['Individual devices', 'Shared devices in rotation'],
  num_client_devices = '25-50',
  server_devices = ARRAY['Mini PC / Intel NUC', 'Raspberry Pi'],
  client_device_types = ARRAY['Tablets', 'Laptops', 'Desktop computers'],
  hardware_model = ARRAY['Endless OS'],
  blended_learning_model = ARRAY['Station rotation', 'Flipped classroom'],
  kolibri_usage_description = 'We use Kolibri as the primary digital learning platform in our rural schools where internet connectivity is limited. Teachers assign lessons and exercises through Kolibri for students to complete during computer lab time, and use the coach reports to track progress. Students particularly enjoy the interactive math exercises from Khan Academy and the science videos. We have also started using Kolibri for teacher professional development sessions after school hours.',
  uses_kolibri_studio = true,
  testimonials = '"Kolibri has transformed how we teach in areas without internet. Our students are now excited about learning and their test scores have improved significantly." - Head Teacher, Nairobi Primary School',
  contact_phone = '+254 712 345 678',
  number_of_students = 850,
  number_of_teachers = 32,
  channels_used = ARRAY['Khan Academy', 'CK-12', 'African Storybook', 'PhET Interactive Simulations', 'Pratham Books']
WHERE status = 'approved'
LIMIT 1;
