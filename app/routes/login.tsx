import {
  LoaderFunctionArgs,
  redirect,
  ActionFunctionArgs,
} from "@remix-run/node";
import { getUserId, createUserSession } from "~/lib/session.server";
import { verifyLogin } from "~/lib/db.server";
import { logInFormValidation } from "~/lib/validation";
import { Form, Link, useActionData } from "@remix-run/react";
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUserId(request);
  if (user) {
    return redirect("/dashboard");
  }
  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const result = logInFormValidation.safeParse(data);
  if (!result.success) {
    return {
      error: "Invalid input data",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }
  const verified = await verifyLogin(result.data);
  if (!verified) throw new Error("Unable to log in");
  const redirectTo =
    new URL(request.url).searchParams.get("redirectTo") || "/dashboard";
  return createUserSession(verified.id, redirectTo);
}

const Login = () => {
  const actionData = useActionData<typeof action>();
  actionData;
  return (
    <div>
      <Form method="post">
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" required />
        </div>
        <div>
          <button type="submit">Log in</button>
        </div>
      </Form>
      <div>
        <p>
          do not have an Account<Link to="/register">create account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
