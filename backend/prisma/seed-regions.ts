import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding Indonesian Regions...');

    try {
        // 1. Fetch Provinces
        console.log('Fetching Provinces...');
        const provinceRes = await axios.get('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json');
        const provinces = provinceRes.data;

        for (const prov of provinces) {
            await prisma.province.upsert({
                where: { id: prov.id },
                update: { name: prov.name },
                create: { id: prov.id, name: prov.name },
            });

            console.log(`- Province: ${prov.name}`);

            // 2. Fetch Regencies for each province
            const regencyRes = await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${prov.id}.json`);
            const regencies = regencyRes.data;

            for (const reg of regencies) {
                await prisma.regency.upsert({
                    where: { id: reg.id },
                    update: { name: reg.name, provinceId: prov.id },
                    create: { id: reg.id, name: reg.name, provinceId: prov.id },
                });
            }
            console.log(`  - Seeded ${regencies.length} regencies`);
        }

        console.log('Seeding completed successfully!');
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
