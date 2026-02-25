import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Generating 100 random Mudik entries...');

    try {
        const provinces = await prisma.province.findMany();
        const regencies = await prisma.regency.findMany();

        if (provinces.length === 0 || regencies.length === 0) {
            console.error('Provinces or Regencies not found. Please run seed-regions first.');
            return;
        }

        const vehicles = ['Mobil', 'Motor', 'Bus', 'Kereta', 'Lainnya'];
        const statuses = ['BERANGKAT', 'SAMPAI'];

        for (let i = 0; i < 100; i++) {
            // Create unique user for each entry
            const user = await prisma.user.create({
                data: {
                    googleId: `test-google-id-${Date.now()}-${i}`,
                    email: `test-user-${i}@example.com`,
                    name: `Test User ${i}`,
                }
            });

            // Pick random regions
            const provAsal = provinces[Math.floor(Math.random() * provinces.length)];
            const regenciesAsal = regencies.filter(r => r.provinceId === provAsal.id);
            const kotaAsal = regenciesAsal[Math.floor(Math.random() * regenciesAsal.length)];

            const provTujuan = provinces[Math.floor(Math.random() * provinces.length)];
            const regenciesTujuan = regencies.filter(r => r.provinceId === provTujuan.id);
            const kotaTujuan = regenciesTujuan[Math.floor(Math.random() * regenciesTujuan.length)];

            await prisma.mudikEntry.create({
                data: {
                    userId: user.id,
                    tanggal: new Date(2026, 3, Math.floor(Math.random() * 30) + 1), // April 2026
                    jam: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00`,
                    provinsiAsalId: provAsal.id,
                    kotaAsalId: kotaAsal.id,
                    provinsiTujuanId: provTujuan.id,
                    kotaTujuanId: kotaTujuan.id,
                    kendaraan: vehicles[Math.floor(Math.random() * vehicles.length)],
                    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
                }
            });

            if (i % 10 === 0) console.log(`Created ${i} entries...`);
        }

        console.log('100 random Mudik entries generated successfully!');
    } catch (err) {
        console.error('Error generating random data:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
