import { hashPassword } from "@/lib/auth"
import { generateTempPassword } from "@/utils/generateTempPass"
import connectDB from "@/lib/mongodb"
import { NextResponse } from "next/server"

const GET = async(req, res) => {
    const db = await connectDB()
    const password = generateTempPassword()
        
    db.collection('admins').insertOne({
        name: 'Sayan Biswas',
        email: 'sayanbiswas6073@gmail.com',
        mobile: 9932981720,
        password: await hashPassword(password),
        superadmin,
    })

    sendEmail(email, 'Welcome to Taste Perfect', `
        <h1></h1>Your Temporary Password is: ${password}</h1>
    `);

    return NextResponse.json({}, { status: 200 });
}

export { GET}