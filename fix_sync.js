const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');

const syncTarget = `                            name: userProfile.name, 
                            objetivo_principal: userProfile.goal, 
                            gender: userProfile.gender,
                            idade: userProfile.age
                        });`;

const syncReplace = `                            name: userProfile.name, 
                            objetivo_principal: userProfile.goal, 
                            gender: userProfile.gender,
                            idade: userProfile.age,
                            estado: userProfile.estado
                        });`;

if (c.includes(syncTarget)) {
    c = c.replace(syncTarget, syncReplace);
    fs.writeFileSync('index.html', c);
    console.log('Fixed syncToSupa mapping');
} else {
    console.log('Sync target not found');
}
