import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getUserId } from "~/lib/session.server";
import { getUserById } from "~/lib/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  //getting userID from cookie
  const user = await getUserId(request);
  if (!user) {
    return redirect("/login");
  }
  // getting  user data: name, username, email etc
  const userData = await getUserById(user);
  if (!userData) throw new Error("No user Data");
  // fetching user friends
  //fetching user conversation
  //fetching all the people accept those who are friends of user
}

const Dashboard = () => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export default Dashboard;
