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

        // 1. Fetch all public IDs in the folder
        const searchResults = await cloudinary.v2.search
            .expression(`folder:${folder}/*`)
            .max_results(400)
            .execute();

        const publicIds = searchResults.resources.map((file: any) => file.public_id);

        if (publicIds.length === 0) {
            return res.status(404).json({ error: "No images found in the specified folder." });
        }

        // 2. Tag all these images dynamically (Cloudinary supports up to 1000 in one batch)
        const tagName = "mf_profissional_zip_download";
        await cloudinary.v2.uploader.add_tag(tagName, publicIds);

        // 3. Generate a Cloudinary GET URL that natively zips everything with this tag
        const url = cloudinary.v2.utils.download_zip_url({
            tags: tagName,
            resource_type: "image"
        });

        res.redirect(url);
    } catch (error: any) {
        console.error("Error generating ZIP url:", error);
        res.status(500).json({ error: "Failed to generate download url", details: error.message || error.toString() });
    }
}
