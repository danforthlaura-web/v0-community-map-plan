-- Add sample computer lab photo to the Global Education Initiative (Brazil) entry
UPDATE submissions
SET photo_url = '/images/sample-computer-lab.jpg'
WHERE organization_name = 'Global Education Initiative'
  AND country = 'Brazil';
