import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- PROJECTS ---')
    const projects = await prisma.project.findMany({
        select: {
            id: true,
            name: true,
            userId: true,
            user: {
                select: {
                    email: true,
                    githubLogin: true
                }
            }
        }
    })
    console.log(JSON.stringify(projects, null, 2))

    console.log('--- USERS ---')
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            githubLogin: true
        }
    })
    console.log(JSON.stringify(users, null, 2))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
