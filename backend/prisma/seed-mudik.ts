import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Final DYNAMIC Seeding...');

    try {
        const provinces = await prisma.province.findMany();
        const regencies = await prisma.regency.findMany();

        if (provinces.length === 0 || regencies.length === 0) {
            console.error('Provinces or Regencies not found. Run seed-regions first.');
            return;
        }

        const vehicles = ['Mobil', 'Motor', 'Bus', 'Kereta', 'Lainnya'];

        // Ensure Yunus exists
        const yunusEmail = 'yunus@gmail.com';
        const yunus = await prisma.user.upsert({
            where: { email: yunusEmail },
            update: { name: 'Yunus' },
            create: {
                googleId: `google-yunus-${Date.now()}`,
                email: yunusEmail,
                name: 'Yunus',
            },
        });

        // Use random valid IDs from the DB
        const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

        // Clear existing to avoid unique constraint issues if re-running
        await prisma.mudikEntry.deleteMany({});

        // Yunus Mudik Entry
        const startProv = pickRandom(provinces);
        const startKota = regencies.find(r => r.provinceId === startProv.id) || regencies[0];
        const endProv = pickRandom(provinces);
        const endKota = regencies.find(r => r.provinceId === endProv.id) || regencies[0];

        await prisma.mudikEntry.create({
            data: {
                userId: yunus.id,
                tanggal: new Date(2026, 3, 10),
                jam: '08:00',
                provinsiAsalId: startProv.id,
                kotaAsalId: startKota.id,
                provinsiTujuanId: endProv.id,
                kotaTujuanId: endKota.id,
                kendaraan: 'Mobil',
                status: 'BERANGKAT',
            },
        });

        console.log('Generating 100 more entries...');
        for (let i = 0; i < 100; i++) {
            const timestamp = Date.now() + i;
            const user = await prisma.user.create({
                data: {
                    googleId: `google-id-${timestamp}`,
                    email: `user-${timestamp}@test.com`,
                    name: `Pemudik ${i}`,
                }
            });

            const pA = pickRandom(provinces);
            const kA = regencies.find(r => r.provinceId === pA.id) || regencies[0];
            const pT = pickRandom(provinces);
            const kT = regencies.find(r => r.provinceId === pT.id) || regencies[0];

            const isBalik = i % 4 === 0;
            const day = isBalik ? (Math.floor(Math.random() * 7) + 20) : (Math.floor(Math.random() * 10) + 5);

            await prisma.mudikEntry.create({
                data: {
                    userId: user.id,
                    tanggal: new Date(2026, 3, day),
                    jam: '12:00',
                    provinsiAsalId: pA.id,
                    kotaAsalId: kA.id,
                    provinsiTujuanId: pT.id,
                    kotaTujuanId: kT.id,
                    kendaraan: pickRandom(vehicles),
                    status: isBalik ? 'BALIK' : 'BERANGKAT',
                }
            });
        }

        console.log('Seeding Success!');
    } catch (err) {
        console.error('Final attempt error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
