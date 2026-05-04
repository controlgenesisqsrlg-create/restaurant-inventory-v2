import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: {
      name: 'Admin',
      description: 'Full system access',
      isSystem: true
    }
  })

  const modules = [
    { name: 'users', displayName: 'User Management', icon: '👥', path: '/admin/users' },
    { name: 'outlets', displayName: 'Outlet Management', icon: '🏢', path: '/admin/outlets' },
    { name: 'regions', displayName: 'Region Management', icon: '🌍', path: '/admin/regions' },
    { name: 'roles', displayName: 'Roles & Permissions', icon: '🔐', path: '/admin/roles' },
    { name: 'inventory', displayName: 'Inventory', icon: '📦', path: '/inventory' },
    { name: 'requisition', displayName: 'Requisitions', icon: '📝', path: '/requisitions' },
    { name: 'issuance', displayName: 'Issuance', icon: '🚚', path: '/issuance' },
    { name: 'eod', displayName: 'End of Day', icon: '🌙', path: '/eod' },
    { name: 'reports', displayName: 'Reports', icon: '📊', path: '/reports' },
    { name: 'menu', displayName: 'Menu Management', icon: '🍽️', path: '/menu' },
    { name: 'procurement', displayName: 'Procurement', icon: '🛒', path: '/procurement' },
    { name: 'budget', displayName: 'Budget', icon: '💰', path: '/budget' }
  ]

  for (const mod of modules) {
    await prisma.module.upsert({
      where: { name: mod.name },
      update: {},
      create: mod
    })
  }

  const actions = ['create', 'read', 'update', 'delete', 'approve', 'verify', 'export']
  
  for (const mod of modules) {
    for (const action of actions) {
      await prisma.permission.upsert({
        where: {
          moduleId_action: {
            moduleId: (await prisma.module.findUnique({ where: { name: mod.name } }))!.id,
            action
          }
        },
        update: {},
        create: {
          moduleId: (await prisma.module.findUnique({ where: { name: mod.name } }))!.id,
          action,
          description: `${action} ${mod.displayName}`
        }
      })
    }
  }

  const allPermissions = await prisma.permission.findMany()
  const allModules = await prisma.module.findMany()

  for (const mod of allModules) {
    await prisma.roleModule.upsert({
      where: {
        roleId_moduleId: {
          roleId: adminRole.id,
          moduleId: mod.id
        }
      },
      update: {},
      create: {
        roleId: adminRole.id,
        moduleId: mod.id
      }
    })

    const modulePermissions = allPermissions.filter(p => p.moduleId === mod.id)
    for (const perm of modulePermissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: adminRole.id,
            permissionId: perm.id
          }
        },
        update: {},
        create: {
          roleId: adminRole.id,
          permissionId: perm.id
        }
      })
    }
  }

  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const adminOutlet = await prisma.outlet.upsert({
    where: { code: 'HQ-001' },
    update: {},
    create: {
      name: 'Headquarters',
      code: 'HQ-001',
      isActive: true
    }
  })

  await prisma.user.upsert({
    where: { email: 'admin@genesis.com' },
    update: {},
    create: {
      name: 'System Administrator',
      email: 'admin@genesis.com',
      password: hashedPassword,
      roleId: adminRole.id,
      primaryOutletId: adminOutlet.id,
      isActive: true
    }
  })

  console.log('✅ Seeding completed!')
  console.log('📧 Admin user: admin@genesis.com')
  console.log('🔑 Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
