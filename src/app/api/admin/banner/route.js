import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadDir = path.join(process.cwd().toString(), 'public', 'banners');

const POST = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        const form = await req.formData();
        const file = await form.get('image');
        if (!file) resolve(NextResponse.json({ error: 'File save error' }, { status: 500 }));

        fs.readdir(uploadDir, async (error, files) => {
            if (error) {
                resolve(NextResponse.json({ error: 'Directory read error', status: 500 }));
            }
            const newPath = path.join(uploadDir, `banner${files.length + 1}.png`);

            const buffer = new Uint8Array(await file.arrayBuffer());

            fs.writeFile(newPath.toString(), buffer, (err) => {
                console.log("File written successfully")
                if (err !== null) {
                    console.log(err)
                    resolve(NextResponse.json({ error: 'File save error' }, { status: 500 }));
                }
                resolve(NextResponse.json({ 'message': 'File uploaded successfully', 'status': 200 }));
            })
        })
    });
};

const GET = async (req, res) => {
    return new Promise(async (resolve, reject) => {
        fs.readdir(uploadDir, async (error, files) => {
            if (error) {
                resolve(NextResponse.json({ error: 'Directory read error', status: 500 }));
            }
            console.log("uploadDir", uploadDir)
            // console.log(files)
            resolve(NextResponse.json({ banners: files.map(file => `/banners/${file}`) }));
        });
    });
};

const DELETE = async (req, res) => {
    const { url } = await req.json();
    return new Promise(async (resolve, reject) => {
        console.log(path.join(process.cwd().toString(), 'public', url))
        fs.unlink(path.join(process.cwd().toString(), 'public', url).toString(), (err) => {
            if (err) {
                resolve(NextResponse.json({ error: 'File delete error', status: 500 }));
            }
            resolve(NextResponse.json({ message: 'File deleted successfully', status: 200 }));
        });
    });
};

export { POST, GET, DELETE };