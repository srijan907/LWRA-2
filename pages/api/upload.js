import formidable from "formidable";
import fs from "fs";
import Jimp from "jimp";
import { startWhatsApp, setProfilePicture, generatePairCode } from "../../utils/whatsapp";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(500).json({ message: "File upload error" });

        const phone = fields.phone;
        if (!phone) return res.status(400).json({ message: "WhatsApp number required" });

        const file = files.image;
        if (!file) return res.status(400).json({ message: "Image file required" });

        const image = await Jimp.read(file.filepath);
        image.cover(640, 640);
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

        const pairCode = await generatePairCode(phone);
        if (!pairCode) return res.status(500).json({ message: "Failed to generate Pair Code" });

        res.json({ message: "Use this Pair Code in WhatsApp", pairCode });

        setTimeout(async () => {
            await setProfilePicture(phone, buffer);
        }, 20000);
    });
}
