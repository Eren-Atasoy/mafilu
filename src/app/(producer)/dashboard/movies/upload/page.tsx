import { redirect } from "next/navigation";

// Redirect to the new movie page
export default function UploadPage() {
  redirect("/movies/new");
}

