import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../utils/cloudinary";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const folder = process.env.CLOUDINARY_FOLDER;
        if (!folder) {
            return res.status(500).json({ error: "CLOUDINARY_FOLDER is not set" });
        }

        // Generate a signed URL to download all images matching the folder prefix
        const url = cloudinary.v2.utils.download_zip_url({
            prefixes: folder,
            resource_type: "image",
        });

        // Redirect the user directly to the ZIP download prompt
        res.redirect(url);
    } catch (error) {
        console.error("Error generating ZIP url:", error);
        res.status(500).json({ error: "Failed to generate download url" });
    }
}
