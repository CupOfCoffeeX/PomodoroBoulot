"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD;
    if (!adminPassword)
        throw new Error('SEED_ADMIN_PASSWORD env var is required');
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: { username: 'admin', passwordHash, role: client_1.UserRole.admin },
    });
    console.log(`Admin créé : ${admin.username}`);
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map