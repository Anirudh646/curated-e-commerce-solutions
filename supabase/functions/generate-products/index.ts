import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const productData: Record<string, {
  brands: string[];
  products: string[];
  suffixes: string[];
  priceRange: [number, number];
  images: string[];
  descriptions: string[];
}> = {
  Electronics: {
    brands: ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Sony', 'LG', 'Philips', 'Boat', 'JBL', 'Bose', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Canon', 'Nikon'],
    products: ['Smartphone', 'Laptop', 'Tablet', 'Smart TV', 'Headphones', 'Earbuds', 'Smartwatch', 'Power Bank', 'Bluetooth Speaker', 'Camera', 'Monitor', 'Keyboard', 'Mouse', 'Webcam', 'Router', 'Hard Drive', 'SSD', 'Printer', 'Projector', 'Gaming Console'],
    suffixes: ['Pro', 'Max', 'Ultra', 'Lite', 'Plus', 'Neo', 'Prime', 'Elite', 'X', 'S', 'SE', 'Mini', 'Air', '5G', '4K', 'HD', 'Wireless', 'Smart', 'Premium', 'Basic'],
    priceRange: [999, 199999],
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    ],
    descriptions: [
      'Experience cutting-edge technology with this premium device. Features advanced processors, stunning display, and long battery life. Ideal for work, entertainment, and staying connected on the go.',
      'Built with precision engineering and premium materials. Offers seamless performance, crystal-clear audio/visuals, and intuitive controls. Perfect for tech enthusiasts who demand the best.',
      'Smart technology meets elegant design. Packed with innovative features, AI-powered enhancements, and energy-efficient performance. A must-have for the modern Indian household.',
    ]
  },
  Fashion: {
    brands: ['Royal', 'Urban', 'Classic', 'Fabindia', 'Manyavar', 'Raymond', 'Allen Solly', 'Peter England', 'Van Heusen', 'Louis Philippe', 'W', 'Biba', 'Aurelia', 'Global Desi', 'AND', 'Anouk', 'Libas', 'Kalini', 'Sangria', 'Varanga'],
    products: ['Kurta', 'Saree', 'Lehenga', 'Sherwani', 'Jacket', 'Blazer', 'Jeans', 'T-Shirt', 'Shirt', 'Dress', 'Kurti', 'Palazzo', 'Salwar Suit', 'Anarkali', 'Dhoti', 'Churidar', 'Dupatta', 'Stole', 'Shawl', 'Cardigan'],
    suffixes: ['Collection', 'Edition', 'Series', 'Embroidered', 'Printed', 'Plain', 'Striped', 'Checked', 'Floral', 'Geometric', 'Abstract', 'Solid', 'Ombre', 'Tie-Dye', 'Block Print', 'Handloom', 'Silk Blend', 'Cotton', 'Chiffon', 'Georgette'],
    priceRange: [299, 25999],
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=400',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
      'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=400',
    ],
    descriptions: [
      'Exquisite Indian craftsmanship meets contemporary fashion. Made with premium fabrics, intricate detailing, and comfortable fits. Perfect for festivals, weddings, and special occasions.',
      'Celebrate Indian heritage with this beautifully designed piece. Features traditional motifs, vibrant colors, and superior fabric quality. A timeless addition to your wardrobe.',
      'Modern silhouettes with traditional Indian aesthetics. Lightweight, breathable fabric with elegant finishing. Suitable for both casual outings and formal gatherings.',
    ]
  },
  Accessories: {
    brands: ['Titan', 'Fastrack', 'Lavie', 'Hidesign', 'Wildcraft', 'American Tourister', 'Samsonite', 'Ray-Ban', 'Fossil', 'Daniel Wellington', 'Casio', 'Timex', 'Caprese', 'Baggit', 'Da Milano', 'Skybags', 'Safari', 'VIP', 'Lino Perros', 'Chumbak'],
    products: ['Watch', 'Handbag', 'Wallet', 'Belt', 'Sunglasses', 'Backpack', 'Laptop Bag', 'Clutch', 'Sling Bag', 'Tote Bag', 'Travel Bag', 'Duffle Bag', 'Briefcase', 'Messenger Bag', 'Crossbody Bag', 'Makeup Pouch', 'Card Holder', 'Key Chain', 'Scarf', 'Cap'],
    suffixes: ['Premium', 'Classic', 'Sport', 'Leather', 'Canvas', 'Designer', 'Casual', 'Formal', 'Travel', 'Everyday', 'Limited Edition', 'Signature', 'Heritage', 'Urban', 'Adventure', 'Executive', 'Compact', 'Spacious', 'Slim', 'Vintage'],
    priceRange: [199, 15999],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400',
      'https://images.unsplash.com/photo-1509941943102-10c232fc1f89?w=400',
      'https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=400',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400',
      'https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?w=400',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400',
      'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400',
    ],
    descriptions: [
      'Elevate your style with this premium accessory. Crafted from finest materials with attention to detail. Designed for the modern Indian professional who values both form and function.',
      'A perfect blend of style and functionality. Durable construction with elegant aesthetics. Ideal for daily use, travel, and making a lasting impression.',
    ]
  },
  Home: {
    brands: ['HomeTown', 'Urban Ladder', 'Pepperfry', 'Nilkamal', 'Godrej', 'Durian', 'Sleepwell', 'Wakefit', 'Bombay Dyeing', 'Welspun', 'Spaces', 'Raymond', 'Portico', "D'Decor", 'Trident', 'Story@Home', 'Cortina', 'Swayam', 'Maspar', 'Status'],
    products: ['Bedsheet', 'Curtains', 'Cushion Cover', 'Sofa Cover', 'Mattress', 'Pillow', 'Blanket', 'Comforter', 'Towel Set', 'Carpet', 'Rug', 'Lamp', 'Photo Frame', 'Wall Clock', 'Vase', 'Showpiece', 'Storage Box', 'Organizer', 'Kitchen Set', 'Dinner Set'],
    suffixes: ['King Size', 'Queen Size', 'Double', 'Single', 'Cotton', 'Silk', 'Satin', 'Velvet', 'Jacquard', 'Microfiber', 'Memory Foam', 'Orthopedic', 'Decorative', 'Modern', 'Traditional', 'Ethnic', 'Minimal', 'Rustic', 'Bohemian', 'Contemporary'],
    priceRange: [199, 49999],
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400',
      'https://images.unsplash.com/photo-1484101403633-571e4d9cf6e4?w=400',
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400',
      'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=400',
      'https://images.unsplash.com/photo-1560185009-5bf9f2849488?w=400',
    ],
    descriptions: [
      'Transform your living space with this elegant home essential. Premium quality materials ensure durability and comfort. Adds a touch of sophistication to any room.',
      'Designed for the modern Indian home. Combines traditional aesthetics with contemporary functionality. Easy to maintain and built to last for years.',
    ]
  },
  Sports: {
    brands: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Decathlon', 'Yonex', 'Cosco', 'Nivia', 'Vector X', 'SG', 'SS', 'MRF', 'Spartan', 'GM', 'Kookaburra', 'Gray Nicolls', 'DSC', 'BDM', 'SF'],
    products: ['Running Shoes', 'Football', 'Cricket Bat', 'Badminton Racket', 'Tennis Racket', 'Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Gym Gloves', 'Sports Bra', 'Track Pants', 'Sports Shorts', 'Jersey', 'Cycling Gear', 'Swimming Goggles', 'Knee Pad', 'Ankle Support', 'Fitness Tracker', 'Jump Rope', 'Pull Up Bar'],
    suffixes: ['Pro', 'Elite', 'Tournament', 'Training', 'Match', 'Practice', 'Beginner', 'Advanced', 'Professional', 'Lightweight', 'Heavy Duty', 'Breathable', 'Sweat-proof', 'Anti-slip', 'Adjustable', 'Portable', 'Compact', 'Premium', 'Standard', 'Deluxe'],
    priceRange: [199, 29999],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
      'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400',
      'https://images.unsplash.com/photo-1599586120429-48281b6f0ece?w=400',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
    ],
    descriptions: [
      'Engineered for peak performance. Built with advanced materials for maximum comfort, grip, and durability. Whether you are a beginner or professional, this gear elevates your game.',
      'Stay fit and active with this premium sports equipment. Designed for Indian athletes and fitness enthusiasts. Tested for quality and built for endurance.',
    ]
  },
  Beauty: {
    brands: ['Lakme', 'Maybelline', 'LOreal', 'MAC', 'Nykaa', 'Colorbar', 'Biotique', 'Himalaya', 'Forest Essentials', 'Kama Ayurveda', 'Plum', 'Mamaearth', 'WOW', 'MCaffeine', 'The Body Shop', 'Bath & Body Works', 'Nivea', 'Dove', 'Neutrogena', 'Olay'],
    products: ['Lipstick', 'Foundation', 'Mascara', 'Eyeliner', 'Face Wash', 'Moisturizer', 'Sunscreen', 'Serum', 'Face Mask', 'Hair Oil', 'Shampoo', 'Conditioner', 'Body Lotion', 'Perfume', 'Nail Polish', 'Compact Powder', 'Blush', 'Highlighter', 'Primer', 'Setting Spray'],
    suffixes: ['Matte', 'Glossy', 'Long-lasting', 'Waterproof', 'Natural', 'Organic', 'Ayurvedic', 'Herbal', 'Vitamin C', 'Retinol', 'Hyaluronic', 'SPF 50', 'Hydrating', 'Anti-aging', 'Brightening', 'Deep Cleanse', 'Gentle', 'Intensive', 'Daily Care', 'Night Repair'],
    priceRange: [99, 9999],
    images: [
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400',
    ],
    descriptions: [
      'Unveil your natural beauty with this premium product. Formulated with nourishing ingredients suited for Indian skin types. Dermatologically tested and cruelty-free.',
      'Inspired by ancient Ayurvedic wisdom combined with modern science. Gentle yet effective formula for radiant, healthy skin. Free from harmful chemicals and parabens.',
    ]
  },
  Kitchen: {
    brands: ['Prestige', 'Pigeon', 'Bajaj', 'Philips', 'Morphy Richards', 'Wonderchef', 'Hawkins', 'Butterfly', 'Preethi', 'Borosil', 'Milton', 'Cello', 'Signoraware', 'Tupperware', 'Corelle', 'Vinod', 'Stovekraft', 'TTK', 'Elica', 'Faber'],
    products: ['Pressure Cooker', 'Mixer Grinder', 'Induction Cooktop', 'Microwave', 'Toaster', 'Air Fryer', 'Electric Kettle', 'Water Purifier', 'Lunch Box', 'Water Bottle', 'Casserole', 'Cookware Set', 'Kadhai', 'Tawa', 'Pan Set', 'Knife Set', 'Cutting Board', 'Storage Container', 'Spice Rack', 'Chimney'],
    suffixes: ['Stainless Steel', 'Non-stick', 'Cast Iron', 'Aluminium', 'Ceramic', 'Glass', 'BPA Free', 'Leak Proof', '3L', '5L', '750W', '1000W', 'Automatic', 'Manual', 'Digital', 'Smart', 'Portable', 'Heavy Base', 'Induction Base', 'Dishwasher Safe'],
    priceRange: [199, 39999],
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
      'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400',
      'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400',
      'https://images.unsplash.com/photo-1622372738946-62e02505e7a9?w=400',
      'https://images.unsplash.com/photo-1595356700395-6f14b5c1f33f?w=400',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400',
      'https://images.unsplash.com/photo-1610701596061-2ecf227e85b2?w=400',
    ],
    descriptions: [
      'Essential kitchen companion for the Indian household. Built with food-grade materials and designed for daily Indian cooking. Energy efficient and easy to clean.',
      'Make cooking a joy with this innovative kitchen appliance. Handles everything from quick chai to elaborate biryani. ISI certified with comprehensive warranty.',
    ]
  },
  Books: {
    brands: ['Penguin', 'HarperCollins', 'Rupa', 'Scholastic', 'Westland', 'Juggernaut', 'Aleph', 'Speaking Tiger', 'Hachette', 'Pan Macmillan', 'S Chand', 'Arihant', 'Disha', 'MTG', 'Oswaal', 'Pearson', 'Oxford', 'Cambridge', 'McGraw Hill', 'Cengage'],
    products: ['Novel', 'Biography', 'Self Help Book', 'Business Book', 'Cookbook', 'Children Book', 'Comic Book', 'Study Guide', 'Practice Book', 'Textbook', 'Dictionary', 'Encyclopedia', 'Poetry Collection', 'Short Stories', 'Thriller', 'Romance', 'Fantasy', 'Science Fiction', 'History Book', 'Art Book'],
    suffixes: ['Bestseller', 'Award Winner', 'New Edition', 'Illustrated', 'Hardcover', 'Paperback', 'Collector Edition', 'Signed Copy', 'Bundle', 'Box Set', 'Complete Series', 'Revised', 'Annotated', 'Abridged', 'Unabridged', 'Large Print', 'Kindle Edition', 'Audiobook', 'Limited Edition', 'Special Edition'],
    priceRange: [99, 2999],
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400',
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
      'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
      'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400',
      'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    ],
    descriptions: [
      'A captivating read that transports you to new worlds. Beautifully written with rich narratives and compelling characters. A must-have for every bookshelf.',
      'Expand your knowledge with this insightful publication. Well-researched content presented in an engaging format. Perfect for students, professionals, and curious minds.',
    ]
  },
  Toys: {
    brands: ['Funskool', 'Mattel', 'Hasbro', 'LEGO', 'Hot Wheels', 'Barbie', 'Fisher-Price', 'Nerf', 'Play-Doh', 'Monopoly', 'Toyzone', 'Webby', 'Smartivity', 'Einstein Box', 'Skillmatics', 'Imagimake', 'Chalk and Chuckles', 'Shumee', 'Pikaboo', 'Zephyr'],
    products: ['Building Blocks', 'Remote Control Car', 'Doll', 'Action Figure', 'Board Game', 'Puzzle', 'Art Set', 'Science Kit', 'Musical Toy', 'Soft Toy', 'Educational Toy', 'Ride On', 'Kitchen Set', 'Doctor Set', 'Tool Set', 'Train Set', 'Racing Track', 'Robot Toy', 'Drone', 'Telescope'],
    suffixes: ['Deluxe', 'Starter Pack', 'Complete Set', 'Educational', 'Battery Operated', 'Rechargeable', 'Wooden', 'Plastic', 'Eco-friendly', 'Safe', 'Interactive', 'Learning', 'Creative', 'STEM', 'Montessori', 'Age 3+', 'Age 5+', 'Age 8+', 'Family', 'Multiplayer'],
    priceRange: [149, 9999],
    images: [
      'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400',
      'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
      'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400',
      'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=400',
      'https://images.unsplash.com/photo-1555448248-2571daf6344b?w=400',
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
      'https://images.unsplash.com/photo-1594652634010-275456c808d0?w=400',
      'https://images.unsplash.com/photo-1560859251-d563a49c5e4a?w=400',
      'https://images.unsplash.com/photo-1609372332255-611485350f25?w=400',
    ],
    descriptions: [
      'Hours of fun and learning for children. Made with child-safe, non-toxic materials. Develops creativity, motor skills, and cognitive abilities through play.',
      'The perfect gift for young minds. Encourages imagination and hands-on learning. BIS certified and tested for safety standards.',
    ]
  },
  Footwear: {
    brands: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata', 'Liberty', 'Woodland', 'Red Tape', 'Hush Puppies', 'Clarks', 'Metro', 'Mochi', 'Inc.5', 'Crocs', 'Skechers', 'New Balance', 'Asics', 'Fila', 'Campus', 'Lotto'],
    products: ['Sneakers', 'Running Shoes', 'Formal Shoes', 'Sandals', 'Slippers', 'Loafers', 'Boots', 'Heels', 'Flats', 'Sports Shoes', 'Casual Shoes', 'Flip Flops', 'Mules', 'Wedges', 'Oxfords', 'Brogues', 'Espadrilles', 'Clogs', 'Kolhapuris', 'Juttis'],
    suffixes: ['Leather', 'Canvas', 'Mesh', 'Suede', 'Synthetic', 'Memory Foam', 'Orthopedic', 'Lightweight', 'Waterproof', 'Slip-on', 'Lace-up', 'Velcro', 'Comfort Fit', 'Wide Fit', 'Narrow Fit', 'Breathable', 'Anti-skid', 'Cushioned', 'Arch Support', 'Flexible'],
    priceRange: [299, 19999],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=400',
      'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=400',
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400',
    ],
    descriptions: [
      'Step out in style and comfort. Ergonomically designed with premium materials for all-day wear. Perfect for Indian weather conditions and diverse terrains.',
      'Where fashion meets comfort. Advanced cushioning technology with stylish design. Ideal for work, walks, and weekend outings.',
    ]
  },
  Groceries: {
    brands: ['Tata', 'Aashirvaad', 'Fortune', 'Patanjali', 'MDH', 'Everest', 'Saffola', 'Dabur', 'Amul', 'Mother Dairy', 'Haldirams', 'Bikaji', 'Paper Boat', 'Raw Pressery', 'Organic Tattva', 'BB Royal', '24 Mantra', 'Pro Nature', 'True Elements', 'Happilo'],
    products: ['Basmati Rice', 'Atta', 'Cooking Oil', 'Ghee', 'Masala Pack', 'Tea', 'Coffee', 'Dry Fruits Mix', 'Honey', 'Pickle', 'Papad', 'Namkeen', 'Biscuits', 'Instant Noodles', 'Oats', 'Muesli', 'Protein Bar', 'Juice', 'Jam', 'Peanut Butter'],
    suffixes: ['1kg', '5kg', '500g', '250ml', '1L', 'Organic', 'Premium', 'Gold', 'Extra Long', 'Whole Wheat', 'Multi Grain', 'Sugar Free', 'Low Fat', 'Cold Pressed', 'Virgin', 'Roasted', 'Salted', 'Unsalted', 'Family Pack', 'Value Pack'],
    priceRange: [29, 2999],
    images: [
      'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      'https://images.unsplash.com/photo-1607623488502-286bbc4e4506?w=400',
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
      'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400',
      'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1604503468506-a8da13d82571?w=400',
      'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400',
      'https://images.unsplash.com/photo-1571748982800-fa51082c2224?w=400',
    ],
    descriptions: [
      'Premium quality grocery essentials for the Indian kitchen. Sourced from trusted farms and processed with care. FSSAI certified and hygienically packed.',
      'Taste the authentic flavors of India. No artificial preservatives or colors. Perfect for everyday cooking and special recipes.',
    ]
  },
  Automotive: {
    brands: ['Bosch', '3M', 'Amaron', 'Exide', 'CEAT', 'MRF', 'Apollo', 'JK Tyre', 'Castrol', 'Shell', 'Motul', 'Philips', 'Osram', 'Wurth', 'Meguiars', 'Sonax', 'Lumax', 'Valeo', 'Denso', 'NGK'],
    products: ['Car Battery', 'Tyre', 'Engine Oil', 'Car Cover', 'Dash Camera', 'Car Perfume', 'Seat Cover', 'Floor Mat', 'Steering Cover', 'Phone Mount', 'Car Charger', 'Air Purifier', 'Wiper Blade', 'Headlight Bulb', 'Car Polish', 'Tool Kit', 'Tyre Inflator', 'Jump Starter', 'GPS Navigator', 'Reverse Camera'],
    suffixes: ['Universal', 'Premium', 'Heavy Duty', 'All Weather', 'Anti-skid', 'Leather', 'PU', 'Waterproof', '12V', '24V', 'Automatic', 'Digital', 'Wireless', 'HD', 'LED', 'Halogen', 'Synthetic', 'Semi Synthetic', 'Mineral', 'Long Life'],
    priceRange: [199, 49999],
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400',
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400',
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=400',
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?w=400',
      'https://images.unsplash.com/photo-1449130320325-b983d8e52c48?w=400',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400',
    ],
    descriptions: [
      'Keep your vehicle in top condition with this premium automotive accessory. Engineered for Indian road conditions and climate. Easy installation with comprehensive warranty.',
      'Upgrade your driving experience with top-quality automotive gear. Compatible with most Indian car models. Tested for safety and performance.',
    ]
  },
  'Health & Wellness': {
    brands: ['HealthKart', 'MuscleBlaze', 'Optimum Nutrition', 'Himalaya', 'Dabur', 'Patanjali', 'Ensure', 'Horlicks', 'Bournvita', 'Protinex', 'Amway', 'Herbalife', 'GNC', 'MyProtein', 'Kapiva', 'Zandu', 'Baidyanath', 'Dr Morepen', 'Accu-Chek', 'Omron'],
    products: ['Whey Protein', 'Multivitamin', 'Fish Oil', 'Ashwagandha', 'Triphala', 'Immunity Booster', 'Weight Gainer', 'BCAA', 'Pre Workout', 'Protein Bar', 'Green Tea', 'Apple Cider Vinegar', 'Blood Pressure Monitor', 'Glucometer', 'Thermometer', 'Pulse Oximeter', 'Weighing Scale', 'Massager', 'Yoga Block', 'Resistance Band'],
    suffixes: ['1kg', '2kg', '500g', '60 Tablets', '120 Capsules', 'Chocolate', 'Vanilla', 'Unflavored', 'Sugar Free', 'Vegan', 'Organic', 'Ayurvedic', 'Natural', 'Clinical', 'Digital', 'Automatic', 'Portable', 'Rechargeable', 'Professional', 'Home Use'],
    priceRange: [149, 14999],
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
      'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400',
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400',
    ],
    descriptions: [
      'Invest in your health with this premium wellness product. Formulated with clinically proven ingredients. GMP certified and lab tested for purity and potency.',
      'Holistic health solution inspired by Indian Ayurvedic traditions. Safe, effective, and suitable for daily use. Supports overall well-being and vitality.',
    ]
  },
  Stationery: {
    brands: ['Classmate', 'Navneet', 'Camlin', 'Faber-Castell', 'Staedtler', 'Doms', 'Pilot', 'Parker', 'Cello', 'Reynolds', 'Nataraj', 'Apsara', 'Luxor', 'Uni-ball', 'Sakura', 'Pentel', 'Kokuyo', 'Linc', 'Montex', 'Add Gel'],
    products: ['Notebook', 'Pen Set', 'Pencil Box', 'Geometry Box', 'Color Pencils', 'Sketch Pens', 'Watercolors', 'Canvas', 'Diary', 'Planner', 'Sticky Notes', 'Highlighters', 'Whiteboard Marker', 'Stapler', 'Calculator', 'Globe', 'Desk Organizer', 'File Folder', 'Eraser Pack', 'Sharpener'],
    suffixes: ['Pack of 5', 'Pack of 10', 'Pack of 12', '200 Pages', '400 Pages', 'A4', 'A5', 'Ruled', 'Unruled', 'Graph', 'Premium', 'Student', 'Office', 'Artist Grade', 'Professional', 'Gift Set', 'Value Pack', 'Eco-friendly', 'Recycled', 'Long Lasting'],
    priceRange: [19, 2999],
    images: [
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400',
      'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400',
      'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400',
      'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400',
      'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400',
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400',
      'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    ],
    descriptions: [
      'Essential stationery for students and professionals. Smooth writing experience with durable materials. Made in India with quality craftsmanship.',
      'Unleash your creativity with these premium art and stationery supplies. Vibrant colors, smooth textures, and eco-friendly materials. Perfect for school, office, or creative projects.',
    ]
  },
  'Pet Supplies': {
    brands: ['Pedigree', 'Whiskas', 'Royal Canin', 'Drools', 'Farmina', 'Arden Grange', 'Sheba', 'Kennel Kitchen', 'Meat Up', 'Jerhigh', 'Choostix', 'Glenand', 'Savic', 'Trixie', 'Ferplast', 'Furhaven', 'Kong', 'Nylabone', 'Hartz', 'Heads Up For Tails'],
    products: ['Dog Food', 'Cat Food', 'Pet Bed', 'Leash', 'Collar', 'Pet Shampoo', 'Chew Toy', 'Scratching Post', 'Feeding Bowl', 'Water Fountain', 'Pet Carrier', 'Grooming Kit', 'Flea Treatment', 'Dental Stick', 'Training Pads', 'Litter Box', 'Cat Litter', 'Bird Cage', 'Fish Tank', 'Aquarium Filter'],
    suffixes: ['Adult', 'Puppy', 'Kitten', 'Senior', 'Small Breed', 'Large Breed', '1kg', '3kg', '10kg', 'Grain Free', 'Chicken', 'Fish', 'Lamb', 'Vegetarian', 'Hypoallergenic', 'Medicated', 'Natural', 'Organic', 'Premium', 'Value Pack'],
    priceRange: [99, 9999],
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400',
      'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400',
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400',
      'https://images.unsplash.com/photo-1537151608828-ea2b11305ee2?w=400',
      'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    ],
    descriptions: [
      'Give your furry friend the best with this premium pet product. Vet recommended and made with safe, natural ingredients. Suitable for all breeds and life stages.',
      'Show your pet some love with this carefully crafted product. Designed for comfort, health, and happiness. Trusted by pet parents across India.',
    ]
  },
  'Garden & Outdoor': {
    brands: ['Kraft Seeds', 'Ugaoo', 'Nurserylive', 'Garden Aid', 'TrustBasket', 'Cocogarden', 'Sharpex', 'Bosch Garden', 'Black+Decker', 'Husqvarna', 'Stihl', 'Green India', 'Plantzilla', 'MyBageecha', 'Rolling Nature', 'Ferns N Petals', 'Root Bridges', 'Greenkin', 'Pot-O-Licious', 'Verde'],
    products: ['Plant Pot', 'Seeds Pack', 'Garden Tool Set', 'Watering Can', 'Lawn Mower', 'Garden Hose', 'Compost Bin', 'Plant Stand', 'Hanging Planter', 'Soil Mix', 'Fertilizer', 'Pesticide', 'Bird Feeder', 'Solar Light', 'Outdoor Chair', 'Hammock', 'Tent', 'BBQ Grill', 'Umbrella', 'Fountain'],
    suffixes: ['Ceramic', 'Terracotta', 'Plastic', 'Metal', 'Wooden', 'Solar Powered', 'Organic', 'Natural', 'Heavy Duty', 'Foldable', 'Weather Resistant', 'UV Protected', 'Large', 'Medium', 'Small', 'Set of 3', 'Set of 6', 'Premium', 'Starter Kit', 'Professional'],
    priceRange: [49, 19999],
    images: [
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
      'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400',
      'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=400',
      'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400',
      'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400',
      'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
      'https://images.unsplash.com/photo-1416453072034-c8dbfa2856b5?w=400',
      'https://images.unsplash.com/photo-1585255318859-f5c15f4cffe9?w=400',
      'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=400',
    ],
    descriptions: [
      'Bring nature closer to home with this gardening essential. Perfect for Indian climate and soil conditions. Eco-friendly and sustainable choice for green living.',
      'Create your dream garden with premium outdoor products. Durable, weather-resistant, and designed for Indian conditions. Ideal for balconies, terraces, and backyards.',
    ]
  },
}

