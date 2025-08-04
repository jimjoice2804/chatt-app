import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
// import { z } from "zod";
import { registerFormInput } from "~/lib/validation";
import { createUser } from "~/lib/db.server";
import { createUserSession } from "~/lib/session.server";
import { Form, Link } from "@remix-run/react";

//if already user logged in, to redirect to dashboard
export async function loader({ request }: LoaderFunctionArgs) {
  const { getUserId } = await import("~/lib/session.server");
  const userId = await getUserId(request);
  if (userId) return redirect("/dashboard");
  return null;
}

//for Making a POST request to create user
export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    const result = registerFormInput.safeParse(data);
    if (!result.success) throw new Error("No input found");

    const sendData = await createUser(result.data);
    if (!sendData) {
      return {
        message: "No data can be seen",
      };
    }
    const redirectTo =
      new URL(request.url).searchParams.get("redirectTo") || "/dashboard";
    return createUserSession(sendData.id, redirectTo);
  } catch (error) {
    console.log("Got error during making POST request to createUser", error);
    throw error;
  }
}

export default function Register() {
  return (
    <>
      <div>
        <h1>Register</h1>
        <Form method="post">
          <div>
            <label htmlFor="name">name</label>
            <input type="text" name="name" id="name" />
          </div>

          <div>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" />
          </div>

          <div>
            <label htmlFor="email">email</label>
            <input type="email" name="email" id="email" />
          </div>

          <div>
            <label htmlFor="password">password</label>
            <input type="password" name="password" id="password" />
          </div>

          <div>
            <button type="submit">Submit</button>
          </div>
        </Form>
        <p>
          Already have an Account? <Link to="/login">Sign in</Link>
        </p>
      </div>
      Signup
    </>
  );
}
