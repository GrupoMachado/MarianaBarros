export const recipesData = {
  free: [
    {
      title: "Salada Kale & Edamame",
      time: "15 min",
      cal: "307 kcal",
      difficulty: "F\xE1cil",
      img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
      pro: false,
      warning: false,
      tags: ["Salada", "Vegana", "R\xE1pido", "Livre"],
      defaultPortions: 2,
      ingredients: [
        { amount: 150, unit: "g", name: "Kale (Couve-galega), picada" },
        { amount: 100, unit: "g", name: "Edamame cozido" },
        { amount: 1, unit: "unid", name: "Laranja, em gomos" },
        { amount: 30, unit: "g", name: "Am\xEAndoas laminadas" },
        { amount: 2, unit: "csp", name: "Vinagrete de lim\xE3o" }
      ],
      steps: [
        "Massaje a kale com um pouco de azeite e sal durante 2 minutos para amolecer.",
        "Adicione o edamame, os gomos de laranja e as am\xEAndoas.",
        "Regue com o vinagrete de lim\xE3o e misture bem antes de servir."
      ]
    },
    {
      title: "Salada de camar\xE3o com mam\xE3o",
      time: "20 min",
      cal: "516 kcal",
      difficulty: "F\xE1cil",
      img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop",
      pro: false,
      warning: false,
      tags: ["Salada", "Frutos do mar", "Tropical", "Livre"],
      defaultPortions: 2,
      ingredients: [
        { amount: 200, unit: "g", name: "Camar\xE3o cozido e descascado" },
        { amount: 0.5, unit: "unid", name: "Mam\xE3o papaia, em cubos" },
        { amount: 100, unit: "g", name: "Mistura de alfaces" },
        { amount: 1, unit: "csp", name: "Azeite" },
        { amount: 1, unit: "csp", name: "Sumo de lima" }
      ],
      steps: [
        "Numa ta\xE7a grande, coloque a mistura de alfaces como base.",
        "Disponha os cubos de mam\xE3o e o camar\xE3o cozido por cima.",
        "Tempere com azeite, sumo de lima, sal e pimenta a gosto.",
        "Envolva delicadamente para n\xE3o esmagar o mam\xE3o e sirva fresco."
      ]
    }
  ],
  sections: [
    {
      title: "Caf\xE9 da manh\xE3",
      icon: "\u2615",
      items: [
        {
          title: "Torradas de queijo",
          time: "10 min",
          cal: "381 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1484723091791-c0e7e147c301?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Caf\xE9 da manh\xE3", "Vegetariana", "R\xE1pido", "P\xE3o", "Queijo"],
          defaultPortions: 2,
          ingredients: [
            { amount: 4, unit: "fatias", name: "P\xE3o integral, torrado" },
            { amount: 100, unit: "g", name: "Queijo creme light" },
            { amount: 1, unit: "unid", name: "Tomate, fatiado" },
            { amount: 0.5, unit: "csp", name: "Or\xE9g\xE3os secos" }
          ],
          steps: [
            "Torre as fatias de p\xE3o integral na torradeira ou no forno.",
            "Barre generosamente o queijo creme sobre cada fatia.",
            "Disponha as rodelas de tomate por cima do queijo.",
            "Polvilhe com or\xE9g\xE3os e um fio de azeite se desejar."
          ]
        },
        {
          title: "Frutas, nozes e farinha de aveia com leite de am\xEAndoas",
          time: "15 min",
          cal: "347 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Caf\xE9 da manh\xE3", "Sem a\xE7\xFAcar", "Vegana", "Aveia", "Nozes"],
          defaultPortions: 1,
          ingredients: [
            { amount: 50, unit: "g", name: "Flocos de aveia" },
            { amount: 200, unit: "ml", name: "Leite de am\xEAndoas" },
            { amount: 15, unit: "g", name: "Nozes, picadas" },
            { amount: 0.5, unit: "x\xEDcara", name: "Mirtilos ou framboesas" }
          ],
          steps: [
            "Numa panela pequena, junte a aveia e o leite de am\xEAndoas. Leve ao lume brando.",
            "Cozinhe durante 5 a 7 minutos, mexendo frequentemente, at\xE9 engrossar.",
            "Transfira para uma tigela e cubra com os frutos vermelhos e as nozes picadas."
          ]
        }
      ]
    },
    {
      title: "Jantar",
      icon: "\u{1F372}",
      items: [
        {
          title: "Envolt\xF3rio de alface tofu com molho de amendoim",
          time: "25 min",
          cal: "388 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Jantar", "Vegana", "Tofu", "Low Carb"],
          defaultPortions: 2,
          ingredients: [
            { amount: 200, unit: "g", name: "Tofu firme, esfarelado" },
            { amount: 8, unit: "folhas", name: "Alface iceberg ou romana" },
            { amount: 2, unit: "csp", name: "Manteiga de amendoim" },
            { amount: 1, unit: "csp", name: "Molho de soja" },
            { amount: 1, unit: "dente", name: "Alho picado" }
          ],
          steps: [
            "Misture a manteiga de amendoim, molho de soja e alho numa ta\xE7a para fazer o molho.",
            "Numa frigideira, salteie o tofu esfarelado at\xE9 dourar levemente.",
            "Envolva o tofu com metade do molho de amendoim.",
            "Sirva o tofu dentro das folhas de alface e regue com o restante molho."
          ]
        },
        {
          title: "Creme de Frango \xC1cido",
          time: "80 min",
          cal: "614 kcal",
          difficulty: "Avan\xE7ado",
          img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: true,
          tags: ["Jantar", "Frango", "Rico em Prote\xEDna", "Cremoso"],
          defaultPortions: 4,
          ingredients: [
            { amount: 600, unit: "g", name: "Peito de frango" },
            { amount: 200, unit: "ml", name: "Natas ligeiras ou iogurte grego" },
            { amount: 2, unit: "unid", name: "Lim\xF5es (sumo e raspa)" },
            { amount: 2, unit: "dentes", name: "Alho" },
            { amount: 1, unit: "csp", name: "Azeite" }
          ],
          steps: [
            "Tempere os peitos de frango com sal, pimenta e sumo de um lim\xE3o.",
            "Core o frango no azeite quente at\xE9 dourar de ambos os lados (cerca de 8 min cada lado). Retire e reserve.",
            "Na mesma frigideira, adicione o alho picado, as natas e o sumo do outro lim\xE3o. Deixe engrossar em lume brando.",
            "Devolva o frango \xE0 frigideira por 5 minutos. Finalize com a raspa de lim\xE3o."
          ]
        }
      ]
    },
    {
      title: "Sem a\xE7\xFAcar",
      icon: "\u{1F964}",
      items: [
        {
          title: "Salada de Br\xF3colis e Cevada",
          time: "55 min",
          cal: "538 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Almo\xE7o", "Vegetariana", "Sem a\xE7\xFAcar", "Detox"],
          defaultPortions: 2,
          ingredients: [
            { amount: 100, unit: "g", name: "Cevada" },
            { amount: 200, unit: "g", name: "Br\xF3colos em floretes" },
            { amount: 30, unit: "g", name: "Am\xEAndoas torradas" },
            { amount: 1, unit: "csp", name: "Azeite" },
            { amount: 1, unit: "csp", name: "Vinagre de ma\xE7\xE3" }
          ],
          steps: [
            "Coza a cevada em \xE1gua com sal abundante durante cerca de 40 minutos. Escorra.",
            "Coza os br\xF3colos a vapor durante 5 minutos para que fiquem crocantes.",
            "Numa tigela grande, envolva a cevada, os br\xF3colos e as am\xEAndoas.",
            "Tempere com o azeite, o vinagre, sal e pimenta a gosto."
          ]
        },
        {
          title: "Jantar de salm\xE3o assado",
          time: "30 min",
          cal: "765 kcal",
          difficulty: "Intermedi\xE1rio",
          img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: true,
          tags: ["Jantar", "Sem a\xE7\xFAcar", "Peixe", "\xD3mega 3"],
          defaultPortions: 2,
          ingredients: [
            { amount: 300, unit: "g", name: "Lombo de salm\xE3o" },
            { amount: 150, unit: "g", name: "Ervilhas" },
            { amount: 150, unit: "g", name: "Feij\xE3o verde" },
            { amount: 0.5, unit: "unid", name: "Lim\xE3o em rodelas" },
            { amount: 1, unit: "csp", name: "Azeite" }
          ],
          steps: [
            "Pr\xE9-aque\xE7a o forno a 200\xBAC. Coloque o salm\xE3o num tabuleiro forrado com papel vegetal.",
            "Tempere o salm\xE3o com sal, pimenta, azeite e coloque rodelas de lim\xE3o por cima.",
            "Asse durante 15-20 minutos dependendo da espessura.",
            "Entretanto, coza as ervilhas e o feij\xE3o verde a vapor. Sirva como acompanhamento."
          ]
        }
      ]
    },
    {
      title: "Poucas calorias",
      icon: "\u2696\uFE0F",
      items: [
        {
          title: "Feij\xE3o Verde Serrano Embrulhado",
          time: "15 min",
          cal: "64 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1544025162-8368817293a5?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: true,
          tags: ["Petisco", "Poucas calorias", "R\xE1pido", "Carne"],
          defaultPortions: 4,
          ingredients: [
            { amount: 200, unit: "g", name: "Feij\xE3o verde fresco, arranjado" },
            { amount: 4, unit: "fatias", name: "Presunto Serrano" },
            { amount: 1, unit: "csp", name: "Azeite" },
            { amount: 1, unit: "pitada", name: "Pimenta preta" }
          ],
          steps: [
            "Coza o feij\xE3o verde em \xE1gua a ferver durante 4 minutos. Escorra e passe por \xE1gua fria.",
            "Divida o feij\xE3o verde em 4 molhos pequenos.",
            "Enrole cada molho numa fatia de presunto serrano.",
            "Aque\xE7a o azeite numa frigideira e core os rolos durante 2 minutos de cada lado."
          ]
        },
        {
          title: "Espetos Brilhantes de Frutas",
          time: "5 min",
          cal: "67 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1490474418585-ba9f52c212d2?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Sobremesa", "Fruta", "Poucas calorias", "Vegana"],
          defaultPortions: 4,
          ingredients: [
            { amount: 100, unit: "g", name: "Morangos" },
            { amount: 100, unit: "g", name: "Uvas verdes" },
            { amount: 100, unit: "g", name: "Kiwi, em cubos" },
            { amount: 1, unit: "csp", name: "Sumo de lima" }
          ],
          steps: [
            "Lave bem toda a fruta e corte os morangos e o kiwi.",
            "Espete a fruta alternadamente em palitos de espetada.",
            "Pincele ligeiramente com sumo de lima para n\xE3o oxidar e dar um toque c\xEDtrico.",
            "Sirva fresco!"
          ]
        }
      ]
    },
    {
      title: "Vegetariana",
      icon: "\u{1F966}",
      items: [
        {
          title: "Espinafres e Quiche de Queijo",
          time: "30 min",
          cal: "430 kcal",
          difficulty: "Intermedi\xE1rio",
          img: "https://images.unsplash.com/photo-1542130386-896be0f33df4?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Almo\xE7o", "Jantar", "Vegetariana", "Forno", "Ovos"],
          defaultPortions: 6,
          ingredients: [
            { amount: 1, unit: "base", name: "Massa quebrada" },
            { amount: 200, unit: "g", name: "Espinafres frescos" },
            { amount: 4, unit: "unid", name: "Ovos" },
            { amount: 150, unit: "ml", name: "Natas de soja ou leite" },
            { amount: 100, unit: "g", name: "Queijo Emmental ralado" }
          ],
          steps: [
            "Estenda a massa quebrada numa tarteira e pique o fundo com um garfo.",
            "Salteie os espinafres numa frigideira at\xE9 murcharem.",
            "Numa ta\xE7a, bata os ovos com as natas, sal e pimenta.",
            "Espalhe os espinafres e o queijo na tarteira, verta a mistura de ovos por cima e leve ao forno a 180\xBAC por 25 minutos."
          ]
        },
        {
          title: "Salada de lentilha f\xE1cil",
          time: "30 min",
          cal: "499 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Almo\xE7o", "Vegetariana", "Vegana", "Rica em Ferro"],
          defaultPortions: 2,
          ingredients: [
            { amount: 150, unit: "g", name: "Lentilhas castanhas, secas" },
            { amount: 1, unit: "unid", name: "Cenoura, em cubos pequenos" },
            { amount: 1, unit: "unid", name: "Pimento vermelho, em cubos" },
            { amount: 0.5, unit: "unid", name: "Cebola roxa, picada" },
            { amount: 2, unit: "csp", name: "Azeite e Vinagre" }
          ],
          steps: [
            "Coza as lentilhas em \xE1gua com sal e uma folha de louro por 20 minutos (at\xE9 estarem macias, mas firmes).",
            "Escorra as lentilhas e deixe arrefecer ligeiramente.",
            "Junte a cenoura, o pimento e a cebola roxa.",
            "Tempere com azeite, vinagre, sal e pimenta. Deixe apurar 10 minutos antes de servir."
          ]
        }
      ]
    },
    {
      title: "Lanche",
      icon: "\u{1F9C1}",
      items: [
        {
          title: "Torradas de tomate e abacate",
          time: "10 min",
          cal: "354 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Lanche", "Vegana", "Gorduras boas", "R\xE1pido"],
          defaultPortions: 1,
          ingredients: [
            { amount: 2, unit: "fatias", name: "P\xE3o de sementes, torrado" },
            { amount: 0.5, unit: "unid", name: "Abacate maduro" },
            { amount: 0.5, unit: "unid", name: "Tomate, em rodelas ou cubos" },
            { amount: 1, unit: "csp", name: "Sumo de lim\xE3o" },
            { amount: 1, unit: "pitada", name: "Flocos de piripiri (opcional)" }
          ],
          steps: [
            "Esmague o abacate numa ta\xE7a com o sumo de lim\xE3o, sal e pimenta.",
            "Barre a pasta de abacate sobre as torradas.",
            "Disponha o tomate por cima.",
            "Polvilhe com flocos de piripiri se desejar."
          ]
        },
        {
          title: "Arugula & Tomate Toast",
          time: "10 min",
          cal: "266 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1594973347915-d725350c3f59?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Lanche", "Vegetariana", "R\xE1pido"],
          defaultPortions: 1,
          ingredients: [
            { amount: 2, unit: "fatias", name: "P\xE3o de centeio" },
            { amount: 20, unit: "g", name: "Queijo creme ou ricota" },
            { amount: 1, unit: "m\xE3o cheia", name: "R\xFAcula (Arugula) fresca" },
            { amount: 4, unit: "unid", name: "Tomate cereja, cortado ao meio" }
          ],
          steps: [
            "Torre as fatias de p\xE3o.",
            "Espalhe uma camada fina de queijo creme ou ricota.",
            "Coloque as folhas de r\xFAcula por cima do queijo.",
            "Termine com as metades de tomate cereja e um fio muito ligeiro de azeite."
          ]
        }
      ]
    },
    {
      title: "Salada",
      icon: "\u{1F957}",
      items: [
        {
          title: "Lombo de porco assado com salada de r\xFAcula",
          time: "90 min",
          cal: "673 kcal",
          difficulty: "Avan\xE7ado",
          img: "https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: true,
          tags: ["Salada", "Carne", "Alto Teor Proteico", "Assado"],
          defaultPortions: 4,
          ingredients: [
            { amount: 800, unit: "g", name: "Lombo de porco inteiro" },
            { amount: 2, unit: "dentes", name: "Alho, esmagados" },
            { amount: 1, unit: "csp", name: "Mostarda antiga" },
            { amount: 150, unit: "g", name: "R\xFAcula fresca" },
            { amount: 10, unit: "unid", name: "Rabanetes, fatiados" }
          ],
          steps: [
            "Pr\xE9-aque\xE7a o forno a 180\xBAC.",
            "Barre o lombo de porco com a mostarda, alho, sal e pimenta. Asse no forno durante 60-70 minutos.",
            "Retire, deixe descansar 10 minutos antes de fatiar.",
            "Sirva as fatias de lombo sobre uma cama de r\xFAcula e rabanetes temperados com azeite."
          ]
        },
        {
          title: "Salada de gr\xE3o de bico, pepino e quinoa",
          time: "20 min",
          cal: "625 kcal",
          difficulty: "F\xE1cil",
          img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Salada", "Vegana", "Rica em Fibra", "Quinoa"],
          defaultPortions: 2,
          ingredients: [
            { amount: 200, unit: "g", name: "Gr\xE3o de bico cozido" },
            { amount: 100, unit: "g", name: "Quinoa cozida" },
            { amount: 0.5, unit: "unid", name: "Pepino grande, em cubos" },
            { amount: 1, unit: "unid", name: "Cebola roxa, em meias luas" },
            { amount: 2, unit: "csp", name: "Azeite e sumo de lim\xE3o" }
          ],
          steps: [
            "Numa ta\xE7a grande, misture o gr\xE3o de bico, a quinoa e o pepino.",
            "Adicione a cebola roxa cortada.",
            "Fa\xE7a um molho batendo o azeite com sumo de lim\xE3o, sal e pimenta.",
            "Regue a salada com o molho e sirva fresca."
          ]
        }
      ]
    },
    {
      title: "Sopa",
      icon: "\u{1F963}",
      items: [
        {
          title: "Canja de Galinha Saud\xE1vel",
          time: "45 min",
          cal: "280 kcal",
          difficulty: "Intermedi\xE1rio",
          img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?q=80&w=400&auto=format&fit=crop",
          pro: true,
          warning: false,
          tags: ["Sopa", "Cl\xE1ssica", "Reconfortante", "Aves"],
          defaultPortions: 4,
          ingredients: [
            { amount: 300, unit: "g", name: "Frango (peito ou coxa sem pele)" },
            { amount: 1, unit: "litro", name: "Caldo de galinha" },
            { amount: 50, unit: "g", name: "Massinhas (pevide ou estrelinha)" },
            { amount: 1, unit: "unid", name: "Cenoura, ralada" },
            { amount: 2, unit: "ramos", name: "Hortel\xE3 fresca" }
          ],
          steps: [
            "Coza o frango no caldo de galinha fervente durante cerca de 30 minutos.",
            "Retire o frango, desfie-o e volte a colocar na panela.",
            "Adicione a cenoura ralada e a massa. Cozinhe por mais 10 minutos.",
            "Sirva quente, guarnecido com folhas de hortel\xE3."
          ]
        }
      ]
    }
  ]
};
