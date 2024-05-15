import type { Location } from '@prisma/client';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


async function addLocation(name: string) {
    return await prisma.location.upsert({
        where: { name: name },
        update: {},
        create: {
            name: name,
        },
    })
}

async function addUser(email: string, name: string) {
    return await prisma.user.upsert({
        where: { email: email },
        update: {},
        create: {
            email: email,
            name: name,
        },
    })
}

async function addSpace(title: string, description: string, location: Location) {
    return await prisma.space.upsert({
        where: {
            title_locationId: {
                title: title,
                locationId: location.id,
            }
        },
        update: {},
        create: {
            title: title,
            description: description,
            locationId: location.id,
        },
    })
}

async function addTimeSlot(date: Date) {
    return await prisma.timeSlot.upsert({
        where: {
            date: date,
        }, update: {}
        , create: {
            date: date
        }
    })
}

async function addAdminUser(email: string) {
    return await prisma.adminUsers.upsert({
        where: {
            email: email
        },
        update: {},
        create: {
            email: email
        }
    })
}

async function addOwnerUser(email: string) {
    return await prisma.ownerUsers.upsert({
        where: {
            email: email
        },
        update: {},
        create: {
            email: email
        }
    })
}

async function main() {
    const alice = await addUser('alice@prisma.io', 'Alice')
    const bob = await addUser('bob@prisma.io', 'Bob')

    console.log({ alice, bob })

    const snell = await addLocation("Snell")
    const curry = await addLocation("Curry")

    console.log({ snell, curry })

    const spaces = [
        await addSpace("101", "Office Room", snell),
        await addSpace("102", "Office Room", snell),
        await addSpace("103", "Office Room", snell),
        await addSpace("104", "Office Room", snell),
        await addSpace("101", "Office Room", curry),
        await addSpace("102", "Office Room", curry),
        await addSpace("103", "Office Room", curry),
        await addSpace("104", "Office Room", curry),
    ]

    console.log({ spaces })

    const startDate = new Date()

    startDate.setFullYear(2022, 11, 9)
    startDate.setHours(8, 0, 0, 0)

    console.log({ startDate })

    for (let day = 0; day < 5; day++) {
        for (let hour = 0; hour < 12; hour++) {
            const timeSlot = new Date(startDate)

            timeSlot.setDate(startDate.getDate() + day)
            timeSlot.setHours(startDate.getHours() + hour)

            await addTimeSlot(timeSlot)
        }

    }

    // setting the admin and owner users
    await addAdminUser("sharunksplus@gmail.com")
    await addAdminUser("rajastelang@gmail.com")
    await addOwnerUser("sharunksplus@gmail.com")
    await addOwnerUser("apoorva22101997@gmail.com")
    // await addOwnerUser("sharunkumar.ks.95@gmail.com")
    // await addOwnerUser("rajastelang@gmail.com")
    // await addOwnerUser("apoorva22jain@gmail.com")
    // await addOwnerUser("mihirsheth77@gmail.com")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })