export const products = {
  processors: [
    {
      id: 'cpu-1',
      name: 'Intel Core i9-13900K',
      category: 'Processor',
      price: 589.99,
      image: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=CPU',
      description: '24 cores (8 P-cores + 16 E-cores) 36M Cache, up to 5.8 GHz',
      specs: {
        brand: 'Intel',
        socket: 'LGA 1700',
        cores: 24,
        threads: 32,
        baseClock: '3.0 GHz',
        boostClock: '5.8 GHz',
        cache: '36MB'
      }
    },
    {
      id: 'cpu-2',
      name: 'AMD Ryzen 9 7950X',
      category: 'Processor',
      price: 699.99,
      image: 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=AMD+CPU',
      description: '16 cores, 32 threads, up to 5.7 GHz',
      specs: {
        brand: 'AMD',
        socket: 'AM5',
        cores: 16,
        threads: 32,
        baseClock: '4.5 GHz',
        boostClock: '5.7 GHz',
        cache: '80MB'
      }
    }
  ],
  motherboards: [
    {
      id: 'mb-1',
      name: 'ASUS ROG Maximus Z790 Hero',
      category: 'Motherboard',
      price: 629.99,
      image: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Motherboard',
      description: 'Intel Z790 LGA 1700 ATX Gaming Motherboard',
      specs: {
        brand: 'ASUS',
        socket: 'LGA 1700',
        chipset: 'Intel Z790',
        formFactor: 'ATX',
        memorySlots: 4,
        maxMemory: '128GB'
      }
    }
  ],
  graphics: [
    {
      id: 'gpu-1',
      name: 'NVIDIA GeForce RTX 4090',
      category: 'Graphics Card',
      price: 1599.99,
      image: 'https://via.placeholder.com/300x300/00FF00/000000?text=RTX+4090',
      description: '24GB GDDR6X, DLSS 3, Ray Tracing',
      specs: {
        brand: 'NVIDIA',
        memory: '24GB GDDR6X',
        interface: 'PCIe 4.0',
        powerConsumption: '450W'
      }
    },
    {
      id: 'gpu-2',
      name: 'AMD Radeon RX 7900 XTX',
      category: 'Graphics Card',
      price: 999.99,
      image: 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=RX+7900',
      description: '24GB GDDR6, AMD RDNA 3 Architecture',
      specs: {
        brand: 'AMD',
        memory: '24GB GDDR6',
        interface: 'PCIe 4.0',
        powerConsumption: '355W'
      }
    }
  ],
  memory: [
    {
      id: 'ram-1',
      name: 'Corsair Vengeance RGB 32GB',
      category: 'Memory',
      price: 129.99,
      image: 'https://via.placeholder.com/300x300/FF00FF/FFFFFF?text=RAM',
      description: 'DDR5 6000MHz CL30 Memory Kit',
      specs: {
        brand: 'Corsair',
        type: 'DDR5',
        speed: '6000MHz',
        capacity: '32GB (2x16GB)',
        latency: 'CL30'
      }
    }
  ],
  storage: [
    {
      id: 'ssd-1',
      name: 'Samsung 990 Pro 2TB',
      category: 'Storage',
      price: 179.99,
      image: 'https://via.placeholder.com/300x300/0000FF/FFFFFF?text=SSD',
      description: 'PCIe 4.0 NVMe M.2 Internal SSD',
      specs: {
        brand: 'Samsung',
        type: 'NVMe M.2',
        capacity: '2TB',
        interface: 'PCIe 4.0',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s'
      }
    }
  ],
  power: [
    {
      id: 'psu-1',
      name: 'Corsair RM1000x',
      category: 'Power Supply',
      price: 189.99,
      image: 'https://via.placeholder.com/300x300/FFFF00/000000?text=PSU',
      description: '1000 Watt 80 Plus Gold Certified Fully Modular PSU',
      specs: {
        brand: 'Corsair',
        wattage: '1000W',
        efficiency: '80 Plus Gold',
        modular: 'Full',
        warranty: '10 years'
      }
    }
  ],
  cases: [
    {
      id: 'case-1',
      name: 'Lian Li O11 Dynamic',
      category: 'Case',
      price: 149.99,
      image: 'https://via.placeholder.com/300x300/888888/FFFFFF?text=PC+Case',
      description: 'Tempered Glass ATX Mid Tower Computer Case',
      specs: {
        brand: 'Lian Li',
        type: 'Mid Tower',
        motherboardSupport: 'ATX, Micro-ATX, Mini-ITX',
        material: 'Steel, Tempered Glass',
        color: 'Black'
      }
    }
  ],
  cooling: [
    {
      id: 'cooler-1',
      name: 'NZXT Kraken Z73',
      category: 'Cooling',
      price: 279.99,
      image: 'https://via.placeholder.com/300x300/00FFFF/000000?text=AIO+Cooler',
      description: '360mm RGB AIO Liquid CPU Cooler with LCD Display',
      specs: {
        brand: 'NZXT',
        type: 'AIO Liquid Cooler',
        radiatorSize: '360mm',
        compatibility: 'All modern sockets'
      }
    }
  ]
};

export const categories = [
  { id: 'processors', name: 'Processors', icon: 'hardware-chip' },
  { id: 'motherboards', name: 'Motherboards', icon: 'grid' },
  { id: 'graphics', name: 'Graphics Cards', icon: 'videocam' },
  { id: 'memory', name: 'Memory', icon: 'albums' },
  { id: 'storage', name: 'Storage', icon: 'save' },
  { id: 'power', name: 'Power Supply', icon: 'flash' },
  { id: 'cases', name: 'Cases', icon: 'cube' },
  { id: 'cooling', name: 'Cooling', icon: 'snow' },
];