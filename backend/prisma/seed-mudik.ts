import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding 50 Random Mudik Entries...');

    try {
        const vehicles = ['Mobil', 'Motor', 'Bus', 'Kereta', 'Lainnya'];
        const allProvs = await prisma.province.findMany();
        const allRegs = await prisma.regency.findMany();

        if (allProvs.length === 0 || allRegs.length === 0) {
            console.error('Provinces or Regencies not found. Please ensure regions are seeded.');
            return;
        }

        // Clear existing entries to reach exactly 50 as requested (plus the main user)
        await prisma.mudikEntry.deleteMany({});
        await prisma.user.deleteMany({
            where: { email: { not: 'devops1085@gmail.com' } }
        });

        // Ensure devops1085 exists
        const yunus = await prisma.user.upsert({
            where: { email: 'devops1085@gmail.com' },
            update: { name: 'Yunus' },
            create: {
                googleId: 'google-yunus-seed-unique',
                email: 'devops1085@gmail.com',
                name: 'Yunus',
            },
        });

        // Main user entry
        await prisma.mudikEntry.create({
            data: {
                userId: yunus.id,
                tanggal: new Date(2026, 3, 10),
                jam: '08:00',
                provinsiAsalId: '31',
                kotaAsalId: '3171',
                provinsiTujuanId: '33',
                kotaTujuanId: '3328',
                kendaraan: 'Mobil',
                status: 'BERANGKAT',
            },
        });

        console.log('Generating 50 random entries...');
        for (let i = 0; i < 50; i++) {
            const user = await prisma.user.create({
                data: {
                    googleId: `dummy-google-id-${i}-${Date.now()}`,
                    email: `dummy-traveler-${i}-${Date.now()}@example.com`,
                    name: `Dummy Traveler ${i}`,
                }
            });

            const provA = allProvs[Math.floor(Math.random() * allProvs.length)];
            const kotaA = allRegs.filter(r => r.provinceId === provA.id)[0] || allRegs[0];
            const provT = allProvs[Math.floor(Math.random() * allProvs.length)];
            const kotaT = allRegs.filter(r => r.provinceId === provT.id)[0] || allRegs[0];

            const isReturn = i % 3 === 0; // Some return flow data
            const day = isReturn ? (Math.floor(Math.random() * 5) + 20) : (Math.floor(Math.random() * 10) + 5);

            await prisma.mudikEntry.create({
                data: {
                    userId: user.id,
                    tanggal: new Date(2026, 3, day),
                    jam: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:00`,
                    provinsiAsalId: provA.id,
                    kotaAsalId: kotaA.id,
                    provinsiTujuanId: provT.id,
                    kotaTujuanId: kotaT.id,
                    kendaraan: vehicles[Math.floor(Math.random() * vehicles.length)],
                    status: isReturn ? 'BALIK' : 'BERANGKAT',
                }
            });
        }

        console.log('Successfully seeded 50 dummy entries!');
    } catch (err) {
        console.error('Seeding Error:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
