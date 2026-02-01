import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Indian product names by category
const productData = {
  Electronics: {
    prefixes: ['Samsung', 'Apple', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'Oppo', 'Sony', 'LG', 'Philips', 'Boat', 'JBL', 'Bose', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Canon', 'Nikon'],
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
    ]
  },
  Fashion: {
    prefixes: ['Royal', 'Urban', 'Classic', 'Modern', 'Ethnic', 'Traditional', 'Designer', 'Premium', 'Luxury', 'Casual', 'Formal', 'Sports', 'Trendy', 'Vintage', 'Bohemian', 'Minimalist', 'Handcrafted', 'Artisan', 'Contemporary', 'Elegant'],
    products: ['Kurta', 'Saree', 'Lehenga', 'Sherwani', 'Jacket', 'Blazer', 'Jeans', 'T-Shirt', 'Shirt', 'Dress', 'Kurti', 'Palazzo', 'Salwar Suit', 'Anarkali', 'Dhoti', 'Churidar', 'Dupatta', 'Stole', 'Shawl', 'Cardigan'],
    suffixes: ['Collection', 'Edition', 'Series', 'Style', 'Design', 'Pattern', 'Print', 'Embroidered', 'Printed', 'Plain', 'Striped', 'Checked', 'Floral', 'Geometric', 'Abstract', 'Solid', 'Ombre', 'Tie-Dye', 'Block Print', 'Handloom'],
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
    ]
  },
  Accessories: {
    prefixes: ['Titan', 'Fastrack', 'Lavie', 'Hidesign', 'Wildcraft', 'American Tourister', 'Samsonite', 'Ray-Ban', 'Fossil', 'Daniel Wellington', 'Casio', 'Timex', 'Caprese', 'Baggit', 'Da Milano', 'Skybags', 'Safari', 'VIP', 'Lino Perros', 'Chumbak'],
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
    ]
  },
  Home: {
    prefixes: ['HomeTown', 'Urban Ladder', 'Pepperfry', 'Nilkamal', 'Godrej', 'Durian', 'Sleepwell', 'Wakefit', 'Bombay Dyeing', 'Welspun', 'Spaces', 'Raymond', 'Portico', 'D\'Decor', 'Trident', 'Story@Home', 'Cortina', 'Swayam', 'Maspar', 'Status'],
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
    ]
  },
  Sports: {
    prefixes: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Under Armour', 'Decathlon', 'Yonex', 'Cosco', 'Nivia', 'Vector X', 'SG', 'SS', 'MRF', 'Spartan', 'GM', 'Kookaburra', 'Gray Nicolls', 'DSC', 'BDM', 'SF'],
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
    ]
  },
  Beauty: {
    prefixes: ['Lakme', 'Maybelline', 'LOreal', 'MAC', 'Nykaa', 'Colorbar', 'Biotique', 'Himalaya', 'Forest Essentials', 'Kama Ayurveda', 'Plum', 'Mamaearth', 'WOW', 'MCaffeine', 'The Body Shop', 'Bath & Body Works', 'Nivea', 'Dove', 'Neutrogena', 'Olay'],
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
    ]
  },
  Kitchen: {
    prefixes: ['Prestige', 'Pigeon', 'Bajaj', 'Philips', 'Morphy Richards', 'Wonderchef', 'Hawkins', 'Butterfly', 'Preethi', 'Borosil', 'Milton', 'Cello', 'Signoraware', 'Tupperware', 'Corelle', 'Vinod', 'Stovekraft', 'TTK', 'Elica', 'Faber'],
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
    ]
  },
  Books: {
    prefixes: ['Penguin', 'HarperCollins', 'Rupa', 'Scholastic', 'Westland', 'Juggernaut', 'Aleph', 'Speaking Tiger', 'Hachette', 'Pan Macmillan', 'S Chand', 'Arihant', 'Disha', 'MTG', 'Oswaal', 'Pearson', 'Oxford', 'Cambridge', 'McGraw Hill', 'Cengage'],
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
    ]
  },
  Toys: {
    prefixes: ['Funskool', 'Mattel', 'Hasbro', 'LEGO', 'Hot Wheels', 'Barbie', 'Fisher-Price', 'Nerf', 'Play-Doh', 'Monopoly', 'Toyzone', 'Webby', 'Smartivity', 'Einstein Box', 'Skillmatics', 'Imagimake', 'Chalk and Chuckles', 'Shumee', 'Pikaboo', 'Zephyr'],
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
    ]
  },
  Footwear: {
    prefixes: ['Nike', 'Adidas', 'Puma', 'Reebok', 'Bata', 'Liberty', 'Woodland', 'Red Tape', 'Hush Puppies', 'Clarks', 'Metro', 'Mochi', 'Inc.5', 'Crocs', 'Skechers', 'New Balance', 'Asics', 'Fila', 'Campus', 'Lotto'],
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
    ]
  }
}

const badges = ['New', 'Sale', 'Bestseller', 'Limited', 'Trending', 'Hot Deal', null, null, null, null]

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomPrice(min: number, max: number): number {
  // Generate prices that end in 9 or 99 for Indian pricing
  const base = Math.floor(Math.random() * (max - min) + min)
  const ending = [9, 49, 99, 199, 299, 499, 999][Math.floor(Math.random() * 7)]
  return Math.floor(base / 100) * 100 + ending
}

function generateProduct(index: number) {
  const categories = Object.keys(productData)
  const category = categories[index % categories.length]
  const data = productData[category as keyof typeof productData]
  
  const prefix = getRandomElement(data.prefixes)
  const product = getRandomElement(data.products)
  const suffix = getRandomElement(data.suffixes)
  
  const name = `${prefix} ${product} ${suffix}`
  const price = getRandomPrice(data.priceRange[0], data.priceRange[1])
  const hasDiscount = Math.random() > 0.6
  const originalPrice = hasDiscount ? Math.round(price * (1 + Math.random() * 0.4)) : null
  
  return {
    name,
    price,
    original_price: originalPrice,
    image_url: getRandomElement(data.images),
    category,
    description: `Premium quality ${product.toLowerCase()} from ${prefix}. Features ${suffix.toLowerCase()} design with exceptional craftsmanship. Perfect for everyday use and special occasions. Made with high-quality materials for durability and comfort.`,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviews_count: Math.floor(Math.random() * 500) + 10,
    stock: Math.floor(Math.random() * 100) + 5,
    badge: getRandomElement(badges),
    is_active: true
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { batchSize = 1000, startIndex = 0 } = await req.json().catch(() => ({}))
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const products = []
    const maxBatch = Math.min(batchSize, 1000) // Limit batch size
    
    for (let i = 0; i < maxBatch; i++) {
      products.push(generateProduct(startIndex + i))
    }

    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select('id')

    if (error) throw error

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: data?.length || 0,
        nextIndex: startIndex + maxBatch,
        message: `Inserted ${data?.length || 0} products. Call again with startIndex=${startIndex + maxBatch} to continue.`
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