const badges = ['New', 'Sale', 'Bestseller', 'Limited', 'Trending', 'Hot Deal', null, null, null, null]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function getRandomPrice(min: number, max: number): number {
  const base = Math.floor(Math.random() * (max - min) + min)
  const ending = [9, 49, 99, 199, 299, 499, 999][Math.floor(Math.random() * 7)]
  return Math.floor(base / 100) * 100 + ending
}

function generateProduct(index: number) {
  const categories = Object.keys(productData)
  const category = categories[index % categories.length]
  const data = productData[category]
  
  const brand = getRandomElement(data.brands)
  const product = getRandomElement(data.products)
  const suffix = getRandomElement(data.suffixes)
  
  const name = `${brand} ${product} ${suffix}`
  const price = getRandomPrice(data.priceRange[0], data.priceRange[1])
  const hasDiscount = Math.random() > 0.6
  const originalPrice = hasDiscount ? Math.round(price * (1 + Math.random() * 0.4)) : null
  const description = getRandomElement(data.descriptions)
  const stockVal = Math.floor(Math.random() * 100)
  
  return {
    name,
    price,
    original_price: originalPrice,
    image_url: getRandomElement(data.images),
    category,
    description: `${description} Product: ${name}. Brand: ${brand}. Category: ${category}.`,
    rating: Math.round((3.0 + Math.random() * 2.0) * 10) / 10,
    reviews_count: Math.floor(Math.random() * 1000) + 5,
    stock: stockVal,
    badge: getRandomElement(badges),
    is_active: true
  }
}

