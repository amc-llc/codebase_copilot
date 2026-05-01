// SaaS-only database configuration
// This file is not used in OSS mode
import { isSaaSMode } from '@/lib/config/app-mode';

// Mock PrismaClient type for OSS mode
type PrismaClient = any;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a mock prisma client for OSS mode
const createMockPrisma = (): any => ({
  $queryRaw: async () => { throw new Error('Database not available in OSS mode'); },
  user: {
    findUnique: async () => null,
    create: async () => { throw new Error('Database not available in OSS mode'); },
  },
});

// Only import PrismaClient in SaaS mode
let PrismaClientClass: any;
if (isSaaSMode()) {
  try {
    const prismaModule = require('@prisma/client');
    PrismaClientClass = prismaModule.PrismaClient;
  } catch (error) {
    console.warn('Prisma client not available');
  }
}

export const prisma =
  globalForPrisma.prisma ??
  (PrismaClientClass
    ? new PrismaClientClass({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    : createMockPrisma());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper function to check if database is available
export async function isDatabaseAvailable(): Promise<boolean> {
  if (!isSaaSMode()) return false;
  
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Initialize database with default admin account
export async function initializeDatabase() {
  if (!isSaaSMode()) return;

  try {
    const { defaultAdmin } = await import('@/lib/config/app-mode');
    const bcrypt = await import('bcryptjs');

    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: defaultAdmin.email },
    });

    if (!existingAdmin) {
      // Hash password
      const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);

      // Create admin user
      await prisma.user.create({
        data: {
          email: defaultAdmin.email,
          password: hashedPassword,
          name: defaultAdmin.name,
          role: defaultAdmin.role as any,
          emailVerified: new Date(),
        },
      });

      console.log('✅ Default admin account created');
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export default prisma;

// Made with Bob
