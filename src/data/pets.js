export const mockPets = [
  {
    id: 'p1',
    name: 'Bella',
    type: 'Dog',
    breed: 'Labrador Retriever Mix',
    age: '2 years',
    description: 'Bella is a sweet and energetic girl looking for an active family.',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['kid-friendly', 'pet-friendly', 'energetic'],
    gender: 'Female',
  },
  {
    id: 'p2',
    name: 'Luna',
    type: 'Cat',
    breed: 'Domestic Shorthair',
    age: '1 year',
    description: 'Luna loves to cuddle and play with laser pointers.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['kid-friendly', 'lonely', 'affectionate'],
    gender: 'Female',
  },
  {
    id: 'p3',
    name: 'Max',
    type: 'Dog',
    breed: 'German Shepherd',
    age: '3 years',
    description: 'Max is very loyal and well-trained. He prefers being the only pet.',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['lonely', 'loyal', 'smart'],
    gender: 'Male',
  },
  {
    id: 'p4',
    name: 'Oliver',
    type: 'Cat',
    breed: 'Maine Coon',
    age: '4 years',
    description: 'Oliver is a gentle giant who loves lounging in the sun.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['kid-friendly', 'pet-friendly', 'chill'],
    gender: 'Male',
  },
  {
    id: 'p5',
    name: 'Daisy',
    type: 'Dog',
    breed: 'Beagle',
    age: '6 months',
    description: 'Daisy is a curious puppy who loves to explore by smelling everything!',
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Fixed Beagle image
    tags: ['pack attitude', 'kid-friendly', 'curious'],
    gender: 'Female',
  },
  {
    id: 'p6',
    name: 'Milo',
    type: 'Cat',
    breed: 'Siamese',
    age: '2 years',
    description: 'Milo is a vocal kitty who will tell you all about his day.',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['lonely', 'vocal', 'playful'],
    gender: 'Male',
  }
];

export const availableTags = [
  'kid-friendly', 
  'pet-friendly', 
  'lonely', 
  'pack attitude',
  'energetic',
  'affectionate',
  'loyal',
  'smart',
  'chill',
  'curious',
  'vocal',
  'playful'
];

export const missingPets = [
  {
    id: 'm1',
    name: 'Charlie',
    type: 'Dog',
    breed: 'Golden Retriever',
    description: 'Wearing a blue collar. Very friendly. Microchipped.',
    lastSeen: 'Pine Street Park, near the fountain',
    dateLost: '2026-07-24',
    contact: '(555) 123-4567',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'm2',
    name: 'Shadow',
    type: 'Cat',
    breed: 'Black Bombay',
    description: 'All black with yellow eyes. Skittish, do not chase.',
    lastSeen: '12th Avenue & Maple Drive',
    dateLost: '2026-07-22',
    contact: '(555) 987-6543',
    image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const foundPets = [
  {
    id: 'f1',
    type: 'Dog',
    breed: 'Terrier Mix',
    description: 'Found wandering. No collar, no microchip. Very energetic.',
    foundLocation: 'North Iowa Fairgrounds',
    dateFound: '2026-07-25',
    contact: 'swipets-user-89@email.com',
    image: 'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const socialFeed = [
  {
    id: 's1',
    platform: 'tiktok',
    type: 'video',
    author: '@swipets',
    content: 'Check out our newest arrivals playing in the yard! 🐶🎾 #adoptdontshop',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Dummy video placeholder
    likes: '1.2k',
    comments: '45'
  },
  {
    id: 's2',
    platform: 'instagram',
    type: 'image',
    author: '@swipets',
    content: 'Happy Tails! Luna found her forever home today! 🐾❤️ Thank you to the Smith family!',
    mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    likes: '342',
    comments: '12'
  },
  {
    id: 's3',
    platform: 'facebook',
    type: 'text',
    author: 'Swipets',
    content: 'We are in desperate need of wet kitten food! If you can spare a few cans, please drop them off at our headquarters. Thank you! 🙏',
    mediaUrl: null,
    likes: '89',
    comments: '5'
  }
];
