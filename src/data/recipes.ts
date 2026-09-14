export const recipesData = {
  free: [
    {
      title: 'Salada Kale & Edamame',
      time: '15 min',
      cal: '307 kcal',
      difficulty: 'Fácil',
      img: '/assets/salada_kale.jpg',
      pro: false,
      warning: false,
      tags: ['Salada', 'Vegana', 'Rápido', 'Livre'],
      defaultPortions: 2,
      ingredients: [
        { amount: 150, unit: 'g', name: 'Kale (Couve-galega), picada' },
        { amount: 100, unit: 'g', name: 'Edamame cozido' },
        { amount: 1, unit: 'unid', name: 'Laranja, em gomos' },
        { amount: 30, unit: 'g', name: 'Amêndoas laminadas' },
        { amount: 2, unit: 'csp', name: 'Vinagrete de limão' }
      ],
      steps: [
        'Massaje a kale com um pouco de azeite e sal durante 2 minutos para amolecer.',
        'Adicione o edamame, os gomos de laranja e as amêndoas.',
        'Regue com o vinagrete de limão e misture bem antes de servir.'
      ]
    },
    {
      title: 'Salada de camarão com mamão',
      time: '20 min',
      cal: '516 kcal',
      difficulty: 'Fácil',
      img: '/assets/salada_camarao.jpg',
      pro: false,
      warning: false,
      tags: ['Salada', 'Frutos do mar', 'Tropical', 'Livre'],
      defaultPortions: 2,
      ingredients: [
        { amount: 200, unit: 'g', name: 'Camarão cozido e descascado' },
        { amount: 0.5, unit: 'unid', name: 'Mamão papaia, em cubos' },
        { amount: 100, unit: 'g', name: 'Mistura de alfaces' },
        { amount: 1, unit: 'csp', name: 'Azeite' },
        { amount: 1, unit: 'csp', name: 'Sumo de lima' }
      ],
      steps: [
        'Numa taça grande, coloque a mistura de alfaces como base.',
        'Disponha os cubos de mamão e o camarão cozido por cima.',
        'Tempere com azeite, sumo de lima, sal e pimenta a gosto.',
        'Envolva delicadamente para não esmagar o mamão e sirva fresco.'
      ]
    }
  ],
  sections: [
    {
      title: 'Café da manhã',
      icon: '☕',
      items: [
        {
          title: 'Torradas de queijo',
          time: '10 min',
          cal: '381 kcal',
          difficulty: 'Fácil',
          img: '/assets/torradas_queijo.jpg',
          pro: true,
          warning: false,
          tags: ['Café da manhã', 'Vegetariana', 'Rápido', 'Pão', 'Queijo'],
          defaultPortions: 2,
          ingredients: [
            { amount: 4, unit: 'fatias', name: 'Pão integral, torrado' },
            { amount: 100, unit: 'g', name: 'Queijo creme light' },
            { amount: 1, unit: 'unid', name: 'Tomate, fatiado' },
            { amount: 0.5, unit: 'csp', name: 'Orégãos secos' }
          ],
          steps: [
            'Torre as fatias de pão integral na torradeira ou no forno.',
            'Barre generosamente o queijo creme sobre cada fatia.',
            'Disponha as rodelas de tomate por cima do queijo.',
            'Polvilhe com orégãos e um fio de azeite se desejar.'
          ]
        },
        {
          title: 'Frutas, nozes e farinha de aveia com leite de amêndoas',
          time: '15 min',
          cal: '347 kcal',
          difficulty: 'Fácil',
          img: '/assets/aveia_frutas.jpg',
          pro: true,
          warning: false,
          tags: ['Café da manhã', 'Sem açúcar', 'Vegana', 'Aveia', 'Nozes'],
          defaultPortions: 1,
          ingredients: [
            { amount: 50, unit: 'g', name: 'Flocos de aveia' },
            { amount: 200, unit: 'ml', name: 'Leite de amêndoas' },
            { amount: 15, unit: 'g', name: 'Nozes, picadas' },
            { amount: 0.5, unit: 'xícara', name: 'Mirtilos ou framboesas' }
          ],
          steps: [
            'Numa panela pequena, junte a aveia e o leite de amêndoas. Leve ao lume brando.',
            'Cozinhe durante 5 a 7 minutos, mexendo frequentemente, até engrossar.',
            'Transfira para uma tigela e cubra com os frutos vermelhos e as nozes picadas.'
          ]
        }
      ]
    },
    {
      title: 'Jantar',
      icon: '🍲',
      items: [
        {
          title: 'Envoltório de alface tofu com molho de amendoim',
          time: '25 min',
          cal: '388 kcal',
          difficulty: 'Fácil',
          img: '/assets/alface_tofu.jpg',
          pro: true,
          warning: false,
          tags: ['Jantar', 'Vegana', 'Tofu', 'Low Carb'],
          defaultPortions: 2,
          ingredients: [
            { amount: 200, unit: 'g', name: 'Tofu firme, esfarelado' },
            { amount: 8, unit: 'folhas', name: 'Alface iceberg ou romana' },
            { amount: 2, unit: 'csp', name: 'Manteiga de amendoim' },
            { amount: 1, unit: 'csp', name: 'Molho de soja' },
            { amount: 1, unit: 'dente', name: 'Alho picado' }
          ],
          steps: [
            'Misture a manteiga de amendoim, molho de soja e alho numa taça para fazer o molho.',
            'Numa frigideira, salteie o tofu esfarelado até dourar levemente.',
            'Envolva o tofu com metade do molho de amendoim.',
            'Sirva o tofu dentro das folhas de alface e regue com o restante molho.'
          ]
        },
        {
          title: 'Creme de Frango Ácido',
          time: '80 min',
          cal: '614 kcal',
          difficulty: 'Avançado',
          img: '/assets/creme_frango.jpg',
          pro: true,
          warning: true,
          tags: ['Jantar', 'Frango', 'Rico em Proteína', 'Cremoso'],
          defaultPortions: 4,
          ingredients: [
            { amount: 600, unit: 'g', name: 'Peito de frango' },
            { amount: 200, unit: 'ml', name: 'Natas ligeiras ou iogurte grego' },
            { amount: 2, unit: 'unid', name: 'Limões (sumo e raspa)' },
            { amount: 2, unit: 'dentes', name: 'Alho' },
            { amount: 1, unit: 'csp', name: 'Azeite' }
          ],
          steps: [
            'Tempere os peitos de frango com sal, pimenta e sumo de um limão.',
            'Core o frango no azeite quente até dourar de ambos os lados (cerca de 8 min cada lado). Retire e reserve.',
            'Na mesma frigideira, adicione o alho picado, as natas e o sumo do outro limão. Deixe engrossar em lume brando.',
            'Devolva o frango à frigideira por 5 minutos. Finalize com a raspa de limão.'
          ]
        }
      ]
    },
    {
      title: 'Sem açúcar',
      icon: '🥤',
      items: [
        {
          title: 'Salada de Brócolis e Cevada',
          time: '55 min',
          cal: '538 kcal',
          difficulty: 'Fácil',
          img: '/assets/salada_brocolis.jpg',
          pro: true,
          warning: false,
          tags: ['Almoço', 'Vegetariana', 'Sem açúcar', 'Detox'],
          defaultPortions: 2,
          ingredients: [
            { amount: 100, unit: 'g', name: 'Cevada' },
            { amount: 200, unit: 'g', name: 'Brócolos em floretes' },
            { amount: 30, unit: 'g', name: 'Amêndoas torradas' },
            { amount: 1, unit: 'csp', name: 'Azeite' },
            { amount: 1, unit: 'csp', name: 'Vinagre de maçã' }
          ],
          steps: [
            'Coza a cevada em água com sal abundante durante cerca de 40 minutos. Escorra.',
            'Coza os brócolos a vapor durante 5 minutos para que fiquem crocantes.',
            'Numa tigela grande, envolva a cevada, os brócolos e as amêndoas.',
            'Tempere com o azeite, o vinagre, sal e pimenta a gosto.'
          ]
        },
        {
          title: 'Jantar de salmão assado',
          time: '30 min',
          cal: '765 kcal',
          difficulty: 'Intermediário',
          img: '/assets/salmao_assado.jpg',
          pro: true,
          warning: true,
          tags: ['Jantar', 'Sem açúcar', 'Peixe', 'Ómega 3'],
          defaultPortions: 2,
          ingredients: [
            { amount: 300, unit: 'g', name: 'Lombo de salmão' },
            { amount: 150, unit: 'g', name: 'Ervilhas' },
            { amount: 150, unit: 'g', name: 'Feijão verde' },
            { amount: 0.5, unit: 'unid', name: 'Limão em rodelas' },
            { amount: 1, unit: 'csp', name: 'Azeite' }
          ],
          steps: [
            'Pré-aqueça o forno a 200ºC. Coloque o salmão num tabuleiro forrado com papel vegetal.',
            'Tempere o salmão com sal, pimenta, azeite e coloque rodelas de limão por cima.',
            'Asse durante 15-20 minutos dependendo da espessura.',
            'Entretanto, coza as ervilhas e o feijão verde a vapor. Sirva como acompanhamento.'
          ]
        }
      ]
    },
    {
      title: 'Poucas calorias',
      icon: '⚖️',
      items: [
        {
          title: 'Feijão Verde Serrano Embrulhado',
          time: '15 min',
          cal: '64 kcal',
          difficulty: 'Fácil',
          img: '/assets/feijao_verde.jpg',
          pro: true,
          warning: true,
          tags: ['Petisco', 'Poucas calorias', 'Rápido', 'Carne'],
          defaultPortions: 4,
          ingredients: [
            { amount: 200, unit: 'g', name: 'Feijão verde fresco, arranjado' },
            { amount: 4, unit: 'fatias', name: 'Presunto Serrano' },
            { amount: 1, unit: 'csp', name: 'Azeite' },
            { amount: 1, unit: 'pitada', name: 'Pimenta preta' }
          ],
          steps: [
            'Coza o feijão verde em água a ferver durante 4 minutos. Escorra e passe por água fria.',
            'Divida o feijão verde em 4 molhos pequenos.',
            'Enrole cada molho numa fatia de presunto serrano.',
            'Aqueça o azeite numa frigideira e core os rolos durante 2 minutos de cada lado.'
          ]
        },
        {
          title: 'Espetos Brilhantes de Frutas',
          time: '5 min',
          cal: '67 kcal',
          difficulty: 'Fácil',
          img: '/assets/espetos_frutas.jpg',
          pro: true,
          warning: false,
          tags: ['Sobremesa', 'Fruta', 'Poucas calorias', 'Vegana'],
          defaultPortions: 4,
          ingredients: [
            { amount: 100, unit: 'g', name: 'Morangos' },
            { amount: 100, unit: 'g', name: 'Uvas verdes' },
            { amount: 100, unit: 'g', name: 'Kiwi, em cubos' },
            { amount: 1, unit: 'csp', name: 'Sumo de lima' }
          ],
          steps: [
            'Lave bem toda a fruta e corte os morangos e o kiwi.',
            'Espete a fruta alternadamente em palitos de espetada.',
            'Pincele ligeiramente com sumo de lima para não oxidar e dar um toque cítrico.',
            'Sirva fresco!'
          ]
        }
      ]
    },
    {
      title: 'Vegetariana',
      icon: '🥦',
      items: [
        {
          title: 'Espinafres e Quiche de Queijo',
          time: '30 min',
          cal: '430 kcal',
          difficulty: 'Intermediário',
          img: '/assets/quiche_espinafres.jpg',
          pro: true,
          warning: false,
          tags: ['Almoço', 'Jantar', 'Vegetariana', 'Forno', 'Ovos'],
          defaultPortions: 6,
          ingredients: [
            { amount: 1, unit: 'base', name: 'Massa quebrada' },
            { amount: 200, unit: 'g', name: 'Espinafres frescos' },
            { amount: 4, unit: 'unid', name: 'Ovos' },
            { amount: 150, unit: 'ml', name: 'Natas de soja ou leite' },
            { amount: 100, unit: 'g', name: 'Queijo Emmental ralado' }
          ],
          steps: [
            'Estenda a massa quebrada numa tarteira e pique o fundo com um garfo.',
            'Salteie os espinafres numa frigideira até murcharem.',
            'Numa taça, bata os ovos com as natas, sal e pimenta.',
            'Espalhe os espinafres e o queijo na tarteira, verta a mistura de ovos por cima e leve ao forno a 180ºC por 25 minutos.'
          ]
        },
        {
          title: 'Salada de lentilha fácil',
          time: '30 min',
          cal: '499 kcal',
          difficulty: 'Fácil',
          img: '/assets/salada_lentilhas.jpg',
          pro: true,
          warning: false,
          tags: ['Almoço', 'Vegetariana', 'Vegana', 'Rica em Ferro'],
          defaultPortions: 2,
          ingredients: [
            { amount: 150, unit: 'g', name: 'Lentilhas castanhas, secas' },
            { amount: 1, unit: 'unid', name: 'Cenoura, em cubos pequenos' },
            { amount: 1, unit: 'unid', name: 'Pimento vermelho, em cubos' },
            { amount: 0.5, unit: 'unid', name: 'Cebola roxa, picada' },
            { amount: 2, unit: 'csp', name: 'Azeite e Vinagre' }
          ],
          steps: [
            'Coza as lentilhas em água com sal e uma folha de louro por 20 minutos (até estarem macias, mas firmes).',
            'Escorra as lentilhas e deixe arrefecer ligeiramente.',
            'Junte a cenoura, o pimento e a cebola roxa.',
            'Tempere com azeite, vinagre, sal e pimenta. Deixe apurar 10 minutos antes de servir.'
          ]
        }
      ]
    },
    {
      title: 'Lanche',
      icon: '🧁',
      items: [
        {
          title: 'Torradas de tomate e abacate',
          time: '10 min',
          cal: '354 kcal',
          difficulty: 'Fácil',
          img: '/assets/torrada_abacate.jpg',
          pro: true,
          warning: false,
          tags: ['Lanche', 'Vegana', 'Gorduras boas', 'Rápido'],
          defaultPortions: 1,
          ingredients: [
            { amount: 2, unit: 'fatias', name: 'Pão de sementes, torrado' },
            { amount: 0.5, unit: 'unid', name: 'Abacate maduro' },
            { amount: 0.5, unit: 'unid', name: 'Tomate, em rodelas ou cubos' },
            { amount: 1, unit: 'csp', name: 'Sumo de limão' },
            { amount: 1, unit: 'pitada', name: 'Flocos de piripiri (opcional)' }
          ],
          steps: [
            'Esmague o abacate numa taça com o sumo de limão, sal e pimenta.',
            'Barre a pasta de abacate sobre as torradas.',
            'Disponha o tomate por cima.',
            'Polvilhe com flocos de piripiri se desejar.'
          ]
        },
        {
          title: 'Arugula & Tomate Toast',
          time: '10 min',
          cal: '266 kcal',
          difficulty: 'Fácil',
          img: '/assets/torrada_rucula.jpg',
          pro: true,
          warning: false,
          tags: ['Lanche', 'Vegetariana', 'Rápido'],
          defaultPortions: 1,
          ingredients: [
            { amount: 2, unit: 'fatias', name: 'Pão de centeio' },
            { amount: 20, unit: 'g', name: 'Queijo creme ou ricota' },
            { amount: 1, unit: 'mão cheia', name: 'Rúcula (Arugula) fresca' },
            { amount: 4, unit: 'unid', name: 'Tomate cereja, cortado ao meio' }
          ],
          steps: [
            'Torre as fatias de pão.',
            'Espalhe uma camada fina de queijo creme ou ricota.',
            'Coloque as folhas de rúcula por cima do queijo.',
            'Termine com as metades de tomate cereja e um fio muito ligeiro de azeite.'
          ]
        }
      ]
    },
    {
      title: 'Salada',
      icon: '🥗',
      items: [
        {
          title: 'Lombo de porco assado com salada de rúcula',
          time: '90 min',
          cal: '673 kcal',
          difficulty: 'Avançado',
          img: '/assets/lombo_porco.jpg',
          pro: true,
          warning: true,
          tags: ['Salada', 'Carne', 'Alto Teor Proteico', 'Assado'],
          defaultPortions: 4,
          ingredients: [
            { amount: 800, unit: 'g', name: 'Lombo de porco inteiro' },
            { amount: 2, unit: 'dentes', name: 'Alho, esmagados' },
            { amount: 1, unit: 'csp', name: 'Mostarda antiga' },
            { amount: 150, unit: 'g', name: 'Rúcula fresca' },
            { amount: 10, unit: 'unid', name: 'Rabanetes, fatiados' }
          ],
          steps: [
            'Pré-aqueça o forno a 180ºC.',
            'Barre o lombo de porco com a mostarda, alho, sal e pimenta. Asse no forno durante 60-70 minutos.',
            'Retire, deixe descansar 10 minutos antes de fatiar.',
            'Sirva as fatias de lombo sobre uma cama de rúcula e rabanetes temperados com azeite.'
          ]
        },
        {
          title: 'Salada de grão de bico, pepino e quinoa',
          time: '20 min',
          cal: '625 kcal',
          difficulty: 'Fácil',
          img: '/assets/salada_grao.jpg',
          pro: true,
          warning: false,
          tags: ['Salada', 'Vegana', 'Rica em Fibra', 'Quinoa'],
          defaultPortions: 2,
          ingredients: [
            { amount: 200, unit: 'g', name: 'Grão de bico cozido' },
            { amount: 100, unit: 'g', name: 'Quinoa cozida' },
            { amount: 0.5, unit: 'unid', name: 'Pepino grande, em cubos' },
            { amount: 1, unit: 'unid', name: 'Cebola roxa, em meias luas' },
            { amount: 2, unit: 'csp', name: 'Azeite e sumo de limão' }
          ],
          steps: [
            'Numa taça grande, misture o grão de bico, a quinoa e o pepino.',
            'Adicione a cebola roxa cortada.',
            'Faça um molho batendo o azeite com sumo de limão, sal e pimenta.',
            'Regue a salada com o molho e sirva fresca.'
          ]
        }
      ]
    },
    {
      title: 'Sopa',
      icon: '🥣',
      items: [
        {
          title: 'Canja de Galinha Saudável',
          time: '45 min',
          cal: '280 kcal',
          difficulty: 'Intermediário',
          img: '/assets/canja_galinha.jpg',
          pro: true,
          warning: false,
          tags: ['Sopa', 'Clássica', 'Reconfortante', 'Aves'],
          defaultPortions: 4,
          ingredients: [
            { amount: 300, unit: 'g', name: 'Frango (peito ou coxa sem pele)' },
            { amount: 1, unit: 'litro', name: 'Caldo de galinha' },
            { amount: 50, unit: 'g', name: 'Massinhas (pevide ou estrelinha)' },
            { amount: 1, unit: 'unid', name: 'Cenoura, ralada' },
            { amount: 2, unit: 'ramos', name: 'Hortelã fresca' }
          ],
          steps: [
            'Coza o frango no caldo de galinha fervente durante cerca de 30 minutos.',
            'Retire o frango, desfie-o e volte a colocar na panela.',
            'Adicione a cenoura ralada e a massa. Cozinhe por mais 10 minutos.',
            'Sirva quente, guarnecido com folhas de hortelã.'
          ]
        }
      ]
    }
  ]
};
