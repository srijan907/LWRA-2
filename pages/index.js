import { useState } from "react";

export default function Home() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [phone, setPhone] = useState("");
    const [pairCode, setPairCode] = useState(null);
    const [message, setMessage] = useState("");

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async () => {
        if (!image) return alert("Please upload an image!");
        if (!phone) return alert("Please enter your WhatsApp number!");

        const formData = new FormData();
        formData.append("image", image);
        formData.append("phone", phone);

        setMessage("Generating Pair Code...");

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (data.pairCode) {
            setPairCode(data.pairCode);
            setMessage("Use this Pair Code in WhatsApp.");
        } else {
            setMessage(data.message);
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Set WhatsApp Full DP</h1>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {preview && <img src={preview} alt="Preview" style={{ width: "200px", height: "200px", objectFit: "cover" }} />}
            
            <input type="text" placeholder="Enter WhatsApp Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            
            <button onClick={handleSubmit}>Upload & Get Pair Code</button>

            {pairCode && <h3>Your Pair Code: {pairCode}</h3>}
            {message && <p>{message}</p>}
        </div>
    );
}
