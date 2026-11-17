// Resolución 2184/2019 - Clasificación de residuos Colombia
export const wasteCategories = [
  {
    id: 'white',
    name: 'Contenedor Blanco',
    subtitle: 'Aprovechables',
    color: '#FFFFFF',
    textColor: '#080D0B',
    borderColor: '#E5E7EB',
    icon: 'recycle',
    description: 'Residuos secos, limpios y que pueden ser reciclados o reutilizados',
    examples: [
      { item: 'Plásticos', details: 'Botellas, tapas, envases, bolsas limpias y secas' },
      { item: 'Papel y Cartón', details: 'Periódicos, revistas, cajas, cuadernos, papel de oficina' },
      { item: 'Metales', details: 'Latas de aluminio, hojalata, tapas metálicas, papel aluminio limpio' },
      { item: 'Vidrio', details: 'Botellas, frascos, envases de vidrio limpios' },
      { item: 'Tetrapak', details: 'Cajas de leche, jugos, sopas (enjuagadas y aplastadas)' },
    ],
    tips: [
      'Lava y seca todos los envases antes de depositarlos',
      'Aplasta cajas y botellas para ahorrar espacio',
      'Retira tapas y etiquetas cuando sea posible',
      'No deposites residuos sucios o con restos de comida',
    ],
    stats: {
      recoveryRate: '85%',
      co2Saved: '2.5 kg CO₂/kg',
      waterSaved: '15 L/kg',
    },
  },
  {
    id: 'green',
    name: 'Contenedor Verde',
    subtitle: 'Orgánicos Aprovechables',
    color: '#19C878',
    textColor: '#FFFFFF',
    borderColor: '#19C878',
    icon: 'leaf',
    description: 'Residuos orgánicos que pueden convertirse en compost o abono',
    examples: [
      { item: 'Restos de Frutas y Verduras', details: 'Cáscaras, semillas, tallos, hojas' },
      { item: 'Restos de Comida', details: 'Cáscaras de huevo, posos de café, filtros de té, pan' },
      { item: 'Residuos de Jardín', details: 'Hojas secas, pasto, flores, ramas pequeñas' },
      { item: 'Papel Sucio', details: 'Servilletas, papel de cocina, cartón de pizza con grasa' },
      { item: 'Asadillo y Madera', details: 'Virutas, aserrín, carbón vegetal (frío)' },
    ],
    tips: [
      'Corta en trozos pequeños para acelerar la descomposición',
      'Mantén húmedo pero no encharcado',
      'No agregues carnes, lácteos, aceites ni huesos grandes',
      'Revuelve semanalmente para airear',
    ],
    stats: {
      recoveryRate: '95%',
      co2Saved: '1.8 kg CO₂/kg',
      compostProduced: '0.3 kg/kg',
    },
  },
  {
    id: 'black',
    name: 'Contenedor Negro',
    subtitle: 'No Aprovechables',
    color: '#1A1A2E',
    textColor: '#FFFFFF',
    borderColor: '#374151',
    icon: 'trash',
    description: 'Residuos que no pueden ser reciclados ni compostados, van a relleno sanitario',
    examples: [
      { item: 'Papel Higiénico y Pañales', details: 'Papel sanitario, toallas higiénicas, pañales, hisopos' },
      { item: 'Plásticos Sucios/Complejos', details: 'Envolturas metalizadas, bolsas de snacks, plástico sucio irrecuperable' },
      { item: 'Cerámica y Espejos', details: 'Platos rotos, tazas, espejos, vidrios de ventanas' },
      { item: 'Colillas y Cenizas', details: 'Colillas de cigarrillo, cenizas frías, carbón' },
      { item: 'Otros', details: 'Chicles, gomas de mascar, polvo de barrer, cabello, pelo de mascotas' },
    ],
    tips: [
      'Reduce al mínimo: prioriza productos reciclables o compostables',
      'Envuelve objetos punzantes en papel/cartón antes de desechar',
      'Nunca mezcles con residuos peligrosos (pilas, medicamentos, químicos)',
      'Compacta para reducir volumen en relleno sanitario',
    ],
    stats: {
      recoveryRate: '0%',
      landfillYears: '500+ años',
      impact: 'Alto impacto ambiental',
    },
  },
];

export const specialWaste = [
  {
    category: 'Residuos Peligrosos Domésticos',
    items: ['Pilas y baterías', 'Medicamentos vencidos', 'Aceites de cocina', 'Bombillas fluorescentes', 'Termómetros de mercurio', 'Pinturas y disolventes'],
    disposal: 'Puntos Limpios móviles o fijos - Nunca en contenedores comunes',
    icon: 'alert-triangle',
  },
  {
    category: 'RAEE (Electrónicos)',
    items: ['Celulares, computadores', 'Electrodomésticos', 'Cables y cargadores', 'Pantallas, televisores'],
    disposal: 'Puntos Limpios fijos / Campañas de recolección especial',
    icon: 'cpu',
  },
  {
    category: 'Residuos de Construcción (RCD)',
    items: ['Escombros', 'Concreto', 'Ladrillos', 'Cerámica'],
    disposal: 'Sitios autorizados de disposición final / Empresas gestoras',
    icon: 'building',
  },
  {
    category: 'Aceites Usados',
    items: ['Aceite de motor', 'Aceite de cocina usado'],
    disposal: 'Puntos Limpios / Talleres autorizados / Programa "Aceite Verde"',
    icon: 'droplet',
  },
];

export const gironotCollectionSchedule = {
  white: {
    days: ['Lunes', 'Miércoles', 'Viernes'],
    time: '6:00 AM - 10:00 AM',
    neighborhoods: ['Centro', 'Alfonso López', 'San Antonio', 'El Prado', 'La Gaitana'],
  },
  green: {
    days: ['Martes', 'Jueves', 'Sábado'],
    time: '6:00 AM - 10:00 AM',
    neighborhoods: ['Centro', 'Alfonso López', 'San Antonio', 'El Prado', 'La Gaitana'],
  },
  black: {
    days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    time: '6:00 AM - 10:00 AM',
    neighborhoods: ['Toda la ciudad'],
  },
};