function generateProductImages(productId: string, categoryImages: string[]) {
  const count = Math.floor(Math.random() * 3) + 2 // 2-4 images per product
  const selectedImages = getRandomElements(categoryImages, count)
  return selectedImages.map((url, i) => ({
    product_id: productId,
    image_url: url,
    display_order: i,
    alt_text: `Product image ${i + 1}`
  }))
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { batchSize = 1000, startIndex = 0, withImages = true } = await req.json().catch(() => ({}))
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const products = []
    const maxBatch = Math.min(batchSize, 1000)
    
    for (let i = 0; i < maxBatch; i++) {
      products.push(generateProduct(startIndex + i))
    }

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select('id, category')

    if (error) throw error

    let imagesInserted = 0
    if (withImages && data && data.length > 0) {
      const allImages: any[] = []
      for (const prod of data) {
        const catData = productData[prod.category]
        if (catData) {
          allImages.push(...generateProductImages(prod.id, catData.images))
        }
      }
      // Insert images in batches of 500
      for (let i = 0; i < allImages.length; i += 500) {
        const batch = allImages.slice(i, i + 500)
        const { error: imgError } = await supabase.from('product_images').insert(batch)
        if (imgError) console.error('Image insert error:', imgError)
        else imagesInserted += batch.length
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: data?.length || 0,
        imagesInserted,
        nextIndex: startIndex + maxBatch,
        message: `Inserted ${data?.length || 0} products with ${imagesInserted} gallery images.`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
