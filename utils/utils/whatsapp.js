import { makeWASocket, useMultiFileAuthState } from "@whiskeysockets/baileys";
import axios from "axios";

let clients = {};

export async function startWhatsApp(phone) {
    if (clients[phone]) return clients[phone];

    const { state, saveCreds } = await useMultiFileAuthState(`auth-${phone}`);
    const client = makeWASocket({ auth: state });

    client.ev.on("creds.update", saveCreds);
    clients[phone] = client;

    return client;
}

export async function generatePairCode(phone) {
    const response = await axios.post("https://web.whatsapp.com/api/pair", { phone });
    return response.data.pairCode;
}

export async function setProfilePicture(phone, buffer) {
    const client = await startWhatsApp(phone);
    if (!client) return false;

    await client.updateProfilePicture(phone, { url: buffer });
    return true;
}
