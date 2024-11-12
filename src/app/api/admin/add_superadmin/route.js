import { hashPassword } from "@/lib/auth"
import { generateTempPassword } from "@/utils/generateTempPass"
import connectDB from "@/lib/mongodb"
import { NextResponse } from "next/server"
import sendEmail from "@/utils/sendEmail"

const GET = async(req, res) => {
    const db = await connectDB()
    const password = generateTempPassword()

    console.log("DB", db)
        
    db.collection('admins').insertOne({
        name: 'Sayan Biswas',
        email: 'sayanbiswas6073@gmail.com',
        mobile: 9932981720,
        password: await hashPassword(password),
        superadmin: true,
    })

    console.log("database entry")

    sendEmail('sayanbiswas6073@gmail.com', 'Welcome to Taste Perfect', `
        <h1></h1>Your Temporary Password is: ${password}</h1>
    `);

      console.log("Email sent")

    return NextResponse.json({ "success": "true" }, { status: 200 });
}

export { GET}