import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { logout } from "~/lib/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    return logout(request);
  } catch (error) {
    console.error("logout error", error);
    return redirect("/login");
  }
}
